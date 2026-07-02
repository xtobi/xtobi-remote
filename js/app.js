const KEY = "xtobi_webhook";

async function loadButtons() {

    const res = await fetch("data/commands.json");
    const data = await res.json();

    const area = document.getElementById("buttons");
    area.innerHTML = "";

    data.forEach(item => {

        const btn = document.createElement("button");

        btn.className = "control-btn";
        btn.innerHTML = item.title;

        btn.onclick = () => send(item.command);

        area.appendChild(btn);

    });

}

async function send(command){

    const base = localStorage.getItem(KEY);

    if(!base){
        location.href="settings.html";
        return;
    }

    const url =
        base.replace(/\/$/, "") + "/" + command;

    try{

        await fetch(url,{
            method:"GET",
            mode:"no-cors"
        });

        console.log(url);

    }catch(e){

        console.log(e);

    }

}

loadButtons();
