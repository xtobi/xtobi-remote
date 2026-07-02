const KEY = "xtobi_webhook";

let data = [];

async function init() {

    const res = await fetch("data/commands.json");

    data = await res.json();

    render(data);

    document.getElementById("search").addEventListener("input", filter);

}

function filter() {

    const q = document.getElementById("search").value.toLowerCase();

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

        if (items.length > 0) {

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

async function async function send(command){  const webhook=localStorage.getItem(KEY);  if(!webhook){  location.href="settings.html";  return;  }  document.querySelector(".status").innerHTML="🟡 Sending...";  try{  await fetch(  webhook+  "?command="+  encodeURIComponent(command)  );  document.querySelector(".status").innerHTML="🟢 Sent";  toast("✓ "+command);  }  catch{  document.querySelector(".status").innerHTML="🔴 Failed";  toast("Connection Error");  }  } {

    const webhook = localStorage.getItem(KEY);

    if (!webhook) {

        location.href = "settings.html";

        return;

    }

    try {

        await fetch(
            webhook +
            "?command=" +
            encodeURIComponent(command)
        );

        document.querySelector(".status").innerHTML="🟢 Sent"; toast("✓ "+command);

    }

    catch {

        document.querySelector(".status").innerHTML="🔴 Error"; toast("Connection Error");

    }

}

function toast(text){

const t=document.getElementById("toast");

t.innerHTML=text;

t.style.display="block";

document.getElementById("lastCommand").innerHTML=text.replace("✓ ","");

setTimeout(()=>{

t.style.display="none";

},1500);

}
