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

    const url = localStorage.getItem(KEY);

    if(!url){

        location.href="settings.html";

        return;

    }

    try{

        await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"text/plain"
            },
            body:command
        });

    }catch(e){

        console.log(e);

    }

}

loadButtons();
