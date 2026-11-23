import React from "react";
import Masonry from "react-masonry-css";
import Image from "next/image";
import { Photo } from "@/types/photo-album";
import { cn } from "cn";
import { useAlbumPhotoStore } from "@/store/use-album-photo-store";

interface PhotoGridProps {
  photos: Photo[];
}

export const PhotoGrid = ({ photos }: PhotoGridProps) => {
  const { selectedPhotos, toggleSelectedPhoto } = useAlbumPhotoStore();

  const breakpoints = photos.length > 2 ? Math.ceil(photos.length / 2) : photos.length;

  const handleSelectPhoto = (photo: Photo) => toggleSelectedPhoto(photo);

  return (
    <Masonry
      breakpointCols={breakpoints}
      className="w-full h-full flex gap-2 p-4"
      columnClassName="flex flex-col h-full w-full overflow-hidden gap-2"
    >
      {photos.map((photo, index) => (
        <div key={index} className="flex w-full h-full relative">
          <Image
            key={index}
            src={photo.url}
            alt={photo.id}
            fill
            className={cn(
              "max-h-full w-fit! h-fit! cursor-pointer object-contain rounded-md self-center",
              photos.length === 1 ? "justify-self-center" : index % 2 === 0 && "justify-self-end",
              selectedPhotos.includes(photo) && "border-2",
            )}
            onClick={() => handleSelectPhoto(photo)}
          />
        </div>
      ))}
    </Masonry>
  );
};
