@RD /S /Q "./dist"
@RD /S /Q "./build"
python -m eel .\main.py .\www\ --hiddenimport minimalmodbus --onefile --icon .\www\favicon.ico --name "Sensor array"
xcopy .\smu_drivers\ .\dist\smu_drivers\ /E
xcopy .\led_drivers\ .\dist\led_drivers\ /E
pip freeze > .\requirements.txt