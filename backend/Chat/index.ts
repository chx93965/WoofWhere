// import express from "express";
// import http from "http";
// import { Server as IOServer } from "socket.io";
// import dotenv from "dotenv";
// import cors from "cors";
// import { createClient } from "@supabase/supabase-js";

// dotenv.config();

// const PORT = Number(process.env.PORT || 4000);
// const SUPABASE_URL = process.env.SUPABASE_URL!;
// const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
// const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// const app = express();
// app.use(cors({ origin: CORS_ORIGIN }));

// const server = http.createServer(app);
// const io = new IOServer(server, {
//   cors: { origin: CORS_ORIGIN },
// });

// // Track online users (global)
// let onlineUsers: Record<string, { username: string }> = {};

// io.on("connection", async (socket) => {
//   console.log("Connected:", socket.id);

//   socket.on("join_chat", ({ username }) => {
//     onlineUsers[socket.id] = { username };
//     io.emit("online_users", Object.values(onlineUsers).map(u => u.username));
//   });

//   //
//   // ----------------------------
//   //  ORIGINAL MESSAGE HISTORY
//   // (kept as-is for global chat)
//   // ----------------------------
//   //
//   const { data } = await supabase
//     .from("messages")
//     .select("*")
//     .order("created_at", { ascending: true })
//     .limit(200);

//   socket.emit("message_history", data || []);

//   //
//   // ---------------------------------------------------
//   // NEW: LOAD PRIVATE CHAT HISTORY FOR SELECTED USER
//   // ---------------------------------------------------
//   //
//   socket.on("load_private_history", async ({ user, peer }) => {
//     const { data: privateHistory } = await supabase
//       .from("messages")
//       .select("*")
//       .or(
//         `and(sender.eq.${user},recipient.eq.${peer}),and(sender.eq.${peer},recipient.eq.${user})`
//       )
//       .order("created_at", { ascending: true });

//     socket.emit("private_history", privateHistory || []);
//   });

//   //
//   // ---------------------------------------------------
//   // ORIGINAL SEND MESSAGE (kept exactly)
//   // + extended to support private messages
//   // ---------------------------------------------------
//   //
//   socket.on("send_message", async ({ username, recipient, content }) => {
//     const message = {
//       id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
//       sender: username,          // NEW FIELD
//       recipient: recipient || "", // NEW FIELD
//       content,
//       created_at: new Date().toISOString(),
//     };

//     // Emit globally (your original behavior)
//     io.emit("new_message", message);

//     // Save to Supabase
//     await supabase.from("messages").insert({
//       sender: username,
//       recipient: recipient || "",
//       content,
//       created_at: message.created_at,
//     });
//   });
  

//   socket.on("disconnect", () => {
//     delete onlineUsers[socket.id];
//     io.emit("online_users", Object.values(onlineUsers).map(u => u.username));
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const PORT = Number(process.env.PORT || 4000);
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const app = express();
app.use(cors({ origin: CORS_ORIGIN }));

const server = http.createServer(app);
const io = new IOServer(server, { cors: { origin: CORS_ORIGIN } });

// Track online users
let onlineUsers: Record<string, string> = {};

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("join_chat", async ({ username }) => {
    onlineUsers[socket.id] = username;

    // Send online users
    io.emit("online_users", Object.values(onlineUsers));

    // Send message history
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(200);

    if (error) console.error("Error fetching messages:", error);
    else socket.emit("message_history", data || []);
  });

  socket.on("send_message", async ({ sender, recipient, content }) => {
    const message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      sender,
      recipient: recipient || "",
      content,
      created_at: new Date().toISOString(),
    };

    // Save to Supabase
    const { error } = await supabase.from("messages").insert(message);
    if (error) console.error("SUPABASE INSERT ERROR:", error);

    // Emit to all users (global chat) or specific recipient
    if (recipient) {
      // Private message
      for (const [socketId, username] of Object.entries(onlineUsers)) {
        if (username === sender || username === recipient) {
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
  console.log(`Server running at http://localhost:${PORT}`);
});