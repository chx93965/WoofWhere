import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const PORT = Number(process.env.PORT || 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

const app = express();
app.use(cors({ origin: CORS_ORIGIN }));

const server = http.createServer(app);
const io = new IOServer(server, { cors: { origin: CORS_ORIGIN } });

// Track online users with all info
interface OnlineUser {
  id: string;
  username: string;
  displayName: string;
}
let onlineUsers: Record<string, OnlineUser> = {};
let messages: any[] = [];

io.on("connection", (socket) => {
  socket.on("join_chat", ({ id, username, displayName }) => {
    onlineUsers[socket.id] = { id, username, displayName };
    io.emit("online_users", Object.values(onlineUsers));
    socket.emit("message_history", messages.slice(-100));
  });

  socket.on("send_message", ({ sender, recipient, content }) => {
    const message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      sender,
      recipient: recipient || "",
      content,
      created_at: new Date().toISOString()
    };
    messages.push(message);
    if (messages.length > 100) messages.shift();

    if (recipient) {
      for (const [socketId, user] of Object.entries(onlineUsers)) {
        if (user.username === sender || user.username === recipient) {
          io.to(socketId).emit("new_message", message);
        }
      }
    } else {
      io.emit("new_message", message);
    }
  });

  socket.on("disconnect", () => {
    delete onlineUsers[socket.id];
    io.emit("online_users", Object.values(onlineUsers));
  });
});

server.listen(PORT, () => {
  console.log(`Chat server listening on http://localhost:${PORT}`);
});