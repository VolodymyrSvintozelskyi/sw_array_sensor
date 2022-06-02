import eel
import serial
import serial.tools.list_ports
import pyvisa
import os
import Run
import datetime
import queue

eel.init('www')

dashboard_updating = False
#somewhere accessible to both:
callback_queue = queue.Queue()

def update_signal_chart(volt=False, i=False, pixel_no=0, newpixel_flag=True):
    global run
    if dashboard_updating:
        callback_queue.put(lambda : 
            eel.update_run_dashboard_eel(
            run.current_pixel["ext"], 
            run.current_pixel["inn"], 
            run.current_pixel["curr"], 
            volt, 
            i, 
            run.conf["smu_t_step"], 
            pixel_no, 
            len(run.conf["pixel_loop"]["loop"]), 
            str((datetime.timedelta(seconds=round(run.pixel_time_left)))), 
            str((datetime.timedelta(seconds=round(run.total_time_left)))),
            newpixel_flag
            )
        )
        print("Dashboard updating")

def queue_checker():
    while True:
        eel.sleep(0.001) 
        try:
            callback = callback_queue.get(False) #doesn't block
        except queue.Empty: #raised when queue is empty
            # print("Empty!")
            continue
        # if dashboard_updating:
        callback()                 # Use eel.sleep(), not time.sleep()
        # print("Callback!")

eel.spawn(queue_checker)

def send_stop_run(ok = True, msg=""):
    print("Run termination")
    callback_queue.put(lambda : 
        eel.python_stop_run(ok, msg)
    )

# run = Run.Run(update_signal_chart, send_stop_run)
run = None

@eel.expose
def getComPortList():
    return [port for port,desc,hwid in sorted(serial.tools.list_ports.comports())]


@eel.expose
def getVisaPortList():
    rm = pyvisa.ResourceManager()
    return rm.list_resources()

@eel.expose
def getSmuTypesList():
    onlyfiles = [f[:-3] for f in os.listdir("smu_drivers/") if os.path.isfile(os.path.join("smu_drivers/", f)) and f[-3:] == '.py']
    return onlyfiles

@eel.expose
def getLedPortList():
    rm = pyvisa.ResourceManager()
    comports = [port for port,desc,hwid in sorted(serial.tools.list_ports.comports())]
    return list(rm.list_resources()) + comports

@eel.expose
def getLedTypesList():
    onlyfiles = [f[:-3] for f in os.listdir("led_drivers/") if os.path.isfile(os.path.join("led_drivers/", f)) and f[-3:] == '.py']
    return onlyfiles

@eel.expose
def start_run(configuration):
    print("Start run")
    global run
    if (run is None) or (not run.is_alive()):
        run = Run.Run(update_signal_chart, send_stop_run)
        run.start_run(configuration)
        return "ok"
    else:
        return "Thread is alredy alive"

@eel.expose
def stop_run():
    print("Stop run")
    global run
    if not (run is None):
        run.stop_run()
        if run.is_alive():
            run.join()
    return "ok"

@eel.expose
def check_run_state():
    print("Check state")
    global run
    if not (run is None):
        if run.is_alive():
            return "run"
    return "idle"
    
@eel.expose
def enable_dashboard_updating():
    print("Dashboard updating enabled")
    global dashboard_updating
    dashboard_updating = True
    global run
    if not (run is None):
        run.dashboard = True

@eel.expose
def disable_dashboard_updating():
    print("Dashboard updating disabled")
    global dashboard_updating 
    dashboard_updating = False

eel.start('index.html')