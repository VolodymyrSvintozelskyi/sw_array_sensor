import imp
from random import random
import random

class SMU:
    def __init__(self, port) -> None:
        print("SMU open: ", port)

    def applyV(self, v):
        print("V applied")
        
    def measureVI(self):
        return [random.random(), random.random()]

    def disconnect(self):
        print("SMU switched off")