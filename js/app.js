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

        btn.onclick = async () => {

            const base = localStorage.getItem(KEY);

            const url = base.replace(/\/$/, "") + "/" + item.command;

            console.log(url);

            window.open(url,"_blank");

        };

        area.appendChild(btn);

    });

}

loadButtons();
