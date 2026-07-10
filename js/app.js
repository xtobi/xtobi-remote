const KEY = "xtobi_webhook";

let data = [];
let history = [];

// Firebase refs/state for stream handling
let db = null;
let streamRef = null;
let streamListener = null;
let streamTimeout = null;

async function init() {
    const res = await fetch("data/commands.json");
    data = await res.json();

    const saved = localStorage.getItem("xtobi_history");

    if (saved) {
        history = JSON.parse(saved);

        if (history.length) {
            document.getElementById("lastCommand").innerHTML =
                history[0].time + " - " + history[0].cmd;
        }
    }

    render(data);

    document
        .getElementById("search")
        .addEventListener("input", filter);

    initFirebaseStreamWatcher();
}

function filter() {
    const q = document
        .getElementById("search")
        .value
        .toLowerCase();

    if (q === "") {
        render(data);
        return;
    }

    const result = [];

    data.forEach(section => {
        const items = section.items.filter(item =>
            item.title.toLowerCase().includes(q) ||
            item.command.toLowerCase().includes(q)
        );

        if (items.length) {
            result.push({
                category: section.category,
                items: items
            });
        }

    });

    render(result);
}

function render(list) {
    const container = document.getElementById("buttons");

    container.innerHTML = "";

    list.forEach(section => {
        const title = document.createElement("h2");
        title.className = "category-title";
        title.textContent = section.category;
        container.appendChild(title);

        const grid = document.createElement("div");
        grid.className = "category-grid";

        section.items.forEach(item => {
            const btn = document.createElement("button");
            btn.className = "control-btn";
            btn.style.background = item.color;
            btn.textContent = item.title;
            btn.onclick = () => send(item.command);
            grid.appendChild(btn);
        });

        container.appendChild(grid);
    });
}

async function send(command) {
    const webhook = localStorage.getItem(KEY);
    if (!webhook) {
        location.href = "settings.html";
        return;
    }

    document.getElementById("status").innerHTML = "🟡 Sending...";

    try {
        // Special flow for streamon:
        // clear old URL -> send command -> wait for new stream_url -> open it
        if (command === "streamon") {
            await clearStreamUrl();
        }

        await fetch(webhook, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: command
        });

        document.getElementById("status").innerHTML = "🟢 Sent";
        addHistory(command);
        toast("✓ " + command);

        if (command === "streamon") {
            waitForStreamUrl();
        }

    } catch (e) {
        console.error(e);
        document.getElementById("status").innerHTML = "🔴 Failed";
        toast("Connection Error");
    }
}

function toast(text) {
    const t = document.getElementById("toast");
    t.innerHTML = text;
    t.style.display = "block";

    setTimeout(() => {
        t.style.display = "none";
    }, 1500);
}

function addHistory(command) {
    history.unshift({
        time: new Date().toLocaleTimeString(),
        cmd: command
    });

    if (history.length > 20) {
        history.pop();
    }

    localStorage.setItem(
        "xtobi_history",
        JSON.stringify(history)
    );

    document.getElementById("lastCommand").innerHTML =
        history[0].time + " - " + history[0].cmd;
}

function initFirebaseStreamWatcher() {
    // We only try to use Firebase if it exists on the page.
    // This keeps the app safe even if firebase.js loads later or is unavailable.
    const tryConnect = () => {
        if (
            window.firebase &&
            typeof window.firebase.database === "function"
        ) {
            try {
                db = window.firebase.database();
                streamRef = db.ref("stream_url");
                return true;
            } catch (e) {
                console.warn("Firebase stream watcher init failed:", e);
            }
        }
        return false;
    };

    if (tryConnect()) return;

    let attempts = 0;
    const timer = setInterval(() => {
        attempts++;
        if (tryConnect() || attempts >= 20) {
            clearInterval(timer);
        }
    }, 300);
}

async function clearStreamUrl() {
    if (!streamRef && !db) return;

    try {
        if (!db && window.firebase && typeof window.firebase.database === "function") {
            db = window.firebase.database();
        }

        if (!streamRef && db) {
            streamRef = db.ref("stream_url");
        }

        if (streamRef) {
            await streamRef.set("");
        }
    } catch (e) {
        console.warn("Failed to clear stream_url:", e);
    }
}

function waitForStreamUrl() {
    if (!streamRef) {
        toast("Firebase not ready");
        return;
    }

    if (streamListener) {
        streamRef.off("value", streamListener);
        streamListener = null;
    }

    clearTimeout(streamTimeout);

    document.getElementById("status").innerHTML = "🟡 Waiting stream...";

    streamListener = snapshot => {
        const url = snapshot.val();

        if (typeof url === "string" && url.startsWith("http")) {
            cleanupStreamWatcher();

            document.getElementById("status").innerHTML = "🟢 Stream Ready";
            toast("Opening stream...");

            // Open in a new tab
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };

    streamRef.on("value", streamListener);

    streamTimeout = setTimeout(() => {
        cleanupStreamWatcher();
        document.getElementById("status").innerHTML = "🔴 Stream Timeout";
        toast("No stream URL received");
    }, 30000);
}

function cleanupStreamWatcher() {
    if (streamRef && streamListener) {
        streamRef.off("value", streamListener);
    }
    streamListener = null;

    if (streamTimeout) {
        clearTimeout(streamTimeout);
        streamTimeout = null;
    }
}

init();
