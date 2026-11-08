"use client";

import { useState } from "react";
import { PlatformGate } from "@/components/photo-album/platform-gate";
import { SplashScreen } from "@/components/photo-album/splash-screen";
import { DeskCanvas } from "@/components/photo-album/desk-canvas";

export default function Home() {
  const [isSplashCompleted, setIsSplashCompleted] = useState(false);

  return (
    <PlatformGate>
      <div className="bg-background flex flex-1 flex-col items-center justify-center">
        {!isSplashCompleted ? (
          <SplashScreen onComplete={() => setIsSplashCompleted(true)} />
        ) : (
          <DeskCanvas />
        )}
      </div>
    </PlatformGate>
  );
}
