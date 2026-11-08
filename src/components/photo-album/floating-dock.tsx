import { BookHeartIcon } from "@/components/icons/book-heart-icon";
import { Button } from "@/components/ui/button";
import { Layers, Palette, Upload } from "lucide-react";

export function FloatingDock() {
  return (
    <aside
      aria-label="Herramientas de edición"
      className="animate-in duration-700 slide-in-from-top-100 space-y-6 rounded-b-full bg-primary px-2 py-5 text-primary-foreground"
    >
      <Button variant="ghost" size="icon" aria-label="Álbum y portada">
        <BookHeartIcon className="size-6" />
      </Button>

      <div className="flex flex-col gap-2">
        <Button variant="ghost" size="icon" aria-label="Capas y páginas">
          <Layers />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Paleta y estilos">
          <Palette />
        </Button>
      </div>

      <Button variant="ghost" size="icon" aria-label="Subir contenido">
        <Upload />
      </Button>
    </aside>
  );
}
