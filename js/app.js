const KEY = "xtobi_webhook";

let data = [];
let history = [];

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

init();
