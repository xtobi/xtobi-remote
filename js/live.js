import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAVH_VDsuGKMV9D8YK0nzDwzTs1cAhS6Rk",
  authDomain: "xtobi-remote.firebaseapp.com",
  databaseURL: "https://xtobi-remote-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "xtobi-remote",
  storageBucket: "xtobi-remote.firebasestorage.app",
  messagingSenderId: "755933947719",
  appId: "1:755933947719:web:c6021e6afa7a3e07fc4e62"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const deviceList = document.getElementById("deviceList");

function buildStreamUrl(stream) {
  if (!stream?.id || !stream?.password) return null;
  return `https://screenstream.io/?id=${encodeURIComponent(stream.id)}&password=${encodeURIComponent(stream.password)}`;
}

function normalizeDevices(data) {
  if (!data) return {};

  if (data.devices && typeof data.devices === "object") {
    return data.devices;
  }

  return {
    default: {
      name: data.name || "Current Device",
      battery: data.battery,
      mobile: data.mobile,
      location: data.location,
      stream: data.stream || {}
    }
  };
}

function renderDevices(data) {
  deviceList.innerHTML = "";

  const devices = normalizeDevices(data);
  const keys = Object.keys(devices);

  if (keys.length === 0) {
    deviceList.innerHTML = `<div class="streamCard">لا توجد أجهزة الآن</div>`;
    return;
  }

  keys.forEach((deviceId) => {
    const device = devices[deviceId] || {};
    const stream = device.stream || {};
    const isOnline = !!stream.status;
    const streamUrl = buildStreamUrl(stream);

    const card = document.createElement("div");
    card.className = "streamCard";

    const locationText = typeof device.location === "string"
      ? device.location
      : (device.location?.name || device.location?.city || device.location?.country || "");

    card.innerHTML = `
      <div class="streamTop">
        <div>
          <p class="streamName">${device.name || deviceId}</p>
          <div class="streamMeta">
            ${device.battery !== undefined ? `🔋 Battery: ${device.battery}%<br>` : ""}
            ${device.mobile ? `📶 Mobile: ${device.mobile}<br>` : ""}
            ${locationText ? `📍 Location: ${locationText}<br>` : ""}
            ${stream.id ? `🆔 Stream ID: ${stream.id}<br>` : ""}
          </div>
        </div>
        <div class="streamStatus">${isOnline ? "🟢 Online" : "🔴 Offline"}</div>
      </div>

      <button class="watchBtn" ${!isOnline || !streamUrl ? "disabled" : ""}>
        <span class="material-symbols-rounded">visibility</span>
        Watch
      </button>
    `;

    card.querySelector(".watchBtn").addEventListener("click", () => {
      if (streamUrl) window.open(streamUrl, "_blank", "noopener,noreferrer");
    });

    deviceList.appendChild(card);
  });
}

onValue(ref(db), (snapshot) => {
  renderDevices(snapshot.val());
});
