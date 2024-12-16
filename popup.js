chrome.tabs.query({
    active: true,
    currentWindow: true
}, (tabs) => { // send message to Content script (main page)
    if (tabs[0].id) {
        chrome.tabs.sendMessage(
            tabs[0].id, {
                action: "href?"
            }
        );
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { // get message to Content script (main page)
    if (message.action == "href") {
        if (message.data.includes("https://www.tradingview.com/")) {
            document.getElementById("info").innerHTML = "Trading View (Online)";
        } else if (message.data.includes("https://digital.fidelity.com/ftgw/digital/trader-dashboard")) {
            document.getElementById("info").innerHTML = "Fidelity (Online)";
        }
    }
});