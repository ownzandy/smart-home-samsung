#!/bin/bash
echo `sudo cp /home/pi/$1 /etc/lirc/lircd.conf`
echo `sudo killall lircd`
echo `sudo lircd -d /dev/lirc0`
echo `irsend SEND_ONCE $1 $2`

