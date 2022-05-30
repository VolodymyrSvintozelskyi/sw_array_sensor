import threading as T
import numpy as np
import time
from pathlib import Path
from datetime import datetime
import traceback
import serial
import importlib.util

class COMM:
    def __init__(self, port) -> None:
        self.port = serial.Serial(port,115200)
        resp = self.port.readline().decode().strip()
        assert resp == "Ready!", "Invalid COMM responce"
    def wait_responce(self):
        answered = False
        start_time = time.time()
        while (self.port.in_waiting > 0) or not answered:
            resp = self.port.readline().decode().strip()
            if resp == '0' or resp == '1':
                answered = True
            else:
                print(resp)
            if (time.time() - start_time) > 5:
                self.disconnect()
                raise TimeoutError("COMM timeout exception")
    def setPin(self, pin=""):
        self.port.write(pin.encode())
        self.wait_responce()
    def setDelay(self, delay):
        self.port.write("setdelay {}".format(delay).encode())
        self.wait_responce()
    def disconnect(self):
        self.port.close()

class Run(T.Thread):
    def __init__(self, update_signal_chart = lambda *args: None, send_stop_run = lambda *args:None):
        super(Run, self).__init__(daemon=True)
        self._stop_event = T.Event()
        self.update_signal_chart = update_signal_chart
        self.send_stop_run = send_stop_run
        self.pixel_time_left = -1
        self.total_time_left = -1

    def start_run(self,configuration):
        self.conf = configuration
        self._stop_event.clear()
        self.outputfolder = "./output/{}".format(datetime.now().strftime("%m_%d_%Y-%H_%M_%S"))
        Path(self.outputfolder).mkdir(parents=True, exist_ok=True)
        self.start()

    def stop_run(self):
        self._stop_event.set()

    def stopped(self):
        return self._stop_event.is_set()

    def run(self):
        time.sleep(0.1)
        smu = None
        led = None
        comm = None
        try:
  
            smu_mod_spec=importlib.util.spec_from_file_location("{}".format(self.conf["smu_type"]),"smu_drivers/{}.py".format(self.conf["smu_type"]))
            smu_mod = importlib.util.module_from_spec(smu_mod_spec)
            smu_mod_spec.loader.exec_module(smu_mod)

            led_mod_spec=importlib.util.spec_from_file_location("{}".format(self.conf["led_type"]),"led_drivers/{}.py".format(self.conf["led_type"]))
            led_mod = importlib.util.module_from_spec(led_mod_spec)
            led_mod_spec.loader.exec_module(led_mod)
            
            smu = smu_mod.SMU(self.conf["smu_port"])
            led = led_mod.LED(self.conf["led_port"])
            comm = COMM(self.conf["comm_port"])
            comm.setDelay(self.conf["comm_relay_delay"])
            
            for p_iter, pixel in enumerate(self.conf["pixel_loop"]["loop"]):
                self.current_pixel = pixel
                comm.setPin(pixel["ext"] + pixel["inn"])
                led.setCurrent(pixel["curr"])
                pixel_start_time = time.time()
                self.update_signal_chart(pixel_no = p_iter)
                
                with open("{}/{}{}.txt".format(self.outputfolder, pixel["ext"], pixel["inn"]), 'a') as f:
                    print("#pixel_time[s]\tV[V]\tI[A]",file=f)

                    for v_iter,volt in enumerate(np.array(self.conf["smu_v_profile"])* self.conf["smu_v_factor"]):
                        smu.applyV(volt)
                        time.sleep(self.conf["smu_t_step"])
                        real_v,i = smu.measureVI()
                        print("{}\t{}\t{}".format(time.time()-pixel_start_time, real_v, i), file=f)
                        self.pixel_time_left = (len(self.conf["smu_v_profile"]) - v_iter) * self.conf["smu_t_step"]
                        self.total_time_left = (len(self.conf["pixel_loop"]["loop"]) - p_iter - 1) * len(self.conf["smu_v_profile"])*  self.conf["smu_t_step"] + self.pixel_time_left
                        self.update_signal_chart(real_v,i, p_iter)
                        if (self._stop_event.is_set()):
                            break
                    else:
                        smu.applyV(0)
                        continue
                    break  
            self.send_stop_run()
            smu.disconnect()
            led.disconnect()
            comm.disconnect()
        except Exception as e:
            self.send_stop_run(False, "Runtime exception: {}".format(type(e).__name__))
            print(traceback.format_exc())
            if not (smu is None): 
                try:
                    smu.disconnect()
                except Exception:
                    print(traceback.format_exc())
            if not (led is None): 
                try:
                    led.disconnect()
                except Exception:
                    print(traceback.format_exc())
            if not (comm is None):
                try: 
                    comm.disconnect()
                except Exception:
                    print(traceback.format_exc())
            
        
                