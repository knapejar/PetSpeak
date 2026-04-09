import { useEffect, useSyncExternalStore } from "react";

export type PetSpeakState = {
  videoSrc: string;
  subtitle: string;
  updatedAt: number;
};

type ServerMessage = {
  type: "state";
  payload: PetSpeakState;
};

const DEFAULT_STATE: PetSpeakState = {
  videoSrc: "/dog.mp4",
  subtitle: "I demand belly rubs immediately! 🐾",
  updatedAt: Date.now(),
};

const listeners = new Set<() => void>();

let currentState: PetSpeakState = DEFAULT_STATE;
let isConnected = false;
let socket: WebSocket | null = null;
let reconnectTimer: number | null = null;
let initialized = false;

const notify = () => {
  listeners.forEach((listener) => listener());
};

const getSocketUrl = () => {
  const envWebsocketUrl = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env.VITE_WS_URL;

  if (envWebsocketUrl) {
    return envWebsocketUrl;
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws`;
};

const connect = () => {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return;
  }

  socket = new WebSocket(getSocketUrl());

  socket.addEventListener("open", () => {
    isConnected = true;
    notify();
  });

  socket.addEventListener("message", (event) => {
    try {
      const parsedMessage = JSON.parse(event.data) as ServerMessage;

      if (parsedMessage.type === "state") {
        currentState = parsedMessage.payload;
        notify();
      }
    } catch {
      // ignore malformed payloads
    }
  });

  socket.addEventListener("close", () => {
    isConnected = false;
    notify();

    if (reconnectTimer) {
      window.clearTimeout(reconnectTimer);
    }

    reconnectTimer = window.setTimeout(() => {
      connect();
    }, 1500);
  });
};

export const initializeRealtime = () => {
  if (initialized) {
    return;
  }

  initialized = true;
  connect();
};

export const sendStateUpdate = (update: Partial<Pick<PetSpeakState, "subtitle" | "videoSrc">>) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return false;
  }

  socket.send(
    JSON.stringify({
      type: "set_state",
      payload: update,
    })
  );

  return true;
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => ({
  state: currentState,
  connected: isConnected,
});

export const useRealtimeState = () => {
  useEffect(() => {
    initializeRealtime();
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};

export const PRESET_SUBTITLES = [
  "I want snacks right now! 🍖",
  "Can we go outside, please? 🐕",
  "You are late with my dinner. ⏰",
  "Throw the ball again! 🎾",
  "This couch is mine now. 👑",
  "I heard something at the door! 🚪",
  "I need a nap after all this barking. 😴",
  "Pet me more, human. ✋",
  "I am a very good dog today. ⭐",
  "Where is my favorite toy? 🧸",
];
