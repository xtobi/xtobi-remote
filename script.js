const WEBHOOK = localStorage.getItem("webhook") || "";

async function loadButtons() {

    const response = await fetch("commands.json");

    const buttons = await response.json();

    const area = document.getElementById("buttons");

    buttons.forEach(btn => {

        let b = document.createElement("button");

        b.className = "btn";

        b.innerHTML = btn.name;

        b.onclick = () => sendCommand(btn.command);

        area.appendChild(b);

    });

}

function sendCommand(command){

    let webhook = localStorage.getItem("webhook");

    if(!webhook){

        webhook = prompt("Webhook URL");

        if(!webhook) return;

        localStorage.setItem("webhook", webhook);

    }

    fetch(webhook + "?cmd=" + encodeURIComponent(command))
    .then(()=>{

        console.log("Sent:",command);

    })
    .catch(()=>{

        console.log("Failed");

    });

}

loadButtons();
