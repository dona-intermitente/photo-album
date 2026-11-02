# Arquitectura y Flujos de Programación — Celebrando la Vida y los Recuerdos

Este documento detalla la lógica de estados, control de pantalla y flujo de interacción de la aplicación web tipo *scrapbook* / álbum digital interactivo, documentada a partir de las pantallas del sistema.

---

## 1. Flujo de Inicialización y Control de Pantalla (Viewport Guard)

Controla que el dispositivo cumpla con los requisitos mínimos de resolución antes de inicializar la plataforma.

```text
[Inicio / Montaje de la App]
         │
         ▼
[Listener / Detección de Viewport (resize / orientation)]
         │
         ▼
¿Ancho de pantalla >= Mínimo requerido (Desktop / Tablet horizontal)?
   │
   ├── [NO] ────────────────────────────────────────────────────────┐
   │                                                                ▼
   │                                                    [Renderizar Pantalla de Error]
   │                                                    ├── Mensaje: "Lo sentimos mucho..."
   │                                                    ├── Botón: "Repositorio" ──► GitHub
   │                                                    └── Botón: "Más proyectos" ──► Behance
   │                                                                │
   │                                            (Espera evento 'resize' válido)
   │                                                                ▲
   └── [SÍ] ────────────────────────────────────────────────────────┘
         │
         ▼
[Iniciar Secuencia de Carga (Splash Screen)]
```

---

## 2. Flujo de Estados de Carga (Loading Sequence)

Secuencia progresiva de bienvenida y precarga de recursos (imágenes, fuentes y configuración).

```text
               [Splash Screen Activado]
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│  Estado 1: Inicio                                            │
│  • Icono: Fiesta / Matasuegras                               │
│  • Texto: "Celebrando la vida"                               │
└─────────────────────────┬────────────────────────────────────┘
                          │ (Transición / Timer / Asset Loaded)
                          ▼
┌──────────────────────────────────────────────────────────────┐
│  Estado 2: Procesamiento                                     │
│  • Icono: Cámara fotográfica                                 │
│  • Texto: "Capturando momentos"                              │
└─────────────────────────┬────────────────────────────────────┘
                          │ (Transición / Timer / Asset Loaded)
                          ▼
┌──────────────────────────────────────────────────────────────┐
│  Estado 3: Finalización                                      │
│  • Icono: Álbum con corazón                                  │
│  • Texto: "Guardar recuerdos"                                │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
         ¿Recursos y datos locales listos?
                          │
                         SÍ
                          ▼
          [Desmontar Splash Screen]
                          │
                          ▼
     [Inicializar Plataforma Principal (Canvas)]
```

---

## 3. Arquitectura de la Plataforma Principal

Estructura modular de la vista de trabajo del álbum.

```text
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                 PLATAFORMA PRINCIPAL                                     │
└───────────────────────────────────────────┬──────────────────────────────────────────────┘
                                            │
    ┌───────────────────────┬───────────────┴───────────────┬──────────────────────────────┐
    ▼                       ▼                               ▼                              ▼
[Sidebar Lateral]   [Barra Superior]               [Área de Trabajo]               [Pie de Página]
    │                       │                               │                              │
    ├─► Logo Álbum          └─► Navegación:                 ├─► Cuaderno con espirales     └─► Autor:
    │                           • [←] Página anterior       ├─► Cuadrícula de puntos           "Dona_intermitente"
    ├─► [Gestor Páginas]        • [+] Añadir / Siguiente    ├─► Marco de foto con cinta        (GitHub / Behance)
    │                                                       ├─► Botón Subir Foto
    ├─► [Estilos Globales]                                  └─► Botón Eliminar Foto (🗑 roja)
    │
    └─► [Exportar Álbum]
```

---

## 4. Flujo del Modal de Gestión de Páginas (`pages.png`)

Administración de hojas dentro del álbum digital.

```text
[Click en icono 'Páginas' del Sidebar]
                  │
                  ▼
         [Abrir Modal Flotante]
                  │
                  ├──► Renderizar listado ordenado de páginas creadas:
                  │    ├── Ítem 1 (Página 1) ──► Botón [Eliminar 🗑]
                  │    ├── Ítem 2 (Página 2) ──► Botón [Eliminar 🗑]
                  │    └── Ítem N (Página N) ──► Botón [Eliminar 🗑]
                  │
                  ├──► Eventos de Usuario:
                  │    ├── [Reordenar / Drag & Drop]: Actualiza índice del arreglo de páginas
                  │    ├── [Seleccionar Página]: Cambia página activa en el lienzo principal
                  │    ├── [Click en Papelera 🗑]: Elimina la página y actualiza navegación
                  │    └── [Click fuera / Cerrar]: Cierra modal y conserva estado
                  │
                  ▼
     [Persistir estado en almacenamiento local]
```

---

## 5. Flujo del Modal de Estilos Globales (`styles-globals.png`)

Personalización del entorno visual del cuaderno y lienzo.

```text
[Click en icono 'Paleta' del Sidebar]
                  │
                  ▼
         [Abrir Modal de Configuración]
                  │
                  ├──► [Control Switch: "Automático"]
                  │         │
                  │         ├── ON  ──► Aplica paleta dinámica según tema o imagen cargada
                  │         └── OFF ──► Habilita selector manual de color
                  │
                  └──► [Selector: "Fondo"]
                            │
                            ▼
               [Paleta de colores / Picker]
                            │
                            ▼
        [Aplicar variables CSS / Fondo del lienzo]
                            │
                            ▼
         [Persistir preferencias en LocalStorage]
```

---

## 6. Máquina de Estados Global de la Aplicación

```text
                  ┌──────────────────────┐
                  │    INICIALIZANDO     │
                  └──────────┬───────────┘
                             │
            ┌────────────────┴────────────────┐
   (Viewport < Min)                  (Viewport >= Min)
            │                                 │
            ▼                                 ▼
┌──────────────────────┐           ┌──────────────────────┐
│     PANTALLA ERROR   │           │   SECUENCIA CARGA    │
│  (Bloqueo temporal)  │           │   (Splash 1, 2, 3)   │
└──────────┬───────────┘           └──────────┬───────────┘
           │ (Resize OK)                      │ (Completado)
           └────────────────► ┌───────────────┴───────────────┐
                              ▼
                  ┌──────────────────────┐
                  │  PLATAFORMA ACTIVA   │
                  │   (Edición Álbum)    │
                  └──────────┬───────────┘
                             │
     ┌───────────────────────┼───────────────────────┐
     ▼                       ▼                       ▼
[Modal Páginas]      [Modal Estilos]         [Acción Exportar]
```
