import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getFirestore,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAVH_VDsuGKMV9D8YK0nzDwzTs1cAhS6Rk",
  authDomain: "xtobi-remote.firebaseapp.com",
  projectId: "xtobi-remote",
  storageBucket: "xtobi-remote.firebasestorage.app",
  messagingSenderId: "755933947719",
  appId: "1:755933947719:web:c6021e6afa7a3e07fc4e62"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const phoneRef = doc(db, "devices", "phone");

onSnapshot(phoneRef, (snapshot) => {

    if (!snapshot.exists()) return;

    const data = snapshot.data();

    if (data.battery !== undefined) {
        document.getElementById("battery").innerHTML = data.battery + "%";
    }

    if (data.wifi !== undefined) {
        document.getElementById("wifi").innerHTML = data.wifi;
    }

    if (data.mobile !== undefined) {
        document.getElementById("mobile").innerHTML = data.mobile;
    }

});
