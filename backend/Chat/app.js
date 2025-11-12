import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";

// Basic edge-friendly HTTP + WebSocket server.
// No database; connections live only in memory per machine/region.

const app = express();
app.use(cors());
app.use(express.json());

// Simple health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// --- WebSocket hub ---
// Clients connect to ws(s)://<host>/?conv=<ID>&user=<ID>
// Server relays JSON messages to the OTHER peer(s) in the same conv.
// This keeps it stateless (no persistence), just an in-memory relay.
const server = app.listen(process.env.PORT || 8080, () => {
  console.log("HTTP server listening on", server.address().port);
});

const wss = new WebSocketServer({ server });

// Track clients by conversation ID (per process/machine)
const rooms = new Map(); // convId -> Set<WebSocket>

function getParamsFromReq(req) {
  const url = new URL(req.url, "http://localhost");
  return { conv: url.searchParams.get("conv"), user: url.searchParams.get("user") };
}

wss.on("connection", (ws, req) => {
  const { conv, user } = getParamsFromReq(req);
  if (!conv || !user) {
    ws.close(1008, "Missing conv or user"); // Policy violation
    return;
  }

  if (!rooms.has(conv)) rooms.set(conv, new Set());
  const peers = rooms.get(conv);
  peers.add(ws);

  // Notify others that this user joined
  broadcast(conv, { type: "presence", event: "join", user }, ws);

  ws.on("message", (buf) => {
    // Expect either text or JSON. We wrap as {type:"message", text, user, ts}
    let payload;
    try {
      const raw = buf.toString();
      payload = JSON.parse(raw);
    } catch {
      payload = { type: "message", text: buf.toString() };
    }
    const out = {
      type: payload.type || "message",
      text: payload.text ?? "",
      user,
      ts: new Date().toISOString(),
    };
    broadcast(conv, out, ws);
  });

  ws.on("close", () => {
    peers.delete(ws);
    // If room empty, clean it up
    if (peers.size === 0) rooms.delete(conv);
    broadcast(conv, { type: "presence", event: "leave", user });
  });

  // Optional: ping to keep connections alive on some platforms
  ws.isAlive = true;
  ws.on("pong", () => (ws.isAlive = true));
});

// Heartbeat to terminate dead sockets (optional)
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on("close", () => clearInterval(interval));

function broadcast(conv, data, exclude) {
  const peers = rooms.get(conv);
  if (!peers) return;
  const msg = JSON.stringify(data);
  peers.forEach((client) => {
    if (client !== exclude && client.readyState === 1) {
      client.send(msg);
    }
  });
}

// --- HTTP helper to send messages via REST (useful for curl/tests) ---
app.post("/send", (req, res) => {
  const { conv, user, text } = req.body || {};
  if (!conv || !user || !text) return res.status(400).json({ error: "Missing conv, user, or text" });
  broadcast(conv, { type: "message", text, user, ts: new Date().toISOString() });
  res.json({ ok: true });
});

// Serve the demo UI (built file, kept tiny)
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));
