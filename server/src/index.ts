import express from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

const app = express();
// optional simple health endpoint
app.get("/health", (_req: any, res: { send: (arg0: { status: string; }) => any; }) => res.send({ status: "ok" }));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

type ClientMessage = {
  type: "message";
  name: string;
  text: string;
  ts?: number;
};

console.log("Starting WebSocket server...");

wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected. Total:", wss.clients.size);

  ws.on("message", (data) => {
    try {
      const parsed = JSON.parse(data.toString()) as ClientMessage;
      // Add timestamp
      const message = {
        ...parsed,
        ts: Date.now()
      };
      // Broadcast to all clients
      const payload = JSON.stringify(message);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      });
    } catch (err) {
      console.error("Invalid message", err);
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected. Total:", wss.clients.size);
  });

  // Optionally send welcome message
  ws.send(JSON.stringify({ type: "message", name: "system", text: "Welcome to chat", ts: Date.now() }));
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
