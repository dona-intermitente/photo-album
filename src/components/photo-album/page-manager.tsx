"use client";

import { DragDropProvider, DragEndEvent } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { GripVertical, ImageOffIcon, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAlbumPhotoStore } from "@/store/use-album-photo-store";
import { Page } from "@/types/photo-album";
import { cn } from "cn";
import { ConfirmDeleted } from "./confirm-deleted";
import { useState } from "react";
import Image from "next/image";

interface PageItemProps {
  page: Page;
  index: number;
  displayNumber: number;
  isActive: boolean;
  canDelete: boolean;
  onSelect: () => void;
  onRequestDelete: () => void;
}

function PageItem({
  page,
  index,
  displayNumber,
  isActive,
  canDelete,
  onSelect,
  onRequestDelete,
}: PageItemProps) {
  const { ref, handleRef } = useSortable({ id: page.id, index });

  return (
    <div
      ref={ref}
      onClick={onSelect}
      className={cn(
        "transition-all rounded-sm",
        isActive ? "bg-accent" : "cursor-pointer hover:bg-accent/50",
      )}
    >
      <div className="flex items-center justify-between p-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            ref={handleRef}
            aria-label={`Mover página ${displayNumber}`}
            onClick={(e) => e.stopPropagation()}
            className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
          >
            <GripVertical className="size-4" />
          </button>
          <div className="flex gap-2 items-center">
            <div className="relative size-10 rounded-xs overflow-hidden">
              {Boolean(page.photos.length) ? (
                <Image
                  src={page.photos[0].url}
                  alt={page.photos[0].id}
                  fill
                  className="object-cover"
                  quality={60}
                />
              ) : (
                <ImageOffIcon size={40} className="text-muted-foreground" />
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {page.photos.length === 1 ? "1 foto" : `${page.photos.length} fotos`}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!canDelete}
          aria-label={`Eliminar página ${displayNumber}`}
          onClick={(e) => {
            e.stopPropagation();
            onRequestDelete();
          }}
          className="size-7 text-muted-foreground hover:text-destructive disabled:opacity-30"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

interface PageManagerProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export function PageManager({
  trigger,
  open,
  onOpenChange,
  side = "right",
  align = "start",
}: PageManagerProps) {
  const [pageToDelete, setPageToDelete] = useState<number | null>(null);
  const { pages, currentPageIndex, deletePage, reorderPages, setCurrentPageIndex } =
    useAlbumPhotoStore();

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return;

    const source = event.operation.source;
    if (!isSortable(source)) return;

    const { initialIndex, index: newIndex } = source;
    if (initialIndex === newIndex) return;

    const updated = [...pages];
    const [moved] = updated.splice(initialIndex, 1);
    updated.splice(newIndex, 0, moved);

    reorderPages(updated);
  };

  const handleConfirmDelete = () => {
    if (pageToDelete !== null) {
      deletePage(pageToDelete);
      setPageToDelete(null);
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={onOpenChange}>
        {trigger && <PopoverTrigger asChild>{trigger}</PopoverTrigger>}
        <PopoverContent side={side} align={align} className="w-80 p-4">
          <PopoverHeader>
            <PopoverTitle>Gestión de Páginas</PopoverTitle>
            <PopoverDescription>
              Arrastrá para reordenar o seleccioná una página.
            </PopoverDescription>
          </PopoverHeader>

          <DragDropProvider onDragEnd={handleDragEnd}>
            <div className="flex max-h-64 flex-col gap-2 overflow-y-auto">
              {pages.map((page, index) => (
                <PageItem
                  key={page.id}
                  page={page}
                  index={index}
                  displayNumber={index + 1}
                  isActive={index === currentPageIndex}
                  canDelete={pages.length > 1}
                  onSelect={() => setCurrentPageIndex(index)}
                  onRequestDelete={() => setPageToDelete(page.id)}
                />
              ))}
            </div>
          </DragDropProvider>
        </PopoverContent>
      </Popover>

      <ConfirmDeleted
        open={pageToDelete !== null}
        onOpenChange={(isOpen) => !isOpen && setPageToDelete(null)}
        onDelete={handleConfirmDelete}
        title="¿Estás seguro que quieres eliminar la página?"
        description="Esta acción no se puede deshacer. Se eliminarán las fotos contenidas en esta página."
      />
    </>
  );
}
