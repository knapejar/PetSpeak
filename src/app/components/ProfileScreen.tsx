import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Film } from "lucide-react";
import {
  listRecordingsFromGallery,
  recordingsUpdatedEvent,
  type StoredRecording,
} from "../recordings";

type RecordingView = {
  id: number;
  createdAt: number;
  url: string;
};

const dogProfile = {
  name: "Milo",
  breed: "Maltese",
  age: "4 months",
  bio: "Cute little Maltese puppy dog with endless zoomies, playful barking, and very strong opinions about rugs.",
};

export function ProfileScreen() {
  const [recordings, setRecordings] = useState<StoredRecording[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadRecordings = async () => {
      try {
        const items = await listRecordingsFromGallery();
        if (isMounted) {
          setRecordings(items);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadRecordings();

    const handleUpdate = () => {
      void loadRecordings();
    };

    window.addEventListener(recordingsUpdatedEvent, handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener(recordingsUpdatedEvent, handleUpdate);
    };
  }, []);

  const recordingViews = useMemo<RecordingView[]>(
    () =>
      recordings.map((recording) => ({
        id: recording.id,
        createdAt: recording.createdAt,
        url: URL.createObjectURL(recording.blob),
      })),
    [recordings]
  );

  useEffect(() => {
    return () => {
      recordingViews.forEach((recording) => URL.revokeObjectURL(recording.url));
    };
  }, [recordingViews]);

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50">
      <div className="px-6 pt-8 pb-24">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <div className="flex items-center gap-4">
              <video
                src="/main.mp4"
                autoPlay
                loop
                muted
                defaultMuted
                playsInline
                className="w-20 h-20 rounded-full object-cover border-2 border-purple-200 bg-black"
              />
              <div>
                <h2 className="text-xl text-gray-800">{dogProfile.name}</h2>
                <p className="text-sm text-purple-600 mt-1">
                  {dogProfile.breed} • {dogProfile.age}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">{dogProfile.bio}</p>
          </div>

          <h1 className="text-2xl text-gray-800 flex items-center gap-2">
            <Film size={22} className="text-purple-500" />
            Recordings Gallery
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Saved recordings are stored locally and playable here.
          </p>
        </motion.div>

        {loading ? (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-500 shadow-sm">
            Loading recordings...
          </div>
        ) : recordingViews.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-500 shadow-sm">
            No recordings yet.
          </div>
        ) : (
          <div className="space-y-4">
            {recordingViews.map((recording) => (
              <motion.div
                key={recording.id}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <p className="text-xs text-gray-500 mb-3">
                  {new Date(recording.createdAt).toLocaleString()}
                </p>
                <video
                  src={recording.url}
                  controls
                  muted
                  defaultMuted
                  playsInline
                  className="w-full rounded-xl bg-black"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
