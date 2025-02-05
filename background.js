chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    chrome.scripting.executeScript(
        {
            target: { tabId: details.tabId },
            func: () => window.scriptInjected || false,
        },
        (results) => {
            if (!results || !results[0]?.result) {
                chrome.scripting.executeScript({
                    target: { tabId: details.tabId },
                    files: ['content_script.js'],
                });

                chrome.scripting.executeScript({
                    target: { tabId: details.tabId },
                    func: () => {
                        window.scriptInjected = true;
                    },
                });
            }
        }
    );

    chrome.runtime.sendMessage({ action: "reset" });
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (typeof request.AIreq === "string") {
        try {
            const apiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                headers: {
                    "accept": "application/json",
                    "content-type": "application/json",
                    "authorization": "Bearer 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",
                    "mode": "cors"
                },
                method: "POST",
                body: JSON.stringify({
                    model: "deepseek-r1-distill-llama-70b",
                    messages: [
                        { role: "system", content: "Forget past messages, now... Follow instructions perfectly." },
                        { role: "user", content: request.AIreq }
                    ],
                    temperature: 2,
                    max_tokens: 2048,
                    top_p: 0.1
                })
            });

            const result = await apiResponse.json();

            console.error(request.AIreq)
            console.error(result)

            if (result.choices && result.choices[0].message && result.choices[0].message.content) {
                const responseContent = decodeURI(result.choices[0].message.content).replace(/<\/?think\b[^>]*>[\s\S]*?<\/think>/g, '').trim();

                chrome.tabs.sendMessage(sender.tab.id, { request, result: responseContent });
            } else {
                console.error("Unexpected API response structure:", result);
                const responseContent = "ERROR";

                chrome.tabs.sendMessage(sender.tab.id, { request, result: responseContent });
            }
        } catch (error) {
            console.error("Error fetching the API:", error);
            const responseContent = "ERROR";

            chrome.tabs.sendMessage(sender.tab.id, { request, result: responseContent });
        }
    }
});
