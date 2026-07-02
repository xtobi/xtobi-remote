const WEBHOOK = localStorage.getItem("webhook") || "";
const buttons = [

{
name:"🏠 Home",
command:"home"
},

{
name:"◀ Back",
command:"back"
},

{
name:"📋 Recent",
command:"recent"
},

{
name:"🔦 Flash",
command:"flash"
}

];

let area = document.getElementById("buttons");

buttons.forEach(btn=>{

let b=document.createElement("button");

b.className="btn";

b.innerHTML=btn.name;

b.onclick=()=>{

if (WEBHOOK == "") {

    let url = prompt("أدخل رابط Webhook");

    if (!url) return;

    localStorage.setItem("webhook", url);

    location.reload();

    return;

}

fetch(WEBHOOK + "?cmd=" + btn.command)

.then(() => {

    alert("✔ Command Sent");

})

.catch(() => {

    alert("❌ Failed");

});
};

area.appendChild(b);

});
