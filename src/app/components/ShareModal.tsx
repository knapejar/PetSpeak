import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Twitter, Facebook, Instagram, Copy, Check } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  translation: string;
}

export function ShareModal({ isOpen, onClose, translation }: ShareModalProps) {
  const [caption, setCaption] = useState(translation);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialPlatforms = [
    { name: "Twitter", icon: Twitter, color: "bg-blue-400", textColor: "text-blue-400" },
    { name: "Facebook", icon: Facebook, color: "bg-blue-600", textColor: "text-blue-600" },
    { name: "Instagram", icon: Instagram, color: "bg-pink-500", textColor: "text-pink-500" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-purple-50 to-pink-50">
                <h2 className="text-2xl text-gray-800">Share Translation</h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Preview Card */}
              <div className="p-6">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 mb-4">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1648799834307-97650bbf7298?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NDU1NjQ4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Pet"
                      className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-purple-600 mb-1">
                        🐾 PetSpeak Translation
                      </p>
                      <p className="text-gray-700 text-sm italic">
                        "{translation}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Caption Field */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-600 mb-2">
                    Caption
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-none focus:border-purple-400 focus:outline-none transition-colors"
                    rows={3}
                    placeholder="Add a caption..."
                  />
                </div>

                {/* Copy Link Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopy}
                  className="w-full mb-6 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center gap-2 text-gray-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={20} className="text-green-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={20} />
                      <span>Copy Text</span>
                    </>
                  )}
                </motion.button>

                {/* Social Share Buttons */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-3">Share to</p>
                  {socialPlatforms.map((platform) => (
                    <motion.button
                      key={platform.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-4 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl flex items-center gap-4 transition-colors"
                    >
                      <div className={`w-10 h-10 ${platform.color} rounded-full flex items-center justify-center text-white`}>
                        <platform.icon size={20} />
                      </div>
                      <span className={`${platform.textColor}`}>
                        Share to {platform.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
