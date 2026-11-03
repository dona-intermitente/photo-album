"use client";

import { MIN_VIEWPORT_WIDTH } from "@/lib/constants";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ViewportError } from "./viewport-error";

type PlatformGateProps = {
  children: React.ReactNode;
};

/**
 * Gate de plataforma. Vive dentro de `page.tsx`, nunca envolviendo `children`
 * en el layout: si un componente condicional decide no renderizar un segmento
 * de ruta, Next no puede validar instant navigation y reporta "dropped segment".
 *
 * Hoy mapea a T1-02. Cuando lleguen T1-03 y T1-09, este componente pasa a leer
 * la fase desde el store (INITIALIZING / VIEWPORT_ERROR / SPLASH /
 * PLATFORM_ACTIVE) sin cambiar su posición en el árbol.
 */
export function PlatformGate({ children }: PlatformGateProps) {
  const isDesktop = useMediaQuery(`(min-width: ${MIN_VIEWPORT_WIDTH}px)`);

  // INITIALIZING: sin medir todavía (SSR y primer render de hidratación).
  if (isDesktop === null) {
    return <div className="flex-1 bg-background" aria-hidden />;
  }

  // VIEWPORT_ERROR: pantalla chica.
  if (!isDesktop) {
    return <ViewportError />;
  }

  // PLATFORM_ACTIVE.
  return <>{children}</>;
}
