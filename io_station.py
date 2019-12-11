#
# example ESP8266 or ESP32 Huzzah mqtt publish/subscribe with io.adafruit.com
# phil van allen
#
# thanks to https://github.com/MikeTeachman/micropython-adafruit-mqtt-esp8266/blob/master/mqtt-to-adafruit.py
#
import network
import time
import machine
import ssd1306
from umqtt.simple import MQTTClient
# from servo import Servo

# pin = machine.Pin(13, machine.Pin.OUT) # LED on the board
button = machine.Pin(13, machine.Pin.IN)
# servo_pin = machine.Pin(26) # set pin4 for servo

# Setup for potentiometers
# adc1 = machine.ADC(machine.Pin(33))
# adc1.atten(machine.ADC.ATTN_11DB)
#
# adc2 = machine.ADC(machine.Pin(39))
# adc2.atten(machine.ADC.ATTN_11DB)

# Setup for rotary switch potentiometer
def set_pin(*num):
    list_num = []
    for item in num:
        pin_id = machine.Pin(item, machine.Pin.IN, machine.Pin.PULL_UP)
        list_num.append(pin_id)
    return list_num


def read_value(list_knob):
    list_value = []
    for item in range(len(list_knob)):
        list_value.append(list_knob[item].value())
    return list_value


def set_result(import_list):

    export_value = 0

    if import_list == [1, 1, 1, 1]:
        export_value = 10
    elif import_list == [0, 1, 1, 1]:
        export_value = 1
    elif import_list == [1, 0, 1, 1]:
        export_value = 2
    elif import_list == [0, 0, 1, 1]:
        export_value = 3
    elif import_list == [1, 1, 0, 1]:
        export_value = 4
    elif import_list == [0, 1, 0, 1]:
        export_value = 5
    elif import_list == [1, 0, 0, 1]:
        export_value = 6
    elif import_list == [0, 0, 0, 1]:
        export_value = 7
    elif import_list == [1, 1, 1, 0]:
        export_value = 8
    elif import_list == [0, 1, 1, 0]:
        export_value = 9

    return export_value

knob_crowd = set_pin(26, 25, 4, 14)
knob_quality = set_pin(27, 33, 15, 32)
list_value1 = read_value(knob_crowd)
list_value2 = read_value(knob_quality)
knob_value1 = set_result(list_value1)
knob_value2 = set_result(list_value2)

# OLED Display
i2c = machine.I2C(scl=machine.Pin(22), sda=machine.Pin(23), freq = 100000)
oled = ssd1306.SSD1306_I2C(128, 32, i2c)

def sub_cb(topic, msg):
    value = float(str(msg,'utf-8'))
    print("subscribed value = {}".format(value))
    if value > 4:
      pin.value(1)
    else:
      pin.value(0)

# connect the ESP to local wifi network
#
yourWifiSSID = "ACCD"
yourWifiPassword = "tink1930"
sta_if = network.WLAN(network.STA_IF)
if not sta_if.isconnected():
  sta_if.active(True)
  sta_if.connect(yourWifiSSID, yourWifiPassword)
  while not sta_if.isconnected():
    pass
print("connected to WiFi")

#
# connect ESP to Adafruit IO using MQTT
#
myMqttClient = "AISH"  # replace with your own client name
adafruitUsername = "Aishj"  # can be found at "My Account" at adafruit.com
adafruitAioKey = "041e1f8f40ae42a994e82e83b2e15983"  # can be found by clicking on "VIEW AIO KEYS" when viewing an Adafruit IO Feed
adafruitFeed = adafruitUsername + "/feeds/myfeed" # replace "test" with your feed name
adafruitIoUrl = "io.adafruit.com"

c = MQTTClient(myMqttClient, adafruitIoUrl, 0, adafruitUsername, adafruitAioKey)
c.set_callback(sub_cb)
c.connect()
c.subscribe(bytes(adafruitFeed,'utf-8'))

# Real Time clock
# rtc=machine.RTC()
# rtc.datetime((2019, 11, 15, 4, 10, 07, 0, 0))
# print(rtc.datetime)

# Translating potentiometers readings
# def translate(value, leftMin, leftMax, rightMin, rightMax):
#     # Figure out how 'wide' each range is
#     leftSpan = leftMax - leftMin
#     rightSpan = rightMax - rightMin
#     # Convert the left range into a 0-1 range (float)
#     valueScaled = float(value - leftMin) / float(leftSpan)
#     # Convert the 0-1 range into a value in the right range.
#     return rightMin + int(valueScaled * rightSpan)

# OLED display
def initDisplay():
    print("initDisplay called.")
    oled.init_display()
    oled.fill(0)
    oled.text("hello" , 0, 0)
    oled.show()

initDisplay()

while True:
    list_value1 = read_value(knob_crowd)
    list_value2 = read_value(knob_quality)
    knob_value1 = set_result(list_value1)
    knob_value2 = set_result(list_value2)
    oled.fill(0)
    oled.text("crowd = " + str(knob_value1) , 0, 0)
    oled.text("quality = " + str(knob_value2) , 0, 10)
    oled.show()

    if button.value():
        list_value1 = read_value(knob_crowd)
        list_value2 = read_value(knob_quality)
        knob_value1 = set_result(list_value1)
        knob_value2 = set_result(list_value2)
        print("BUTTON IS PRESSED!!!!!!")
        print("potentiometer 1 = " + str(knob_value1))
        print("potentiometer 2 = " + str(knob_value2))
        sendToCloud = str(knob_value1) + "," + str(knob_value2)
        c.publish(adafruitFeed, sendToCloud)
        # c.publish(adafruitFeed, str(myValue1From1to10))
        # c.publish(adafruitFeed, str(myValue2From1to10))
        time.sleep(0.5)

        oled.fill(0)
        oled.text("crowd = " + str(knob_value1), 0, 0)
        oled.text("quality = " + str(knob_value2), 0, 10)
        oled.text("submitted, yew!" , 0, 20)
        oled.show()

        # value1 = adc1.read()
        # value2 = adc2.read()
        #
        # print("adc1 = " + str(value1))
        # print("adc2 = " + str(value2))
        #
        # myValue1From1to10 = translate(value1, 0, 4095, 0, 10)
        # myValue2From1to10 = translate(value2, 0, 4095, 0, 10)

        # value1 = adc1.read()
        # value2 = adc2.read()
        # myValue1From1to10 = translate(value1, 0, 4095, 0, 10)
        # myValue2From1to10 = translate(value2, 0, 4095, 0, 10)

c.disconnect()
