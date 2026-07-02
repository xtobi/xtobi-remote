const KEY = "xtobi_webhook";

async function loadButtons() {

    const res = await fetch("data/commands.json");
    const data = await res.json();

    const area = document.getElementById("buttons");
    area.innerHTML = "";

    data.forEach(item => {

        const btn = document.createElement("button");

        btn.className = "control-btn";
        btn.textContent = item.title;

        btn.onclick = () => send(item.command);

        area.appendChild(btn);

    });

}

async function send(command){

    const webhook = localStorage.getItem(KEY);

    if(!webhook){
        location.href="settings.html";
        return;
    }

    try{

        await fetch(webhook,{
            method:"POST",
            headers:{
                "Content-Type":"text/plain"
            },
            body:command
        });

        console.log("Sent:",command);

    }catch(e){

        console.error(e);

    }

}

loadButtons();
