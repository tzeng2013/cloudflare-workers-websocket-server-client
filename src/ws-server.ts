export { WebSocketServer } from "./WebSocketServer";

export default {
  async fetch(request, env) {
    const upgradeHeader = request.headers.get("Upgrade");
    if (!upgradeHeader || upgradeHeader !== "websocket") {
      return new Response("Expected Upgrade: websocket", { status: 426 });
    }

    // For managing multiple connections and maintaining state (like a chat room), Durable Objects are typically used.
    // Get a Durable Object ID (e.g., using a fixed name, a room ID, etc.)
    let id = env.MY_WEBSOCKET_SERVER.idFromName("chat-room-1");

    // Get the Durable Object instance
    let obj = env.MY_WEBSOCKET_SERVER.get(id);

    // Call the Durable Object's fetch handler, passing the request
    let response = await obj.fetch(request);
    
    return response;

    // Or, handle directly in the Worker (less scalable for multiple connections)

    // const pair = new WebSocketPair();
    // //console.log(pair);
    // const [client, server] = Object.values(pair);

    // server.accept();

    // server.addEventListener("message", event => {
    //   let msg = "Worker received - " + event.data;
    //   if (event.data.toLowerCase() === 'what time is it?') {
    //     const now = new Date();
    //     const hours = now.getHours(); // Returns the hour (0-23)
    //     const minutes = now.getMinutes(); // Returns the minute (0-59)
    //     const seconds = now.getSeconds(); // Returns the second (0-59)
    //     const formattedHours = String(hours).padStart(2, '0');
    //     const formattedMinutes = String(minutes).padStart(2, '0');
    //     const formattedSeconds = String(seconds).padStart(2, '0');

    //     const currentTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    //     msg = currentTime;
    //   }
    //   server.send(msg);
    // });

    // server.addEventListener("close", () => {
    //   console.log("WebSocket closed");
    // });

    // return new Response(null, {
    //   status: 101,
    //   webSocket: client
    // });
  },
};
