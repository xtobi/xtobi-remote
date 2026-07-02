const KEY = "xtobi_webhook";

window.onload = () => {

document.getElementById("webhook").value =

localStorage.getItem(KEY) || "";

};

function saveWebhook(){

const value = document.getElementById("webhook").value.trim();

if(value==""){

alert("Please enter webhook");

return;

}

localStorage.setItem(KEY,value);

alert("Webhook Saved");

location.href="index.html";

}

function clearWebhook(){

localStorage.removeItem(KEY);

alert("Webhook Deleted");

location.reload();

}
