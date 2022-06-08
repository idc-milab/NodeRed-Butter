import sys
from api import KafkaAPI
from api import TestObject

cur_dist = []

def RET(msg):
    cur_dist.append(msg['distance'])
    

newDataPoint = TestObject("gazer", 5, 90)
KafkaAPI.Publish('topic3', 34, newDataPoint)
KafkaAPI.Subscribe('topic3', 3000, 'earliest', RET)

print(cur_dist[0])
sys.stdout.flush()
