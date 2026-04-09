import { useState } from "react";
import { motion } from "motion/react";
import { Volume2, Check, Sparkles } from "lucide-react";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { SOUND_CLIPS } from "../soundClips";

const voicePersonalities = [
  {
    id: "funny",
    name: "Funny",
    description: "Sarcastic and witty",
    emoji: "😄",
    color: "from-yellow-400 to-orange-500",
    example: "Oh great, another walk? I totally wasn't sleeping...",
  },
  {
    id: "serious",
    name: "Serious",
    description: "Straight to the point",
    emoji: "🧐",
    color: "from-gray-500 to-gray-700",
    example: "I require sustenance. The food bowl is at 47% capacity.",
  },
  {
    id: "cute",
    name: "Cute",
    description: "Adorable and sweet",
    emoji: "🥺",
    color: "from-pink-400 to-pink-600",
    example: "Pwease give me all the cuddles! I wuv you so much! 💕",
  },
  {
    id: "dramatic",
    name: "Dramatic",
    description: "Extra and theatrical",
    emoji: "🎭",
    color: "from-purple-500 to-indigo-600",
    example: "BEHOLD! The mailman approaches! Sound the alarms!",
  },
  {
    id: "wise",
    name: "Wise",
    description: "Philosophical and deep",
    emoji: "🦉",
    color: "from-teal-500 to-blue-600",
    example: "In the great circle of life, one must chase one's tail to find inner peace.",
  },
  {
    id: "energetic",
    name: "Energetic",
    description: "Hyper and excited",
    emoji: "⚡",
    color: "from-green-400 to-lime-500",
    example: "BALL! BALL! BALL! Did someone say WALK?! Let's GO GO GO!!!",
  },
];

export function VoiceSettingsScreen() {
  const [selectedVoice, setSelectedVoice] = useState("funny");
  const [previewAudioSrc, setPreviewAudioSrc] = useState<string | null>(null);
  const [previewPlaybackToken, setPreviewPlaybackToken] = useState(0);
  const [pitch, setPitch] = useState([50]);
  const [speed, setSpeed] = useState([50]);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  const voicePreviewClipMap: Record<string, string> = {
    funny: "24",
    serious: "17",
    cute: "19",
    dramatic: "11",
    wise: "12",
    energetic: "27",
  };

  const playPreviewForVoice = (voiceId: string) => {
    const clipId = voicePreviewClipMap[voiceId] ?? "19";
    const clip = SOUND_CLIPS.find((item) => item.id === clipId);

    if (!clip) {
      return;
    }

    setPreviewAudioSrc(clip.audioSrc);
    setPreviewPlaybackToken((current) => current + 1);
  };

  return (
    <div className="h-full overflow-y-auto pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 px-6 pt-12 pb-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1 className="text-3xl text-white mb-2">Voice Settings</h1>
          <p className="text-purple-100">
            Customize how your pet sounds
          </p>
        </motion.div>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Voice Personality Selection */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-purple-500" />
            Voice Personality
          </h2>

          <div className="space-y-3">
            {voicePersonalities.map((voice, index) => (
              <motion.button
                key={voice.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedVoice(voice.id);
                  playPreviewForVoice(voice.id);
                }}
                className={`w-full p-4 rounded-2xl border-2 transition-all ${
                  selectedVoice === voice.id
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${voice.color} flex items-center justify-center text-2xl flex-shrink-0`}
                  >
                    {voice.emoji}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-gray-800">{voice.name}</h3>
                      {selectedVoice === voice.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center"
                        >
                          <Check size={14} className="text-white" />
                        </motion.div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {voice.description}
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      "{voice.example}"
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Voice Adjustments */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 border-2 border-gray-200"
        >
          <h2 className="text-lg text-gray-800 mb-6 flex items-center gap-2">
            <Volume2 size={20} className="text-purple-500" />
            Voice Adjustments
          </h2>

          {/* Pitch Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm text-gray-700">Pitch</label>
              <span className="text-sm text-purple-600">{pitch[0]}%</span>
            </div>
            <Slider
              value={pitch}
              onValueChange={setPitch}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Lower</span>
              <span>Higher</span>
            </div>
          </div>

          {/* Speed Slider */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm text-gray-700">Speed</label>
              <span className="text-sm text-purple-600">{speed[0]}%</span>
            </div>
            <Slider
              value={speed}
              onValueChange={setSpeed}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Slower</span>
              <span>Faster</span>
            </div>
          </div>
        </motion.div>

        {/* Additional Settings */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6"
        >
          <h2 className="text-lg text-gray-800 mb-4">Additional Settings</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800">Auto-translate</p>
                <p className="text-sm text-gray-600">
                  Automatically detect and translate
                </p>
              </div>
              <Switch checked={autoTranslate} onCheckedChange={setAutoTranslate} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800">Sound Effects</p>
                <p className="text-sm text-gray-600">
                  Play fun sounds with translations
                </p>
              </div>
              <Switch checked={soundEffects} onCheckedChange={setSoundEffects} />
            </div>
          </div>
        </motion.div>

        {/* Preview Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => playPreviewForVoice(selectedVoice)}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg flex items-center justify-center gap-2"
        >
          <Volume2 size={20} />
          <span>Preview Voice</span>
        </motion.button>

        <audio
          key={`${previewAudioSrc ?? "voice-preview"}-${previewPlaybackToken}`}
          src={previewAudioSrc ?? undefined}
          autoPlay
        />
      </div>
    </div>
  );
}
