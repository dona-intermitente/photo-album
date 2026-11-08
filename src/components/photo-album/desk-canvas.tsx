import { ScrapbookBinder } from "./scrapbook-binder";
import { PlatformLayout } from "./platform-layout";

export function DeskCanvas() {
  return (
    <PlatformLayout>
      <ScrapbookBinder />
    </PlatformLayout>
  );
}
