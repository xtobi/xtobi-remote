const KEY = "xtobi_webhook";

window.onload = () => {

document.getElementById("webhook").value =

localStorage.getItem(KEY) || "";

};

function saveWebhook(){

let value=document.getElementById("webhook").value.trim();

value=value.replace(/\/$/,"");

localStorage.setItem(KEY,value);

location.href="index.html";

}

function clearWebhook(){

localStorage.removeItem(KEY);

document.getElementById("webhook").value="";

}
