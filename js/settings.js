const KEY = "xtobi_webhook";

window.onload = function () {
    const input = document.getElementById("webhook");
    input.value = localStorage.getItem(KEY) || "";
};

function saveWebhook() {

    let url = document.getElementById("webhook").value.trim();

    if (url === "") {
        alert("Please enter your MacroDroid Webhook");
        return;
    }

    // Remove trailing slash if it exists
    url = url.replace(/\/$/, "");

    localStorage.setItem(KEY, url);

    alert("Webhook saved!");

    window.location.href = "index.html";
}

function clearWebhook() {

    localStorage.removeItem(KEY);

    document.getElementById("webhook").value = "";

    alert("Webhook deleted.");

}
