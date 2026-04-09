import { motion } from "motion/react";
import { Heart, Camera, MapPin, Calendar } from "lucide-react";

const petProfile = {
  name: "Max",
  breed: "Golden Retriever",
  age: "3 years old",
  location: "San Francisco, CA",
  joinedDate: "January 2023",
  bio: "Professional napper, treat enthusiast, and full-time cuddle expert. Loves long walks on the beach and stealing socks.",
  photos: [
    "https://images.unsplash.com/photo-1648799834307-97650bbf7298?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NDU1NjQ4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1615233500064-caa995e2f9dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBwdXBweXxlbnwxfHx8fDE3NzQ1NDczOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1771125633724-acad7b8405cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBvdXRkb29ycyUyMHBhcmt8ZW58MXx8fHwxNzc0NTY3ODg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1763195003883-eefcc874c7f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBzaXR0aW5nJTIwY296eXxlbnwxfHx8fDE3NzQ1Njc4ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1710780126902-a29d3a89bf7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY2F0JTIwZmFjZXxlbnwxfHx8fDE3NzQ1MzU0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1621854065840-8a83d8a97009?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGF5ZnVsJTIwa2l0dGVufGVufDF8fHx8MTc3NDU2Nzg4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ],
  stats: {
    translations: 342,
    favorites: 128,
    shares: 89,
  },
};

export function ProfileScreen() {
  return (
    <div className="h-full overflow-y-auto">
      {/* Hero Section with Profile Image */}
      <div className="relative h-80 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400">
        <div className="absolute inset-0 bg-black/20" />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-6"
        >
          <div className="relative">
            <img
              src={petProfile.photos[0]}
              alt={petProfile.name}
              className="w-32 h-32 rounded-full object-cover border-6 border-white shadow-2xl"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg"
            >
              <Camera size={18} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Profile Info */}
      <div className="px-6 pt-4 pb-24">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl text-gray-800 mb-2 flex items-center justify-center gap-2">
            {petProfile.name}
            <Heart size={24} className="text-pink-500 fill-pink-500" />
          </h1>
          <p className="text-lg text-purple-600 mb-1">{petProfile.breed}</p>
          <p className="text-gray-600">{petProfile.age}</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4 mb-6"
        >
          {Object.entries(petProfile.stats).map(([key, value], index) => (
            <div
              key={key}
              className="flex-1 bg-white rounded-2xl p-4 text-center shadow-sm"
            >
              <div className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                {value}
              </div>
              <div className="text-xs text-gray-600 capitalize">{key}</div>
            </div>
          ))}
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6"
        >
          <h3 className="text-sm text-purple-600 mb-3 flex items-center gap-2">
            <Heart size={16} />
            About {petProfile.name}
          </h3>
          <p className="text-gray-700 leading-relaxed">{petProfile.bio}</p>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} className="text-purple-500" />
              {petProfile.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} className="text-purple-500" />
              Joined {petProfile.joinedDate}
            </div>
          </div>
        </motion.div>

        {/* Photo Gallery */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg text-gray-800 mb-4 flex items-center gap-2">
            <Camera size={20} className="text-purple-500" />
            Photo Album
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {petProfile.photos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
              >
                <img
                  src={photo}
                  alt={`${petProfile.name} photo ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
