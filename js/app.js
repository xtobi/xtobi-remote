const WEBHOOK_KEY = "xtobi_webhook";

async function loadCommands() {

    try {

        const response = await fetch("data/commands.json");

        const commands = await response.json();

        const container = document.getElementById("buttons");

        container.innerHTML = "";

        commands.forEach(item => {

            const button = document.createElement("button");

            button.className = "control-btn";

            button.innerHTML = item.icon + "<br><br>" + item.title;

            button.onclick = () => {

                sendCommand(item.command);

            };

            container.appendChild(button);

        });

    }

    catch (e) {

        console.error(e);

        alert("commands.json not found");

    }

}

async function sendCommand(command) {

    let webhook = localStorage.getItem(WEBHOOK_KEY);

    if (!webhook) {

        window.location = "settings.html";

        return;

    }

    try {

        const url = webhook + "?cmd=" + encodeURIComponent(command);

        await fetch(url);

        console.log("Sent:", command);

    }

    catch (e) {

        console.error(e);

        alert("Failed to send command");

    }

}

loadCommands();
