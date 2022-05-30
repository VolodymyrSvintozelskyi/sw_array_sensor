python -m eel .\main.py .\www\ --paths .\venv\Lib\site-packages
xcopy .\smu_drivers\ .\dist\main\smu_drivers\ /E
xcopy .\led_drivers\ .\dist\main\led_drivers\ /E
pip freeze > .\requirements.txt