import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { PRESET_SUBTITLES, sendStateUpdate, useRealtimeState } from "../realtime";

export function ControllerScreen() {
  const { state, connected } = useRealtimeState();
  const [videoSrcInput, setVideoSrcInput] = useState(state.videoSrc);
  const [statusMessage, setStatusMessage] = useState("Controller ready.");

  useEffect(() => {
    setVideoSrcInput(state.videoSrc);
  }, [state.videoSrc]);

  const pushUpdate = async (update: { subtitle?: string; videoSrc?: string }) => {
    const wasSent = await sendStateUpdate(update);

    if (!wasSent) {
      setStatusMessage("Server is disconnected. Reconnecting...");
      return;
    }

    setStatusMessage("Command sent to all clients ✅");
  };

  return (
    <div className="h-full overflow-y-auto p-5 bg-gradient-to-b from-slate-100 to-violet-100">
      <div className="max-w-md mx-auto space-y-5">
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-violet-100">
          <h1 className="text-2xl font-semibold text-slate-800">Controller</h1>
          <p className="text-sm mt-2 text-slate-600">
            One-way broadcast ovládání pro všechny běžící klienty.
          </p>
          <p className="text-xs mt-3 font-medium text-slate-500">
            Socket: {connected ? "Connected" : "Disconnected"}
          </p>
          <p className="text-xs mt-1 text-violet-700">{statusMessage}</p>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-lg border border-violet-100">
          <h2 className="text-lg font-semibold text-slate-800">Video for all clients</h2>
          <p className="text-xs text-slate-500 mt-1">
            Nastav URL nebo cestu videa, které se má přehrávat na všech klientech.
          </p>
          <input
            value={videoSrcInput}
            onChange={(event) => setVideoSrcInput(event.target.value)}
            className="mt-3 w-full rounded-xl border border-violet-200 px-3 py-2 text-sm"
            placeholder="/dog.mp4"
          />
          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => void pushUpdate({ videoSrc: videoSrcInput.trim() || "/dog.mp4" })}
            className="mt-3 w-full rounded-xl px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-fuchsia-500"
          >
            Broadcast video change
          </motion.button>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-lg border border-violet-100">
          <h2 className="text-lg font-semibold text-slate-800">Dog subtitles (10 presets)</h2>
          <p className="text-xs text-slate-500 mt-1">
            Kliknutí okamžitě pošle text všem klientům.
          </p>
          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => void pushUpdate({ subtitle: "" })}
            className="mt-3 w-full text-left rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            Hide current subtitle bubble
          </motion.button>
          <div className="mt-3 grid grid-cols-1 gap-2">
            {PRESET_SUBTITLES.map((subtitle) => (
              <motion.button
                key={subtitle}
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => void pushUpdate({ subtitle })}
                className="text-left rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-slate-700"
              >
                {subtitle}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-lg border border-violet-100">
          <h2 className="text-sm font-semibold text-slate-700">Current broadcast state</h2>
          <p className="mt-2 text-xs text-slate-600">Video: {state.videoSrc}</p>
          <p className="mt-1 text-xs text-slate-600">Subtitle: {state.subtitle}</p>
        </div>
      </div>
    </div>
  );
}
