import eel
import serial
import serial.tools.list_ports
import pyvisa
import os
import Run

# import importlib.util
  
# # specify the module that needs to be 
# # imported relative to the path of the 
# # module
# spec=importlib.util.spec_from_file_location("gfg","articles/gfg.py")
  
# # creates a new module based on spec
# foo = importlib.util.module_from_spec(spec)
  
# # executes the module in its own namespace
# # when a module is imported or reloaded.
# spec.loader.exec_module(foo)
  
# foo.GFG.method_in()
# foo.method_out()

eel.init('www')

run = Run.Run()

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
def start_run(configuration):
    print("Start run with",configuration)
    run.start_run(configuration)
    return "ok"

@eel.expose
def stop_run():
    print("Stop run")
    run.stop_run()
    return "ok"

eel.start('index.html')