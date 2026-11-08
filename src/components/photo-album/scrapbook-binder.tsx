"use client";

import { Button } from "@/components/ui/button";
import { ImagePlusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { TapeIcon } from "../icons/tape-icon";
import { useEffect, useState } from "react";
import { type CarouselApi } from "../ui/carousel";

export function ScrapbookBinder() {
  const [pages, setPages] = useState<number>(1);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);

  const handlePlus = () => {
    if (!api) return;
    const nextIndex = pages;
    setPages(pages + 1);
    const scrollOnce = () => {
      api.scrollTo(nextIndex);
      api.off("reInit", scrollOnce);
    };
    api.on("reInit", scrollOnce);
  };

  useEffect(() => {
    if (!api) return;
    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  return (
    <Card className="relative shadow-sticker h-full bg-dots pt-10">
      <CardContent className="px-24 h-full min-h-0 justify-center gap-4">
        <Carousel className="rounded-lg border max-h-full w-full aspect-video" setApi={setApi}>
          <CarouselContent className="h-full">
            {Array.from({ length: pages }).map((_, index) => (
              <CarouselItem key={index} className="flex">
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          {current === pages ? (
            <Button
              data-slot="carousel-plus"
              variant="outline"
              size="icon-sm"
              className="absolute touch-manipulation inset-y-0 -right-12 my-auto"
              onClick={handlePlus}
            >
              <PlusIcon />
              <span className="sr-only">Plus slide</span>
            </Button>
          ) : (
            <CarouselNext />
          )}
          <TapeIcon className="w-24 absolute -top-5 -right-10 -rotate-170 text-accent/50 stroke-1 stroke-primary" />
          <TapeIcon className="w-24 absolute -bottom-5 -left-10 rotate-12 text-accent/50 stroke-1 stroke-primary" />
        </Carousel>

        <CardFooter className="justify-center gap-4">
          <Button size="icon" aria-label="Add image">
            <ImagePlusIcon />
          </Button>
          <Button variant="destructive" size="icon" aria-label="Remove current page">
            <TrashIcon />
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
