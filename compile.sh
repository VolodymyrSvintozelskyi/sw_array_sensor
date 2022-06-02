rm -r "./dist-linux"
rm -r "./build-linux"
python -m eel ./main.py ./www/ --hiddenimport minimalmodbus --onefile --icon ./www/favicon.ico --name "Sensor array" --distpath ./dist-linux --workpath ./build-linux
cp -r ./smu_drivers/ ./dist
cp -r ./led_drivers/ ./dist
pip freeze > ./requirements-lnx.txt

