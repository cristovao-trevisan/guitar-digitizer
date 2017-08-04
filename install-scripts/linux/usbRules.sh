sudo apt-get install build-essential libudev-dev
BASEDIR=$(dirname "$0")
sudo cp $BASEDIR/guitarDigitalizer.rules /etc/udev/rules.d/
