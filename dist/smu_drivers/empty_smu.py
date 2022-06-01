import imp
from random import random
import random

class SMU:
    def __init__(self, port) -> None:
        print("SMU open: ", port)

    def applyV(self, v):
        print("V applied")
        
    def measureVI(self):
        curr = random.random()
        return [curr*curr, curr]

    def disconnect(self):
        print("SMU switched off")