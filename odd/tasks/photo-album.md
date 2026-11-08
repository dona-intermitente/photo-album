# Tareas ODD — photo-album

## Objetivo

Implementar un álbum digital tipo scrapbook local-only con Next.js, siguiendo los flujos definidos en `general-user-flow.md`.

## Problema

El usuario necesita una aplicación web que permita subir fotos (máximo 6 por página), organizarlas automáticamente en un grid tipo Pinterest sobre un fondo estático, gestionar páginas y estilos globales, con persistencia solo en el navegador.

## Por qué

Crear una herramienta personal de recuerdos sin depender de backend ni cuentas en la nube.

## Alcance

- Guardia de viewport y pantalla de error
- Secuencia de splash de 3 estados
- Plataforma principal con sidebar, barra superior, pie de página y área de trabajo
- Grid automático de fotos (máx. 6, estilo Pinterest)
- Subida de fotos y persistencia en localStorage
- Modal de gestión de páginas (reordenar, eliminar, seleccionar)
- Modal de estilos globales (fondo estático, picker de color)
- Máquina de estados global de la aplicación

## Restricciones

- Sin backend, sin autenticación, sin almacenamiento en la nube
- Todo persiste en `localStorage` / IndexedDB del navegador
- Máximo 6 fotos por página
- Fondo estático (no lienzo interactivo libre)

## Checklist

- [x] T1-01 Scaffold Next.js App Router + Tailwind + TypeScript y estructura de carpetas
- [x] T1-02 Viewport Guard: detectar resolución mínima y renderizar pantalla de error con enlaces a GitHub/Behance
- [x] T1-03 Splash Screen: secuencia de 3 estados (fiesta, cámara, álbum) con temporizador/carga de assets
- [x] T1-04 Layout plataforma principal: Desk Canvas, Floating Dock, Cuaderno Anillado y Footer (client component)
- [ ] T1-05 Photo Grid automático: grid responsive tipo Pinterest, máximo 6 fotos por página
- [ ] T1-06 Subida de fotos: input file, preview local, guardar en Zustand + localStorage
- [ ] T1-07 Modal Gestión de Páginas: listado, drag & drop para reordenar, eliminar, seleccionar página activa
- [ ] T1-08 Modal Estilos Globales: fondo estático, selector de color, variables CSS, persistir preferencias
- [ ] T1-09 Máquina de estados global: INITIALIZING → VIEWPORT_ERROR / SPLASH → PLATFORM_ACTIVE con ramas de modales
- [ ] T1-10 Persistencia completa: fotos, páginas, orden y estilos en localStorage con rehidratación al iniciar
- [ ] T1-11 Verificación funcional end-to-end de todos los flujos

## Criterios de aceptación

- El viewport guard bloquea en pantallas pequeñas y muestra pantalla de error.
- El splash atraviesa los 3 estados antes de activar la plataforma.
- Se pueden subir hasta 6 fotos y se organizan automáticamente en grid tipo Pinterest.
- Las páginas se pueden reordenar, eliminar y seleccionar desde el modal.
- El fondo estático y el color se personalizan y persisten al recargar.
- Todo el estado sobrevive al recargar la página (localStorage).

## Chequeos aplicables

- Prueba manual de cada flujo desde `general-user-flow.md`.
- Verificación de persistencia: recargar página y confirmar estado restaurado.
- Prueba de viewport: cambiar tamaño de ventana y confirmar pantalla de error.
- Límite de 6 fotos: intentar subir más y confirmar bloqueo/interfaz.

## Progreso

2 / 11 tareas completadas.

## Próximo paso

T1-03 Splash Screen: secuencia de 3 estados (fiesta, cámara, álbum) con temporizador/carga de assets.
