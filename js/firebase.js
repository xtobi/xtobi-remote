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

let lastLat = null;
let lastLon = null;

const root = ref(db);

onValue(root, (snapshot) => {

    const data = snapshot.val();

    if (!data) return;

    if (data.battery !== undefined) {
        document.getElementById("battery").innerHTML = data.battery + "%";
    }

    if (data.mobile !== undefined) {
        document.getElementById("mobile").innerHTML = data.mobile;
    }

    if (data.location) {

        lastLat = data.location.lat;
        lastLon = data.location.lon;

        document.getElementById("location").innerHTML =
            "📍 Open in Google Maps";
    }

});

document.getElementById("locationCard").addEventListener("click", () => {

    if (!lastLat || !lastLon) return;

    window.open(
        `https://www.google.com/maps?q=${lastLat},${lastLon}`,
        "_blank"
    );

});
