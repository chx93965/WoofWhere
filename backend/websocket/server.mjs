// // backend/websocket/server.js
// import WebSocket, { WebSocketServer } from "ws";

// const PORT = 8080;
// const wss = new WebSocketServer({ port: PORT });

// let history = []; // store chat messages

// wss.on("connection", (ws) => {
//   console.log("Client connected");

//   // Send chat history
//   ws.send(JSON.stringify({ type: "history", history }));

//   ws.on("message", (msg) => {
//     try {
//       const data = JSON.parse(msg);

//       const payload = {
//         type: "message",
//         name: data.name,
//         text: data.text,
//         ts: Date.now(),
//       };

//       // save to history
//       history.push(payload);

//       // broadcast to all clients
//       wss.clients.forEach((client) => {
//         if (client.readyState === WebSocket.OPEN) {
//           client.send(JSON.stringify(payload));
//         }
//       });
//     } catch (err) {
//       console.error("Invalid message", err);
//     }
//   });

//   ws.on("close", () => console.log("Client disconnected"));
// });

// console.log("✅ WebSocket server running on ws://localhost:" + PORT);

// backend/websocket/server.js
import WebSocket, { WebSocketServer } from "ws";

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

/**
 * Connected users:
 * { username: string, ws: WebSocket }
 */
const users = new Map();

/**
 * Private chat history:
 * key = userA|userB (alphabetically sorted)
 * value = array of messages
 */
const history = new Map();

function chatKey(a, b) {
  return [a, b].sort().join("|");
}

wss.on("connection", (ws) => {
  console.log("Client connected");

  let currentUser = null;

  // When client sends something
  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    // ========= JOIN CHAT  ==========
    if (data.type === "join") {
      currentUser = data.username;
      users.set(currentUser, ws);

      console.log(`${currentUser} joined`);

      // send updated online user list
      broadcastOnlineUsers();
    }

    // ========= LOAD PRIVATE HISTORY ==========
    if (data.type === "load_history") {
      const key = chatKey(data.user, data.peer);
      const past = history.get(key) || [];

      ws.send(JSON.stringify({ type: "private_history", history: past }));
    }

    // ========= SEND PRIVATE MESSAGE ==========
    if (data.type === "private_message") {
      const { sender, recipient, content } = data;

      const message = {
        id: Date.now(),
        sender,
        recipient,
        content,
        created_at: new Date().toISOString(),
      };

      // save message in history
      const key = chatKey(sender, recipient);
      if (!history.has(key)) history.set(key, []);
      history.get(key).push(message);

      // Send to sender
      ws.send(JSON.stringify({ type: "receive_private_message", msg: message }));

      // Send to recipient (if online)
      const targetWS = users.get(recipient);
      if (targetWS && targetWS.readyState === WebSocket.OPEN) {
        targetWS.send(JSON.stringify({ type: "receive_private_message", msg: message }));
      }
    }
  });

  // ========= USER DISCONNECT ==========
  ws.on("close", () => {
    if (currentUser) {
      console.log(`${currentUser} disconnected`);
      users.delete(currentUser);
      broadcastOnlineUsers();
    }
  });
});

function broadcastOnlineUsers() {
  const list = Array.from(users.keys());
  const payload = JSON.stringify({ type: "online_users", users: list });

  users.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

console.log("Private Chat WebSocket server running on ws://localhost:" + PORT);