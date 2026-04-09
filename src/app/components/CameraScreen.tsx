import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Share2, Volume2, Circle, Save } from "lucide-react";
import { ShareModal } from "./ShareModal";
import { MAIN_VIDEO_SRC, useRealtimeState } from "../realtime";
import { saveRecordingToGallery } from "../recordings";

export function CameraScreen() {
  const { state: liveState } = useRealtimeState();
  const [recordingStatusMessage, setRecordingStatusMessage] = useState<string | null>(null);
  const [isLiveSubtitleVisible, setIsLiveSubtitleVisible] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [playbackAudioSrc, setPlaybackAudioSrc] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    return () => {
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!recordingStatusMessage) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setRecordingStatusMessage(null);
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [recordingStatusMessage]);

  useEffect(() => {
    setIsLiveSubtitleVisible(true);

    const timeout = window.setTimeout(() => {
      setIsLiveSubtitleVisible(false);
    }, 10000);

    return () => window.clearTimeout(timeout);
  }, [liveState.updatedAt, liveState.subtitle]);

  useEffect(() => {
    if (!liveState.audioSrc) {
      return;
    }

    setPlaybackAudioSrc(liveState.audioSrc);
  }, [liveState.updatedAt, liveState.audioSrc]);

  const persistRecording = async (recordingBlob: Blob) => {
    try {
      await saveRecordingToGallery(recordingBlob);
      setRecordingStatusMessage("Recording saved to gallery 🎉");
    } catch {
      setRecordingStatusMessage("Could not save recording to gallery.");
    }
  };

  const startRecording = () => {
    const previewVideo = videoRef.current;

    if (!previewVideo || !window.MediaRecorder) {
      setRecordingStatusMessage("Recording is not supported in this browser.");
      return;
    }

    const captureStream =
      previewVideo.captureStream?.() ??
      (previewVideo as HTMLVideoElement & {
        mozCaptureStream?: () => MediaStream;
      }).mozCaptureStream?.();

    if (!captureStream) {
      setRecordingStatusMessage("Could not capture the video stream.");
      return;
    }

    const videoOnlyStream = new MediaStream(captureStream.getVideoTracks());

    const supportedMimeType = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ].find((mimeType) => MediaRecorder.isTypeSupported(mimeType));

    const recorder = supportedMimeType
      ? new MediaRecorder(videoOnlyStream, { mimeType: supportedMimeType })
      : new MediaRecorder(videoOnlyStream);

    chunksRef.current = [];
    recorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = async () => {
      const recordingBlob = new Blob(chunksRef.current, {
        type: recorder.mimeType || "video/webm",
      });

      if (recordingBlob.size > 0) {
        await persistRecording(recordingBlob);
      }

      setIsListening(false);
      chunksRef.current = [];
    };

    recorder.start(250);
    setIsRecording(true);
    setIsListening(true);
  };

  const handleRecordSave = () => {
    if (isRecording) {
      setIsRecording(false);
      recorderRef.current?.stop();
      return;
    }

    startRecording();
  };

  const subtitleText =
    recordingStatusMessage ?? (isLiveSubtitleVisible ? liveState.subtitle : null);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Camera View Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-800">
        <video
          ref={videoRef}
          src={liveState.videoSrc || MAIN_VIDEO_SRC}
          className="w-full h-full object-cover"
          autoPlay
          muted
          defaultMuted
          playsInline
          loop
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
      </div>

      {/* Top Subtitle Speech Bubble */}
      <div className="relative z-10 px-4 mt-12">
        <AnimatePresence mode="wait">
          {subtitleText && (
            <motion.div
              key={subtitleText}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full flex justify-center"
            >
              <div className="relative max-w-sm bg-white rounded-3xl p-4 shadow-2xl">
                <p className="text-2xl text-gray-800 text-center leading-snug">
                  {subtitleText}
                </p>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rotate-45 rounded-sm" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Center helper animation while recording */}
      <div className="relative z-10 flex items-center justify-center h-[calc(100%-210px)] px-6">
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 justify-center"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
                className="w-3 h-3 bg-purple-500 rounded-full"
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div className="relative z-10 pb-8 px-6">
        <div className="flex justify-center items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowShareModal(true)}
            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center"
          >
            <Share2 size={24} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRecordSave}
            className={`w-24 h-24 rounded-full text-white flex flex-col items-center justify-center shadow-xl ${
              isRecording
                ? "bg-gradient-to-br from-red-500 to-rose-500"
                : "bg-gradient-to-br from-purple-500 to-pink-500"
            }`}
          >
            {isRecording ? <Save size={30} /> : <Circle size={30} />}
            <span className="text-xs font-medium mt-1">
              {isRecording ? "Save" : "Record"}
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center"
          >
            <Volume2 size={24} />
          </motion.button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        translation={recordingStatusMessage ?? liveState.subtitle}
      />

      <audio
        key={playbackAudioSrc ? `${playbackAudioSrc}-${liveState.updatedAt}` : "client-audio"}
        src={playbackAudioSrc ?? undefined}
        autoPlay
      />
    </div>
  );
}
