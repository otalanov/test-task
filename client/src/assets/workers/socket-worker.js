const EVENT_TYPES = {
  INIT: 'INIT'
};

self.socket = undefined;
self.socketURL = undefined;

self.onmessage = (event) => {
    console.log("self::onmessage:", this.event);
    let [eventType, eventData] = event.data;
    switch (eventType) {
        case EVENT_TYPES.INIT:
            return socketCreate(eventData);
    }
};

function clearSocketCallbacks() {
    if (self.socket !== undefined) {
        self.socket.onopen    = () => {};
        self.socket.onclose   = () => {};
        self.socket.onerror   = () => {};
        self.socket.onmessage = () => {};
        self.socket.close();
    }
}

function socketCreate(url) {
    console.log("self::socketCreate::url:", url);
    clearSocketCallbacks();
    self.socket = new WebSocket(url);
    self.socket.onopen    = socketOnOpen;
    self.socket.onclose   = socketOnClose;
    self.socket.onerror   = socketOnError;
    self.socket.onmessage = socketOnMessage;
}

function socketOnOpen(event) {
}

function socketOnClose(_event) {
    socketCreate(self.socketURL);
}

function socketOnError(_event) {
    // reopen socket
    socketCreate(self.socketURL);
}

function socketOnMessage(event) {
    self.postMessage(event.data);
}
