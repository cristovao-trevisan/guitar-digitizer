sudo apt-get install build-essential libudev-dev
BASEDIR=$(dirname "$0")
sudo cp $BASEDIR/guitarDigitizer.rules /etc/udev/rules.d/
