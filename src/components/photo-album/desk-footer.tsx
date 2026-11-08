import { GithubIcon } from "@/components/icons/github-icon";
import { BehanceIcon } from "@/components/icons/behance-icon";
import { SITE_LINKS } from "@/lib/constants";
import { Button } from "../ui/button";

export function DeskFooter() {
  return (
    <footer className="flex items-center justify-center gap-3 font-mono text-sm tracking-wide text-neutral-800">
      <span>Dona_intermitente</span>
      <div className="flex items-center">
        <Button asChild variant="ghost">
          <a href={SITE_LINKS.github} target="_blank" rel="noreferrer noopener">
            <GithubIcon className="size-4" />
          </a>
        </Button>
        <Button asChild variant="ghost">
          <a href={SITE_LINKS.behance} target="_blank" rel="noreferrer noopener">
            <BehanceIcon className="size-4" />
          </a>
        </Button>
      </div>
    </footer>
  );
}
