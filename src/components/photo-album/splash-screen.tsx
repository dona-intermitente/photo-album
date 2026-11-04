"use client";

import { useState, useEffect } from "react";
import { PhotoCameraIcon } from "../icons/photo-camera-icon";
import { PartyPopperIcon } from "../icons/party-popper-icon";
import { BookHeartIcon } from "../icons/book-heart-icon";
import { cn } from "@/lib/utils";

interface SplashScreenProps {
  onComplete: () => void;
}

const SPLASH_STEPS = [
  {
    id: "party",
    label: "Celebrando la vida",
    icon: PartyPopperIcon,
  },
  {
    id: "camera",
    label: "Capturando momentos",
    icon: PhotoCameraIcon,
  },
  {
    id: "album",
    label: "Guardar recuerdos",
    icon: BookHeartIcon,
  },
];

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const stepDuration = 2000; // 2 segundos por cada estado
  const exitDuration = 500; // 500ms de animación de salida

  useEffect(() => {
    // Cambio de paso basado en tiempo
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prevIndex) => {
        if (prevIndex < SPLASH_STEPS.length - 1) {
          return prevIndex + 1;
        } else {
          clearInterval(stepInterval);
          setTimeout(() => {
            setIsExiting(true);
          }, 300); // Pequeña pausa al llegar al 100%
          return prevIndex;
        }
      });
    }, stepDuration);

    return () => clearInterval(stepInterval);
  }, [stepDuration]);

  useEffect(() => {
    if (!isExiting) return;

    const timer = setTimeout(() => {
      onComplete();
    }, exitDuration);

    return () => clearTimeout(timer);
  }, [isExiting, onComplete, exitDuration]);

  const currentStep = SPLASH_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;

  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center overflow-hidden",
        isExiting && "animate-out fade-out slide-out-to-top-8 duration-500 fill-mode-forwards",
      )}
    >
      <StepIcon className="animate-bounce size-16" />
      <p className="font-heading font-medium text-xl">{currentStep.label}</p>
    </div>
  );
}
