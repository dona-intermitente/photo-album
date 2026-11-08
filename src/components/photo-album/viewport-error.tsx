import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HeartCrackIcon } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { SITE_LINKS } from "@/lib/constants";
import { GithubIcon } from "../icons/github-icon";
import { BehanceIcon } from "../icons/behance-icon";

export function ViewportError() {
  return (
    <Empty className="bg-dots">
      <Card className="max-w-md shadow-sticker bg-accent px-4">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HeartCrackIcon />
          </EmptyMedia>
          <EmptyTitle>Lo sentimos mucho</EmptyTitle>
          <EmptyDescription>
            Esta web requiere una pantalla más grande para funcionar correctamente.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-col sm:flex-row justify-center gap-2">
          <Button asChild className="w-full sm:w-auto">
            <a href={SITE_LINKS.github} target="_blank" rel="noreferrer noopener">
              <GithubIcon className="size-4" /> Repositorio
            </a>
          </Button>
          <Button asChild className="w-full sm:w-auto" variant="outline">
            <a href={SITE_LINKS.behance} target="_blank" rel="noreferrer noopener">
              <BehanceIcon className="size-4" /> Más proyectos
            </a>
          </Button>
        </EmptyContent>
      </Card>
    </Empty>
  );
}
