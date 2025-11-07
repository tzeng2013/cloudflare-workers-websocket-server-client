export class WebSocketServer {
    constructor(state, env) {
        this.state = state;
        this.env = env;
        this.sessions = new Set(); // To store active WebSocket connections
    }

    async fetch(request) {
        const webSocketPair = new WebSocketPair();
        const [client, server] = Object.values(webSocketPair);

        this.state.acceptWebSocket(server);
        this.sessions.add(server);

        return new Response(null, { status: 101, webSocket: client });
    }

    async webSocketMessage(ws, message) {
        // Broadcast message to all connected clients
        for (let session of this.sessions) {
            if (session !== ws) { // Don't send back to the sender
                session.send(`[Broadcast] ${message}`);
            }
        }
        ws.send(`You said - ${message}`);
    }

    async webSocketClose(ws, code, reason, wasClean) {
        this.sessions.delete(ws);
        console.log("Durable Object WebSocket closed:", code, reason);
    }

    async webSocketError(ws, error) {
        console.error("Durable Object WebSocket error:", error);
    }
}