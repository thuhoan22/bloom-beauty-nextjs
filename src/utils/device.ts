// import UAParser from "ua-parser-js";
import * as UAParser from "ua-parser-js";

export const getDeviceInfo = () => {
  // const parser = new UAParser();
  const parser = new UAParser.UAParser();
  const result = parser.getResult();

  const browser = result.browser.name || "Unknown";
  const os = result.os.name || "Unknown";
  const deviceType = result.device.type || "desktop";

  let deviceName = `${browser} - ${os}`;

  // 👉 custom giống Netflix hơn
  if (deviceType === "mobile") {
    deviceName = `${browser} - Mobile`;
  }

  if (deviceType === "tablet") {
    deviceName = `${browser} - Tablet`;
  }

  return {
    deviceName,
    deviceType,
    os,
  };
};

export const getDeviceId = () => {
  let id = localStorage.getItem("device_id");

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("device_id", id);
  }

  return id;
};