let csurfToken = null,
    fidelity = false,
    tradingView = false;

if (window.location.href.includes("https://digital.fidelity.com/ftgw/digital/trader-dashboard")) fidelity = true;
if (window.location.href.includes("https://www.tradingview.com/")) tradingView = true;

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => { // get msg from backend
    switch (message.action) {
        case "href?":
            chrome.runtime.sendMessage({
                action: "href",
                data: window.location.href
            }); // send to pop-up
            break;
        case 'newOrder':
            if (tradingView) return false;
            buyStock(...message.data.message);
            break;
        case 'tradeSuccess':
            if (fidelity) return false;
            alert('Order filled');
            break;
    }
});

if (tradingView) { // Client side TradingView code
    let script = document.createElement('script');
    script.src = chrome.runtime.getURL('detectWSS.js');
    document.documentElement.appendChild(script);
    script.onload = () => script.remove();

    let lastMessageTime = 0;
    window.addEventListener("message", (event) => { // get Messages from the script (buys/sells)
        if (event.source !== window || event.data.source !== "detectWSS") return false;

        if (Date.now() - lastMessageTime < 1000) return false;
            
        lastMessageTime = Date.now();

        chrome.runtime.sendMessage({ // send info to sever to send to fidelity
            action: 'sendToTabs',
            type: "newOrder",
            message: event.data,
        });
    });
}

if (fidelity) { // Take csrfToken
    let csurfLoop = setInterval(() => {
        document.querySelectorAll("head > script").forEach((script) => {
            if (script?.innerHTML?.toString().includes("CSURF_TOKEN :")) {
                csurfToken = script.innerHTML.split("CSURF_TOKEN :").pop().split('"')[1];
                clearInterval(csurfLoop)
            }
        });
    }, 100);
}

function buyStock(ticker, price, amount, buySell) {
    ticker = ticker?.toString()?.toUpperCase()?.trim || false;

    console.log("Got order")

    if (!ticker || !csurfToken) return false;

    fetch("https://digital.fidelity.com/ftgw/digital/trade-equity/previewSrvc", {
        "headers": {
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9",
            "appid": "AP145890",
            "appname": "Trader Dashboard",
            "content-type": "application/json",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-csrf-token": csurfToken,
        },
        "referrer": "https://digital.fidelity.com/ftgw/digital/trader-dashboard",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify({
            "orderDetails": {
                "orderAction": buySell,
                "orderActionCode": buySell,
                "priceTypeCode": "L",
                "qty": amount,
                "limitPrice": price,
                "tifCode": "D",
                "acctNum": "AccountNumber",
                "acctName": "AccountName",
                "qtyTypeCode": "S",
                "symbol": ticker,
                "stopPrice": null,
                "condition": "N",
                "acctTypeCode": null,
                "isTradeTypeAvailable": false,
                "previewInd": true,
                "confInd": true,
                "routeCode": null
            }
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then((response) => response.json()).then((data) => {
        confirmationNumber = data?.preview?.orderConfirmDetail?.confNum;

        if (confirmationNumber) { // Execute buy order
            fetch("https://digital.fidelity.com/ftgw/digital/trade-equity/placeOrder", {
                "headers": {
                    "accept": "application/json",
                    "accept-language": "en-US,en;q=0.9",
                    "appid": "AP145890",
                    "appname": "Trader Dashboard",
                    "content-type": "application/json",
                    "priority": "u=1, i",
                    "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-csrf-token": csurfToken,
                },
                "referrer": "https://digital.fidelity.com/ftgw/digital/trader-dashboard",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": JSON.stringify({
                    "orderDetails": {
                        "orderAction": buySell,
                        "orderActionCode": buySell,
                        "priceTypeCode": "L",
                        "qty": amount,
                        "limitPrice": price,
                        "tifCode": "D",
                        "acctNum": "AccountNumber",
                        "acctName": "AccountName",
                        "qtyTypeCode": "S",
                        "symbol": ticker,
                        "stopPrice": null,
                        "condition": "N",
                        "acctTypeCode": null,
                        "isTradeTypeAvailable": false,
                        "previewInd": true,
                        "confInd": true,
                        "routeCode": null,
                        "confNum": confirmationNumber,
                    }
                }),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then((response) => response.json()).then((data) => {
                if (JSON.stringify(data).toString().includes("Success")) {
                    console.log("Order filled")
                    chrome.runtime.sendMessage({
                        action: "sendToTabs",
                        type: "tradeSuccess", // send info to sever to send to TradingView
                        message: ''
                    });
                }
            });
        }
    });
}