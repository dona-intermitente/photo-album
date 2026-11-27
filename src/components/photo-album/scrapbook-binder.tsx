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
import { ImageDropZone } from "./image-drop-zone";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { ACCEPTED_FILE_TYPES, MAX_FILES } from "@/lib/constants";
import { useAlbumPhotoStore } from "@/store/use-album-photo-store";
import { ToastRejections } from "./toast-rejections";
import { ConfirmDeleted } from "./confirm-deleted";

export function ScrapbookBinder() {
  const [api, setApi] = useState<CarouselApi>();
  const [openConfirmDeleted, setOpenConfirmDeleted] = useState(false);

  const {
    pages,
    currentPageIndex,
    selectedPhotos,
    addPage,
    addPhotosToCurrentPage,
    deleteSelectedPhotos,
    setCurrentPageIndex,
  } = useAlbumPhotoStore();

  const currentPhotosAmount = pages[currentPageIndex].photos.length;

  const handlePlus = () => {
    if (!api) return;
    addPage();
    const scrollOnce = () => {
      api.scrollTo(pages.length);
      api.off("reInit", scrollOnce);
    };
    api.on("reInit", scrollOnce);
  };

  const onDropHandler = (acceptedFiles: File[]) => {
    let files = acceptedFiles;
    if (currentPhotosAmount + acceptedFiles.length > MAX_FILES) {
      files = acceptedFiles.splice(0, MAX_FILES - currentPhotosAmount);
      toast.warning(
        "Error al cargar",
        ToastRejections({
          id: "too-many-files",
          files: acceptedFiles,
          message: `Solo se permiten ${MAX_FILES} imágenes por página`,
        }),
      );
    }

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        const photo = {
          id: file.name,
          url: base64String,
        };

        addPhotosToCurrentPage([photo]);
      };

      reader.readAsDataURL(file);
    });
  };

  const dropzone = useDropzone({
    onDrop: onDropHandler,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: MAX_FILES,
    noDrag: Boolean(currentPhotosAmount),
    noClick: Boolean(currentPhotosAmount),
  });

  const { fileRejections, open } = dropzone;

  useEffect(() => {
    if (fileRejections.length > 0) {
      const tooMany = fileRejections.filter(({ errors }) =>
        errors.some(({ code }) => code === "too-many-files"),
      );
      const invalidType = fileRejections.filter(({ errors }) =>
        errors.some(({ code }) => code === "file-invalid-type"),
      );

      if (tooMany.length > 0)
        toast.warning(
          "Error al cargar",
          ToastRejections({
            id: "too-many-files",
            files: tooMany.map(({ file }) => file),
            message: `Solo se permiten ${MAX_FILES} imágenes por página`,
          }),
        );

      if (invalidType.length > 0)
        toast.error(
          "Error al cargar",
          ToastRejections({
            id: "invalid-file-type",
            files: invalidType.map(({ file }) => file),
            message: "Solo se permiten archivos tipo imagen",
          }),
        );
    }
  }, [fileRejections]);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      const snapIndex = api.selectedScrollSnap();
      if (snapIndex !== currentPageIndex) {
        setCurrentPageIndex(snapIndex);
      }
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, currentPageIndex, setCurrentPageIndex]);

  useEffect(() => {
    if (!api) return;
    if (api.selectedScrollSnap() !== currentPageIndex) {
      api.scrollTo(currentPageIndex);
    }
  }, [api, currentPageIndex]);

  return (
    <>
      <Card className="relative shadow-sticker h-full bg-dots pt-10">
        <CardContent className="px-24 h-full min-h-0 justify-center gap-4">
          <Carousel className="rounded-lg border max-h-full w-full aspect-video" setApi={setApi}>
            <CarouselContent className="h-full">
              {pages.map((page) => (
                <CarouselItem key={page.id}>
                  <ImageDropZone {...dropzone} photos={page.photos} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious disabled={currentPageIndex === 0 || Boolean(selectedPhotos.length)} />
            {currentPageIndex === pages.length - 1 ? (
              <Button
                data-slot="carousel-plus"
                variant="outline"
                size="icon-sm"
                className="absolute touch-manipulation inset-y-0 -right-12 my-auto"
                onClick={handlePlus}
                disabled={!currentPhotosAmount || Boolean(selectedPhotos.length)}
              >
                <PlusIcon />
                <span className="sr-only">Plus slide</span>
              </Button>
            ) : (
              <CarouselNext disabled={Boolean(selectedPhotos.length)} />
            )}
            <TapeIcon className="w-24 absolute -top-5 -right-10 -rotate-170 text-accent/50 stroke-1 stroke-primary" />
            <TapeIcon className="w-24 absolute -bottom-5 -left-10 rotate-12 text-accent/50 stroke-1 stroke-primary" />
          </Carousel>

          <CardFooter className="justify-center gap-4">
            <Button
              disabled={currentPhotosAmount === MAX_FILES || Boolean(selectedPhotos.length)}
              size="icon"
              aria-label="Add image"
              onClick={open}
            >
              <ImagePlusIcon />
            </Button>
            <Button
              disabled={!selectedPhotos.length}
              variant="destructive"
              size="icon"
              aria-label="Remove selected images"
              onClick={() => setOpenConfirmDeleted(true)}
            >
              <TrashIcon />
            </Button>
          </CardFooter>
        </CardContent>
      </Card>

      <ConfirmDeleted
        open={openConfirmDeleted}
        onOpenChange={setOpenConfirmDeleted}
        onDelete={deleteSelectedPhotos}
        title="¿Estás seguro que quieres eliminar la/las foto/s?"
        description="Esta acción no se puede deshacer. Esto eliminará permanentemente la foto de la página."
      />
    </>
  );
}
