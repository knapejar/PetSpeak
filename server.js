import express from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

const state = {
  videoSrc: "/dog.mp4",
  subtitle: "I demand belly rubs immediately! 🐾",
  updatedAt: Date.now(),
};

const buildStateMessage = () =>
  JSON.stringify({
    type: "state",
    payload: state,
  });

const broadcastState = () => {
  const payload = buildStateMessage();

  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
};

wss.on("connection", (socket) => {
  socket.send(buildStateMessage());

  socket.on("message", (rawData) => {
    try {
      const parsed = JSON.parse(rawData.toString());

      if (parsed?.type !== "set_state" || typeof parsed.payload !== "object") {
        return;
      }

      const nextVideoSrc = parsed.payload.videoSrc;
      const nextSubtitle = parsed.payload.subtitle;

      if (typeof nextVideoSrc === "string" && nextVideoSrc.trim().length > 0) {
        state.videoSrc = nextVideoSrc.trim();
      }

      if (typeof nextSubtitle === "string" && nextSubtitle.trim().length > 0) {
        state.subtitle = nextSubtitle.trim();
      }

      state.updatedAt = Date.now();
      broadcastState();
    } catch {
      // ignore malformed payloads
    }
  });
});

app.use(express.json({ limit: "100kb" }));

app.get("/api/state", (_req, res) => {
  res.json(state);
});

app.post("/api/state", (req, res) => {
  const nextVideoSrc = req.body?.videoSrc;
  const nextSubtitle = req.body?.subtitle;

  if (typeof nextVideoSrc === "string" && nextVideoSrc.trim().length > 0) {
    state.videoSrc = nextVideoSrc.trim();
  }

  if (typeof nextSubtitle === "string" && nextSubtitle.trim().length > 0) {
    state.subtitle = nextSubtitle.trim();
  }

  state.updatedAt = Date.now();
  broadcastState();
  res.json(state);
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

const distPath = path.resolve(__dirname, "dist");
app.use(express.static(distPath));

app.get("/*rest", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const port = Number(process.env.PORT ?? 80);
server.listen(port, "0.0.0.0", () => {
  console.log(`PetSpeak server running on port ${port}`);
});
