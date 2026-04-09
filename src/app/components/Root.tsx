import { Outlet } from "react-router";
import { BottomNav } from "./BottomNav";

export function Root() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-[420px] h-[92vh] max-h-[860px] rounded-[2.75rem] border-8 border-zinc-900 bg-black shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-zinc-900 rounded-b-2xl z-20" />
        <div className="h-full w-full bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 flex flex-col overflow-hidden rounded-[2.1rem]">
          <div className="flex-1 overflow-hidden">
            <Outlet />
          </div>
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
