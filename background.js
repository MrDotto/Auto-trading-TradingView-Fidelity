
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "sendToTabs") {
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, { action: message.type, data: message.message }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error(`Error sending message to tab ${tab.id}:`, chrome.runtime.lastError);
                    }
                });
            });
        });
    }
});