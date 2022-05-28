import eel
import serial
import serial.tools.list_ports

eel.init('www')

@eel.expose
def getComPortList():
    return [port for port,desc,hwid in sorted(serial.tools.list_ports.comports())]
    # return ["COM3", "COM4"]
# getComPortList()

eel.start('index.html')