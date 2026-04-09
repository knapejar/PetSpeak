import { Camera, User, Settings, SlidersHorizontal } from "lucide-react";
import { Link, useLocation } from "react-router";
import { motion } from "motion/react";

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Camera, label: "Camera" },
    { path: "/controller", icon: SlidersHorizontal, label: "Control" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/settings", icon: Settings, label: "Voice" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-t border-purple-100 px-6 py-4 safe-area-bottom">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} to={item.path} className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`p-3 rounded-2xl transition-colors ${
                    isActive
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                      : "text-gray-500"
                  }`}
                >
                  <Icon size={24} />
                </div>
                <span
                  className={`text-xs ${
                    isActive ? "text-purple-600" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
