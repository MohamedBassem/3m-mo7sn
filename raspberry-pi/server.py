#!/usr/bin/python

import RPI.GPIO as GPIO
import time
import BaseHTTPServer

# Make sure Pins Reads
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# Setup pin 4 as ouput for sending the signal to the intercom and make it initially zero
INTERCOM_PIN = 4
GPIO.setup(INTERCOM_PIN, GPIO.OUT)
GPIO.output(INTERCOM_PIN, 0)

# Start the web server
WEB_SERVER_PORT = 8080
WEB_SERVER_HOST = "localhost"

class DoorHandler(BaseHTTPServer.BaseHTTPRequestHandler):
    def do_GET(s):
        s.send_response(200)
        s.send_header("Content-type", "text/plain")
        s.end_headers()
        GPIO.output(INTERCOM_PIN, 1)
        time.sleep(2)
        GPIO.output(INTERCOM_PIN, 0)

server_class = BaseHTTPServer.HTTPServer
httpd = server_class((WEB_SERVER_HOST, WEB_SERVER_PORT), DoorHandler)
print time.asctime(), "Server Starts - %s:%s" % (WEB_SERVER_HOST, WEB_SERVER_PORT)
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    pass
httpd.server_close()

GPIO.cleanup()
