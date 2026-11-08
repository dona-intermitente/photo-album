# Desglose de tareas — photo-album (11 tareas)

Fuente: `odd/tasks/photo-album.md` (checklist original T1-01 … T1-11).

## Decisiones técnicas asumidas (confirmar antes de empezar)

| Área              | Suposición actual                                                                         |
| ----------------- | ----------------------------------------------------------------------------------------- |
| Framework         | Next.js App Router, React 19, TypeScript                                                  |
| Estilos           | Tailwind CSS + shadcn/ui (componentes base)                                               |
| Gestión de estado | Zustand + localStorage (sin backend)                                                      |
| Persistencia      | localStorage del navegador (fotos, páginas, orden, estilos)                               |
| Grid Pinterest    | CSS puro (`column-count` / `break-inside`) sin librerías pesadas                          |
| Drag & drop       | HTML5 DnD nativo o `@dnd-kit` (por decidir)                                               |
| Colores           | `<input type="color">` o color-picker de shadcn/comunidad                                 |
| Imágenes          | Vista previa local con `URL.createObjectURL` (sin subida real)                            |
| Gate de viewport  | `PlatformGate` dentro de `app/page.tsx`; nunca envolviendo `children` en `app/layout.tsx` |

> Estrategia de shadcn/ui: se ejecuta `npx shadcn@latest init` una sola vez en T1-01. Los componentes individuales se agregan con `npx shadcn@latest add <componente>` **a medida que cada tarea los requiere**, no todos de antemano. Cada tarea registra qué componentes instala en su sección "Componentes shadcn involucrados".

> Si alguna suposición no encaja con lo que tenés planeado, decímelo antes de implementar y ajusto el desglose.

---

## T1-01 — Scaffold Next.js App Router + Tailwind + TypeScript + shadcn/ui

**Estado:** completada

**Objetivo:** dejar la aplicación lista para empezar a construir, con la estructura de carpetas, las dependencias base y el control de calidad de código mediante commits estandarizados (Husky, Lint-staged, Commitlint).

### Subtareas

1. Inicializar el proyecto Next.js (App Router, TypeScript, Tailwind CSS).
2. Instalar e inicializar shadcn/ui (`npx shadcn@latest init`) y registrarlo en `components.json`.
3. Instalar Zustand y definir la carpeta `src/store`.
4. Crear estructura de carpetas: `src/components/photo-album`, `src/types`.
5. Configurar variables CSS globales (colores de fondo estático, tipografía).
6. Configurar Husky, Commitlint y Lint-staged para asegurar commits estandarizados (Conventional Commits) y validación previa al commit.

### Componentes shadcn involucrados

- Ninguno en esta tarea. `shadcn/ui` se inicializa con `init`; los componentes se agregan individualmente a partir de T1-02 según se necesiten.

### Definition of Done

- `npm run dev` corre sin errores.
- `npm run build` pasa.
- Estructura de carpetas creada y `components.json` configurado para shadcn/ui.
- Variables CSS base definidas para el fondo estático.

---

## T1-02 — Viewport Guard: resolución mínima y pantalla de error

**Estado:** completada

**Objetivo:** bloquear la app en pantallas pequeñas y mostrar una pantalla de error con enlaces a GitHub y Behance.

> **Ubicación del gate (decidido):** el guard es el componente `PlatformGate` y vive en `app/page.tsx`, envolviendo **solo el contenido de la plataforma**. `app/layout.tsx` renderiza `{children}` directo en `<body>`.
>
> Nunca envolver `children` con el gate en `app/layout.tsx`: un componente condicional por encima de los segmentos de ruta hace que Next descarte `page.tsx` del render y reporte `Route "/": Could not validate that a segment in your UI has instant navigation` con `Dropped segment: src/app/page.tsx`. El validador de Instant Navigation de Cache Components solo puede validar segmentos que efectivamente se renderizaron.
>
> Regla: **el gate puede ser dueño de la plataforma, nunca de los segmentos de ruta.**

### Subtareas

1. Definir la resolución mínima permitida (768 px de ancho) y el umbral de detección.
2. Agregar componentes shadcn necesarios: `npx shadcn@latest add card empty`.
3. Crear componente `PlatformGate` en `src/components/photo-album/platform-gate.tsx` como client component, usando `useMediaQuery` (`matchMedia` + `useSyncExternalStore`) para detectar el tamaño de pantalla.
4. Crear la pantalla de error `ViewportError` con mensaje claro y enlaces externos a GitHub/Behance.
5. Renderizar `PlatformGate` dentro de `app/page.tsx` envolviendo el contenido de la plataforma, para que el gate resuelva antes de renderizar la plataforma.
6. Resolver los tres estados del gate: `null` → placeholder neutro (`INITIALIZING`), `false` → `ViewportError` (`VIEWPORT_ERROR`), `true` → `children` (`PLATFORM_ACTIVE`).
7. Probar cambio de tamaño de ventana: si pasa por debajo del mínimo, se muestra la pantalla de error; si vuelve arriba, se permite continuar. La detección usa el listener de `matchMedia`, sin recargar.

### Componentes shadcn involucrados

- `card`, `button`, `empty`.

### Definition of Done

- En pantallas pequeñas se renderiza la pantalla de error con enlaces funcionales.
- En pantallas válidas, la app continúa al siguiente flujo (splash o plataforma).
- El cambio de tamaño de ventana se detecta sin recargar la página.
- El segmento `page.tsx` se renderiza siempre (aunque sea su placeholder), así el validador de Instant Navigation no reporta "dropped segment".

---

## T1-03 — Splash Screen: secuencia de 3 estados

**Estado:** completada

**Objetivo:** mostrar una secuencia de presentación de 3 estados antes de activar la plataforma.

### Subtareas

1. Definir los 3 estados (fiesta → cámara → álbum) con sus identificadores, etiquetas e iconos asociados (`SPLASH_STEPS`).
2. Crear componentes de iconos SVG dedicados (`PartyPopperIcon`, `PhotoCameraIcon`, `BookHeartIcon`) en `src/components/icons/`.
3. Diseñar visualmente cada estado con iconos animados (`animate-bounce`) y tipografía Tailwind (sin dependencias de componentes shadcn).
4. Implementar el componente `SplashScreen` con temporizador secuencial por estado (`stepDuration`) y animación de salida (`animate-out fade-out slide-out-to-top-8`).
5. Conectar `SplashScreen` en `app/page.tsx` mediante callback `onComplete` para alternar la vista y activar la animación de entrada de la plataforma (`animate-in fade-in slide-in-from-bottom-8`), ajustando `layout.tsx` (`overflow-hidden`) para asegurar la transición.

### Componentes shadcn involucrados

- Ninguno en esta tarea.

### Definition of Done

- El splash atraviesa los 3 estados en orden antes de activar la plataforma.
- Cada estado tiene un tiempo mínimo o evento de carga definido.
- Al finalizar, la plataforma queda disponible.

---

## T1-04 — Layout plataforma principal: Desk Canvas, Floating Dock, Cuaderno Anillado y Footer

**Objetivo:** construir la plataforma principal como client component con la metáfora visual del diseño: escritorio decorado (`DeskCanvas`), barra de herramientas flotante (`FloatingDock`), cuaderno anillado (`ScrapbookBinder`) y pie de autor.

### Subtareas

1. Crear `PlatformLayout` / `MainLayout` como client component (`'use client'`) encargado de orquestar el viewport y el escalado del escritorio.
2. Agregar componentes shadcn necesarios: `npx shadcn@latest add carousel` (`button` y `card` ya están instalados).
3. Construir `DeskCanvas` con el fondo estático y los elementos decorativos perimetrales (cámara, sellos postales, lápiz) mediante posicionamiento absoluto responsivo.
4. Construir `FloatingDock` (píldora vertical oscura flotante) con accesos directos a los modales/acciones: Álbum/Portada, Capas/Páginas (T1-07), Paleta/Estilos (T1-08) y Subida (T1-06).
5. Construir `ScrapbookBinder` (el cuaderno anillado):
   - Hoja con textura de cuadrícula de puntos (`dot-grid` en CSS/SVG).
   - Elementos decorativos: pestañas superiores (`page tabs`), esquineros de cinta adhesiva (`washi tape`), Columna de anillas negras (`binder rings`) y hoja con textura de cuadrícula de puntos (`dot-grid` en CSS/SVG) con otros elementos decorativos.
   - Carousel con controles de navegación: botón anterior `[<-]` y botón siguiente/agregar página `[+]`.
   - Marco central del carousel para el contenido/foto con barra de acciones contextuales inferior (botón de reemplazo/edición y botón rojo de eliminar).
6. Construir `DeskFooter`: créditos centrados `Dona_intermitente` con enlaces externos a GitHub y Behance.
7. Ajustar responsividad: garantizar que el cuaderno escale limpiamente y los accesorios del escritorio se oculten o reacomoden en pantallas intermedias sin romper el umbral del Viewport Guard (≥ 768px).

### Componentes shadcn involucrados

- `button`, `card`, `carousel`.

### Definition of Done

- El layout renderiza fielmente la composición del diseño: escritorio con accesorios, barra flotante, cuaderno anillado y footer.
- El `FloatingDock` expone los disparadores para los modales de páginas, estilos y subida.
- El patrón dot-grid, anillas y cintas washi se visualizan con nitidez.
- Escala de forma fluida en desktop y tablet respetando la resolución mínima.

---

## T1-05 — Photo Grid automático: grid tipo Pinterest, máximo 6 fotos por página

**Objetivo:** renderizar las fotos subidas en un grid automático estilo Pinterest, respetando el límite de 6 fotos por página.

### Subtareas

1. Definir el modelo de datos de una foto (id, url, página, orden, fechaSubida, tamaño, tipo).
2. Agregar componentes shadcn necesarios: `npx shadcn@latest add dialog` (`card`, `button`, `badge`, `scroll-area`, `toggle-group` ya están instalados).
3. Crear componente `PhotoCard` usando `card` de shadcn con miniatura, título opcional y acciones (seleccionar, eliminar).
4. Crear `PhotoGrid` con layout tipo Pinterest: columnas dinámicas según ancho de pantalla (`column-count` con `break-inside: avoid` en Tailwind) y máximo 6 tarjetas por página.
5. Implementar paginación simple: si hay más de 6 fotos, mostrar controles de página (botones shadcn `button` o `toggle-group`).
6. Vacío de estado: cuando no hay fotos, mostrar `card` vacía con mensaje y botón de subida.
7. Integrar con el store de Zustand para leer las fotos de la página activa.
8. Lightbox opcional al hacer clic en una foto (usar `dialog` de shadcn).

### Componentes shadcn involucrados

- `card`, `button`, `dialog`, `badge`, `scroll-area`, `toggle-group`.

### Definition of Done

- Las fotos se organizan en grid tipo Pinterest sin superposiciones.
- Máximo 6 fotos por página; el séptimo se bloquea o mueve a la siguiente página.
- Paginación funcional entre páginas.
- Estado vacío con llamada a la acción de subida.

---

## T1-06 — Subida de fotos: input file, preview local, Zustand + localStorage

**Objetivo:** permitir subir fotos, previsualizarlas localmente y guardarlas en el estado y almacenamiento del navegador.

### Subtareas

1. Crear componente `PhotoUploader` con `<input type="file" accept="image/*">` y botón shadcn `button`.
2. Agregar componentes shadcn necesarios: `npx shadcn@latest add input toast` (`button`, `progress`, `card`, `dialog` ya están instalados).
3. Validar tipo de archivo (imágenes) y tamaño máximo (por archivo).
4. Generar vista previa local con `URL.createObjectURL` y revocar URLs cuando ya no se usen.
5. Crear el store de Zustand con acciones: `addPhoto`, `removePhoto`, `setPhotos`, y persistencia en `localStorage`.
6. Aplicar el límite de 6 fotos por página: bloquear la subida si se alcanza el tope (mostrar `toast` de shadcn).
7. Guardar metadatos (id, nombre, tamaño, tipo, fecha, orden) junto con la URL local (blob URL o base64 si es necesario).
8. Integrar el uploader en el área de trabajo y en el `PhotoGrid`.

### Componentes shadcn involucrados

- `button`, `input`, `toast`, `progress`, `card`, `dialog`.

### Definition of Done

- Se pueden seleccionar y previsualizar imágenes antes de guardar.
- Las fotos se persisten en localStorage y sobreviven recargas.
- Se respeta el límite de 6 fotos por página con aviso claro.
- Errores de tipo/tamaño se manejan con `toast`.

---

## T1-07 — Modal Gestión de Páginas: listado, reordenar, eliminar, seleccionar

**Objetivo:** gestionar las páginas del álbum desde un modal (reordenar con drag & drop, eliminar, seleccionar página activa).

### Subtareas

1. Definir el modelo de datos de una página (id, nombre, orden, fotos[]).
2. Agregar componentes shadcn necesarios: `npx shadcn@latest add table label` (`dialog`, `card`, `button`, `input`, `separator`, `toast` ya están instalados).
3. Crear modal `PageManager` usando `dialog` de shadcn (o `sheet` en móvil).
4. Listar páginas con `table` o lista de `card` de shadcn, mostrando nombre y cantidad de fotos.
5. Implementar reordenar por drag & drop (HTML5 DnD nativo o `@dnd-kit`) y actualizar el campo `orden`.
6. Acción eliminar página (confirmar con `dialog` de shadcn) y reasignar sus fotos o borrarlas.
7. Acción seleccionar página activa (actualizar store y reflejar en el grid).
8. Acción crear página nueva (formulario con `input` de shadcn).
9. Persistir cambios de páginas en localStorage.

### Componentes shadcn involucrados

- `dialog`, `table`, `card`, `button`, `input`, `label`, `separator`, `toast`.

### Definition of Done

- Se pueden listar, reordenar, eliminar y seleccionar páginas desde el modal.
- El drag & drop actualiza el orden y se refleja en la sidebar y el grid.
- Los cambios persisten en localStorage.

---

## T1-08 — Modal Estilos Globales: fondo estático, selector de color, variables CSS

**Objetivo:** personalizar el fondo estático y el color de la aplicación, persistiendo las preferencias.

### Subtareas

1. Crear modal `GlobalStyles` usando `dialog` de shadcn. (Todos los componentes shadcn necesarios ya están instalados en tareas previas: `dialog`, `button`, `input`, `label`, `toggle-group`, `separator`.)
2. Selector de fondo estático: color sólido (`<input type="color">` o color-picker) aplicado como variable CSS en `:root` o contenedor raíz.
3. Selector de color secundario/acento (opcional) para botones o tarjetas.
4. Exponer variables CSS para `--background`, `--foreground`, `--accent`, etc., consumidas por Tailwind (`theme.extend.colors`).
5. Guardar preferencias en el store de Zustand y en `localStorage`.
6. Rehidratar estilos al iniciar la app (aplicar variables guardadas antes de renderizar la plataforma).
7. Botón "Restablecer por defecto" para volver a los valores originales.

### Componentes shadcn involucrados

- `dialog`, `button`, `input`, `label`, `toggle-group`, `separator`.

### Definition of Done

- El fondo estático y el color se personalizan y se ven reflejados en toda la app.
- Las preferencias persisten al recargar la página.
- Existe una acción de restablecer valores por defecto.

---

## T1-09 — Máquina de estados global de la aplicación

**Objetivo:** orquestar los flujos: INITIALIZING → VIEWPORT_ERROR / SPLASH → PLATFORM_ACTIVE, con ramas de modales.

### Subtareas

1. Definir estados globales: `INITIALIZING`, `VIEWPORT_ERROR`, `SPLASH`, `PLATFORM_ACTIVE`, `MODAL_OPEN` (rama de modales).
2. Crear el store de Zustand con el estado actual y transiciones permitidas.
3. Flujo de inicio: `INITIALIZING` → chequeo de viewport → si falla, `VIEWPORT_ERROR`; si pasa, `SPLASH` → al terminar splash, `PLATFORM_ACTIVE`.
4. Rama de modales: desde `PLATFORM_ACTIVE`, abrir `PageManager` o `GlobalStyles` sin salir del estado activo.
5. Integrar `PlatformGate` (T1-02) y `SplashScreen` (T1-03) con el estado global: el `if` de `PlatformGate` pasa a ser un `switch` sobre la fase del store, sin cambiar la ubicación del componente dentro de `app/page.tsx`.
6. Manejar transiciones inválidas (evitar saltarse estados).
7. Exponer el estado actual para que componentes decidan qué renderizar.

### Componentes shadcn involucrados

- Ninguno nuevo (usa `toast` para avisos de transición opcional, ya instalado).

### Definition of Done

- La app sigue el camino correcto: inicialización → viewport → splash → plataforma.
- Los modales se abren y cierran sin romper el estado de plataforma activa.
- No se pueden saltar estados (ej. ir directo a plataforma sin pasar viewport).
- El gate sigue dentro de `app/page.tsx`; `app/layout.tsx` no envuelve `children`.

---

## T1-10 — Persistencia completa: fotos, páginas, orden y estilos en localStorage

**Objetivo:** garantizar que todo el estado sobreviva al recargar la página con rehidratación al iniciar.

### Subtareas

1. Unificar la persistencia: fotos, páginas, orden de páginas, página activa y estilos globales en el mismo store de Zustand.
2. Middleware de rehidratación: al iniciar la app, leer `localStorage` y poblar el store antes de renderizar.
3. Manejar errores de almacenamiento: cuota excedida, JSON corrupto, cookies deshabilitadas (mostrar `toast` y continuar con valores por defecto).
4. Sincronizar cada cambio relevante con `localStorage` (debounce opcional para escritura frecuente).
5. Probar recarga de página: fotos, páginas, orden, selección activa y estilos se restauran exactamente.
6. Probar limpieza de `localStorage`: la app inicia con valores por defecto sin romper.

### Componentes shadcn involucrados

- `toast` (avisos de error de persistencia, ya instalado).

### Definition of Done

- Todo el estado persiste en `localStorage` y se rehidrata al iniciar.
- Recargar la página no pierde fotos, páginas, orden ni estilos.
- Errores de almacenamiento se manejan sin romper la app.

---

## T1-11 — Verificación funcional end-to-end de todos los flujos

**Objetivo:** validar que los 11 flujos definidos en `general-user-flow.md` funcionan de principio a fin.

### Subtareas

1. Ejecutar prueba manual de cada flujo desde `general-user-flow.md`.
2. Verificar persistencia: recargar página y confirmar que el estado se restaura (fotos, páginas, orden, estilos).
3. Prueba de viewport: cambiar tamaño de ventana y confirmar pantalla de error en pantallas pequeñas.
4. Prueba del límite de 6 fotos: intentar subir más y confirmar bloqueo / aviso de interfaz.
5. Probar reordenar, eliminar y seleccionar páginas desde el modal.
6. Probar personalización de fondo estático y color, y confirmar persistencia al recargar.
7. Probar el splash: atraviesa los 3 estados antes de activar la plataforma.
8. Documentar resultados: aprobado, fallido o pendiente por flujo.

### Componentes shadcn involucrados

- Ninguno nuevo (todos los ya instalados en tareas anteriores).

### Definition of Done

- Cada flujo de `general-user-flow.md` tiene un resultado registrado (aprobado / fallido / pendiente).
- Criterios de aceptación del archivo original cumplidos:
  - Viewport guard bloquea en pantallas pequeñas.
  - Splash atraviesa los 3 estados.
  - Hasta 6 fotos en grid tipo Pinterest.
  - Páginas reordenables, eliminables y seleccionables.
  - Fondo y color personalizados y persistentes.
  - Estado sobrevive al recargar.

---

## Próximo paso sugerido

Revisar este desglose y confirmar:

- ¿Las suposiciones técnicas (Next.js, Tailwind, shadcn/ui, Zustand, localStorage) encajan con lo que querés?
- ¿Alguna tarea necesita más o menos detalle antes de implementar?

Una vez aprobado, podríamos pasar a implementar comenzando por **T1-01 (scaffold)**.
