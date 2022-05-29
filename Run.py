import threading as T
import numpy as np
import time
from pathlib import Path
from datetime import datetime
import random

class SMU:
    def __init__(self, port) -> None:
        print("SMU open: ", port)
    def applyV(self, v):
        print("Apply new V:",v)
    def measureI(self):
        print("Measure I")
        return random.random()
    
class LED:
    def __init__(self) -> None:
        print("LED open: ")
    def setCurrent(self, i):
        print("Apply LED I:",i)

class COMM:
    def __init__(self, port) -> None:
        print("COMM open: ", port)
    def setPin(self, pin):
        print("COMM:",pin)
    def setDelay(self, delay):
        print("COMM setdelay",delay)

class Run(T.Thread):
    def __init__(self, update_signal_chart = lambda *args: None):
        super(Run, self).__init__(daemon=True)
        self._stop_event = T.Event()
        self.update_signal_chart = update_signal_chart

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
        smu = SMU(self.conf["smu_port"])
        led = LED()
        comm = COMM(self.conf["comm_port"])
        comm.setDelay(self.conf["comm_relay_delay"])
        
        for p_iter, pixel in enumerate(self.conf["pixel_loop"]["loop"]):
            pixel_start_time = time.time()
            self.current_pixel = pixel
            comm.setPin(pixel["ext"] + pixel["inn"])
            led.setCurrent(pixel["curr"])
            self.update_signal_chart()
            
            with open("{}/{}{}.txt".format(self.outputfolder, pixel["ext"], pixel["inn"]), 'a') as f:
                print("#pixel_time[s]\tV[V]\tI[A]",file=f)

                for v_iter,volt in enumerate(np.array(self.conf["smu_v_profile"])* self.conf["smu_v_factor"]):
                    smu.applyV(volt)
                    time.sleep(self.conf["smu_t_step"])
                    i = smu.measureI()
                    # with open("{}/{}{}.txt".format(self.outputfolder, pixel["ext"], pixel["inn"]), 'a') as f:
                    print("{}\t{}\t{}".format(time.time()-pixel_start_time, volt, i), file=f)
                    self.pixel_time_left = (len(self.conf["smu_v_profile"]) - v_iter) * self.conf["smu_t_step"]
                    self.total_time_left = (len(self.conf["pixel_loop"]["loop"]) - p_iter) * len(self.conf["smu_v_profile"])*  self.conf["smu_t_step"] + self.pixel_time_left
                    # self.update_signal_chart(ext=pixel["ext"],inn=pixel["inn"], v=volt,i=i,p_time = pixel_time_left, t_time = total_time_left, p_iter = p_iter, p_total = len(self.conf["pixel_loop"]["loop"]))
                    self.update_signal_chart(volt,i)
                    if (self._stop_event.is_set()):
                        break
                else:
                    smu.applyV(0)
                    continue
                break  
            
        
                