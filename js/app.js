const KEY = "xtobi_webhook";

let commands = [];

async function init() {

    const res = await fetch("data/commands.json");

    commands = await res.json();

    render();

}

function render() {

    const container = document.getElementById("buttons");

    container.innerHTML = "";

    commands.forEach(section => {

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

            btn.innerHTML = item.title;

            btn.onclick = () => send(item.command);

            grid.appendChild(btn);

        });

        container.appendChild(grid);

    });

}

async function send(command){

    const webhook = localStorage.getItem(KEY);

    if(!webhook){

        location.href="settings.html";

        return;

    }

    const url = webhook + "?command=" + encodeURIComponent(command);

    try{

        await fetch(url);

        toast("✓ " + command);

    }

    catch{

        toast("Connection Error");

    }

}

function toast(text){

    let old = document.getElementById("toast");

    if(old) old.remove();

    const t = document.createElement("div");

    t.id="toast";

    t.innerHTML=text;

    t.style.position="fixed";

    t.style.left="50%";

    t.style.bottom="30px";

    t.style.transform="translateX(-50%)";

    t.style.background="#212121";

    t.style.color="white";

    t.style.padding="15px 30px";

    t.style.borderRadius="15px";

    t.style.boxShadow="0 5px 20px rgba(0,0,0,.4)";

    t.style.zIndex="99999";

    document.body.appendChild(t);

    setTimeout(()=>{

        t.remove();

    },1500);

}

init();
