let device = null;
const inputValues = [-1, -1, -1, -1, -1, -1, -1, -1];
let lastNotificationTime = 0;
let timeBetweenNotifications = 0;
let isConnecting = false;
let callback = null;

export function isConnected() {
  return device && device.gatt.connected;
}

export function init(callback_) {
  document.body.addEventListener("mousedown", () => {
    if (!isConnecting && !isConnected()) {
      connect();
    }
  });

  callback = callback_;
}

async function connect() {
  let serviceUuid = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
  let characteristicUuid = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

  isConnecting = true;

  console.log("Requesting Bluetooth Device...");
  device = await navigator.bluetooth.requestDevice({
    filters: [{ services: [serviceUuid] }, { name: ["m5-stack"] }],
  });

  console.log("Connecting to GATT Server...");
  const server = await device.gatt.connect();

  console.log("Getting Service...");
  const service = await server.getPrimaryService(serviceUuid);

  console.log("Getting Characteristics...");
  const characteristics = await service.getCharacteristics(characteristicUuid);

  if (characteristics.length > 0) {
    const myCharacteristic = characteristics[0];

    await myCharacteristic.startNotifications();

    myCharacteristic.addEventListener("characteristicvaluechanged", handleCharacteristicValueChanged);

    lastNotificationTime = new Date().getTime();

    console.log("Notifications have been started.");
  } else {
    throw "Got no characteristics";
  }

  isConnecting = false;
}

function handleCharacteristicValueChanged(event) {
  const timeNow = new Date().getTime();
  timeBetweenNotifications = timeNow - lastNotificationTime;
  lastNotificationTime = timeNow;

  const data = event.target.value;
  const inputValue = data.getInt32(0, true);

  callback(inputValue);

  console.log(handleCharacteristicValueChanged, inputValue);
}

function disconnect() {
  if (device) {
    if (device.gatt.connected) {
      device.gatt.disconnect();
      console.log("disconnected");
    }
  }
}
