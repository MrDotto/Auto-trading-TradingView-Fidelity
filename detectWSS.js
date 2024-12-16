(function () {
    let originalWebSocket = WebSocket;

    WebSocket = function(url, protocols) { // for new
        let ws = new originalWebSocket(url, protocols);

        ws.addEventListener = (function(originalAddEventListener) {
            return function(type, listener, options) {
                if (type === 'message') {
                    let originalListener = listener;
                    listener = function(event) {
                        try {
                            let data = JSON.parse(event.data.toString().replace(/\\"/g, '"').replace(/"{/g, '{').replace(/}"/g, '}')).text.content.p.desc.split(",");

                            if (data[3] == 0) return false;

                            window.postMessage( // send to content_script
                                {
                                    source: "detectWSS",
                                    action: "newOrder",
                                    message: data, // Data from TradingView Alert
                                },
                                "*"
                            );
                        } catch (e) {}

                        originalListener.call(this, event);
                    };
                }
                return originalAddEventListener.call(this, type, listener, options);
            };
        })(ws.addEventListener);

        return ws;
    };

    // for Old
    WebSocket.prototype = Object.create(originalWebSocket.prototype);
    WebSocket.prototype.constructor = WebSocket;

    let originalOpen = WebSocket.prototype.open;
    WebSocket.prototype.open = function() {
        originalOpen.apply(this, arguments);
    };
})();