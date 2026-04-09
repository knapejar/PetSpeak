import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { CameraScreen } from "./components/CameraScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { VoiceSettingsScreen } from "./components/VoiceSettingsScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: CameraScreen },
      { path: "profile", Component: ProfileScreen },
      { path: "settings", Component: VoiceSettingsScreen },
    ],
  },
]);
