import json
from typing import Literal
import lxml
from kafka import KafkaProducer, KafkaConsumer


class TestObject:
    def __init__(self, name: str, distance: int, angle: int):
        self.name = name
        self.distance = distance
        self.angle = angle

class KafkaAPI:
    @staticmethod
    def connect_kafka_producer() -> KafkaProducer:
        _producer = None
        try:
            _producer = KafkaProducer(bootstrap_servers=['192.168.57.12:9092'])
        except Exception as ex:
            print('Exception while connecting Kafka')
            print(str(ex))
        finally:
            return _producer

    @staticmethod
    def publish_message(producer_instance: KafkaProducer, topic_name: str, key: str, value: str):
        try:
            key_bytes = bytes(key, encoding='utf-8')
            value_bytes = bytes(value, encoding='utf-8')
            producer_instance.send(topic_name, key=key_bytes, value=value_bytes)
            producer_instance.flush()
            #Sprint('Message published successfully.')
        except Exception as ex:
            print('Exception in publishing message')
            print(str(ex))

    @staticmethod
    def Publish(topic: str, time: int, data: object):
        kafka_producer = KafkaAPI.connect_kafka_producer()
        newDict = data.__dict__
        newDict["time"] = time
        KafkaAPI.publish_message(kafka_producer, topic, 'raw', json.dumps(newDict))
        if kafka_producer is not None:
            kafka_producer.close()

    @staticmethod
    def Subscribe(topic: str, duration: int, offset: Literal['earliest', 'latest'], callback: any):
        consumer = KafkaConsumer(topic, auto_offset_reset=offset,
                                 bootstrap_servers=['192.168.57.12:9092'], consumer_timeout_ms=duration)
        for msg in consumer:
            newDataPoint = json.loads(msg.value)
            callback(newDataPoint)
        if consumer is not None:
            consumer.close()

if __name__ == '__main__':
    newDataPoint = TestObject("gazer", 5, 90)
    KafkaAPI.Publish('topic3', 34, newDataPoint)
    KafkaAPI.Subscribe('topic3', 3000, 'earliest', print)

