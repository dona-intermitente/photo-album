"use client";

import { useWindowSize } from "@/hooks/use-window-size";
import { BinderRingsIcon } from "../icons/binder-rings-icon";
import { PencilIcon } from "../icons/pencil-icon";
import { PhotoCameraIcon } from "../icons/photo-camera-icon";
import { StampV1Icon, StampV2Icon } from "../icons/stamp-icon";
import { StickerSmile } from "../icons/sticker-smile-icon";
import { WashiTape } from "../icons/washi-tape-icon";
import { Card, CardContent } from "../ui/card";
import { DeskFooter } from "./desk-footer";
import { FloatingDock } from "./floating-dock";
import { useMemo } from "react";

interface PlatformLayoutProps {
  children: React.ReactNode;
}

export function PlatformLayout({ children }: PlatformLayoutProps) {
  const { height } = useWindowSize();

  const totalHardcovers = useMemo(() => {
    if (!height) return 0;

    const totalHeight = height - 224;
    const hardcoverHeight = 80;
    const total = Math.floor(totalHeight / hardcoverHeight);
    return total > 8 ? 8 : total;
  }, [height]);

  return (
    <div className="animate-in fade-in duration-700 flex h-full w-full flex-col gap-6">
      <div className="grid-col-1 grid flex-1 lg:grid-cols-6">
        <div className="hidden lg:block pt-16 pb-20 h-full">
          <Card className="shadow-sticker bg-dots h-full w-full rounded-l-none border-l-0">
            <CardContent className="h-full justify-end gap-12 pr-10">
              <WashiTape className="text-background/50 stroke-2 stroke-primary w-4/5 -translate-x-10 rotate-12" />
              <StickerSmile className="w-1/3 self-end" />
            </CardContent>
          </Card>
        </div>
        <main className="relative flex flex-col gap-5 px-4 lg:col-span-4 pt-16 pb-6">
          <div className="absolute top-0 -left-8 z-20 flex gap-4 h-full w-20 flex-col justify-between py-24">
            {Array.from({ length: totalHardcovers }).map((_, index) => (
              <BinderRingsIcon key={index} className="w-20 text-primary shrink-0" />
            ))}
          </div>
          <div className="absolute top-0 left-20 z-20">
            <FloatingDock />
          </div>
          <div className="absolute w-32 top-8 right-10 z-0 space-y-4 rotate-90">
            <WashiTape className="text-primary w-full" />
            <WashiTape className="stroke-primary w-full rotate-180 stroke-2 text-accent" />
          </div>
          <div className="relative z-10 flex-1">{children}</div>
          <DeskFooter />
        </main>
        <div className="hidden lg:flex flex-col justify-center overflow-hidden">
          <PhotoCameraIcon className="shrink-0 w-4/5 translate-x-10 -rotate-12" />
          <StampV1Icon className="shrink-0 w-2/5 translate-x-5 -translate-y-5 rotate-12" />
          <StampV2Icon className="shrink-0 w-2/5 translate-x-10 -translate-y-10 -rotate-12" />
          <PencilIcon className="shrink-0 w-3/4 translate-x-10 -rotate-12" />
        </div>
      </div>
    </div>
  );
}
