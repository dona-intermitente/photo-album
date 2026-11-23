"use client";

import { ImagePlusIcon } from "lucide-react";
import { cn } from "cn";
import { DropzoneState } from "react-dropzone";
import { PhotoGrid } from "./photo-grid";
import { Photo } from "@/types/photo-album";

interface ImageDropZoneProps extends DropzoneState {
  photos: Photo[];
}

export function ImageDropZone({
  getInputProps,
  getRootProps,
  isDragActive,
  photos,
}: ImageDropZoneProps) {
  return (
    <div
      className={cn(
        "w-full h-full flex flex-col space-y-4 items-center justify-center transition-colors",
        Boolean(photos.length) ? "cursor-default" : "cursor-pointer",
        isDragActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
      {...getRootProps()}
    >
      <input {...getInputProps()} />

      {Boolean(photos.length) ? (
        <PhotoGrid photos={photos} />
      ) : (
        <>
          <ImagePlusIcon size={60} />
          <p>
            {isDragActive
              ? "¡Archivo en proceso de subir!"
              : "Arrastra y suelta imágenes aquí, o haz clic para seleccionar."}
          </p>
        </>
      )}
    </div>
  );
}
