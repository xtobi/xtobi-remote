import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
    getDatabase,
    ref,
    onValue,
    off
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

let lastLat = null;
let lastLon = null;
let lastOpenedStreamUrl = null;

const root = ref(db);
const streamUrlRef = ref(db, "stream_url");

onValue(root, (snapshot) => {
    const data = snapshot.val();

    if (!data) return;

    if (data.battery !== undefined) {
        const batteryEl = document.getElementById("battery");
        if (batteryEl) batteryEl.innerHTML = data.battery + "%";
    }

    if (data.mobile !== undefined) {
        const mobileEl = document.getElementById("mobile");
        if (mobileEl) mobileEl.innerHTML = data.mobile;
    }

    if (data.location) {
        lastLat = data.location.lat;
        lastLon = data.location.lon;

        const locationEl = document.getElementById("location");
        if (locationEl) {
            locationEl.innerHTML = "📍 Open in Google Maps";
        }
    }
});

onValue(streamUrlRef, (snapshot) => {
    const url = snapshot.val();

    if (typeof url !== "string") return;

    const cleanUrl = url.trim();

    if (!cleanUrl || !cleanUrl.startsWith("http")) return;

    // Avoid reopening the same stream URL repeatedly
    if (cleanUrl === lastOpenedStreamUrl) return;

    lastOpenedStreamUrl = cleanUrl;

    // Open stream automatically
    window.open(cleanUrl, "_blank", "noopener,noreferrer");
});

const locationCard = document.getElementById("locationCard");
if (locationCard) {
    locationCard.addEventListener("click", () => {
        if (lastLat === null || lastLon === null) return;

        window.open(
            `https://www.google.com/maps?q=${lastLat},${lastLon}`,
            "_blank",
            "noopener,noreferrer"
        );
    });
}
