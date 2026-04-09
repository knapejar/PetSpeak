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
let currentSnapshot = {
  state: currentState,
  connected: isConnected,
};
let socket: WebSocket | null = null;
let reconnectTimer: number | null = null;
let pollingTimer: number | null = null;
let initialized = false;

const notify = () => {
  currentSnapshot = {
    state: currentState,
    connected: isConnected,
  };
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

const pollStateOnce = async () => {
  try {
    const response = await fetch("/api/state", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as PetSpeakState;

    if (
      typeof payload.videoSrc === "string" &&
      typeof payload.subtitle === "string" &&
      typeof payload.updatedAt === "number"
    ) {
      currentState = payload;
      notify();
    }
  } catch (error) {
    console.warn("[PetSpeak] HTTP state poll failed", error);
  }
};

const startPolling = () => {
  if (pollingTimer) {
    return;
  }

  void pollStateOnce();
  pollingTimer = window.setInterval(() => {
    void pollStateOnce();
  }, 1200);
};

const stopPolling = () => {
  if (!pollingTimer) {
    return;
  }

  window.clearInterval(pollingTimer);
  pollingTimer = null;
};

const connect = () => {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return;
  }

  socket = new WebSocket(getSocketUrl());

  socket.addEventListener("open", () => {
    isConnected = true;
    stopPolling();
    notify();
    console.info("[PetSpeak] WebSocket connected");
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
    startPolling();
    console.warn("[PetSpeak] WebSocket disconnected, retrying...");

    if (reconnectTimer) {
      window.clearTimeout(reconnectTimer);
    }

    reconnectTimer = window.setTimeout(() => {
      connect();
    }, 1500);
  });

  socket.addEventListener("error", (event) => {
    console.warn("[PetSpeak] WebSocket error", event);
  });
};

export const initializeRealtime = () => {
  if (initialized) {
    return;
  }

  initialized = true;
  startPolling();
  connect();
};

export const sendStateUpdate = async (update: Partial<Pick<PetSpeakState, "subtitle" | "videoSrc">>) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    try {
      const response = await fetch("/api/state", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(update),
      });

      if (!response.ok) {
        return false;
      }

      const payload = (await response.json()) as PetSpeakState;
      currentState = payload;
      notify();
      return true;
    } catch (error) {
      console.warn("[PetSpeak] HTTP state update failed", error);
      return false;
    }
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

const getSnapshot = () => currentSnapshot;

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
