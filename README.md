# Una huella que sigue

**La vida, el compromiso y el legado de Claudio «Pocho» Lepratti**

Landing page narrativa, educativa y responsive, realizada como proyecto escolar por la
**divisional 5.º B de la Escuela N.º 15 Claudio Lepratti**.

---

## Qué es

Una experiencia web editorial de ocho secciones que recorre la biografía de Claudio Hugo
Lepratti (Concepción del Uruguay, 27 de febrero de 1966 — Rosario, 19 de diciembre de 2001)
con criterio histórico: cada dato está verificado, las fuentes están enlazadas al final y los
hechos documentados se separan explícitamente de las interpretaciones.

**Secciones, en orden:**

1. Portada
2. Nacimiento e infancia
3. Educación primaria y secundaria
4. Formación terciaria y universitaria
5. Obras solidarias y compromiso social
6. Su muerte (19 de diciembre de 2001)
7. Su legado: una huella que sigue
8. Fuentes y créditos

---

## Tecnologías

| Área | Elección |
|---|---|
| Estructura | HTML5 semántico (`section`, `nav`, `figure`, `blockquote`, `footer`) |
| Estilos | CSS moderno: custom properties, grid, clamp(), media queries |
| Comportamiento | JavaScript sin dependencias (IIFE clásica, sin módulos ES) |
| Tipografías | Playfair Display, Source Serif 4 e Inter (Google Fonts, licencia OFL) |
| Imágenes | Fotografías de Wikimedia Commons bajo CC BY-SA 4.0 + gráficos originales |
| Implantación | Sitio estático, sin backend ni base de datos |

No hay framework ni paso de compilación: el repositorio **es** el sitio. Esto reduce el
tiempo de carga, elimina dependencias y hace que el despliegue en Vercel sea de
configuración cero.

---

## Ejecutar en local

No requiere instalación. Cualquier servidor estático sirve:

```bash
# con Python
python -m http.server 8080

# o con Node
npx serve .
```

También se puede abrir `index.html` directamente en el navegador: el sitio no usa
`fetch()` ni módulos ES, así que funciona igual bajo `file://`.

---

## Estructura

```
.
├── index.html              # Las ocho secciones
├── assets/
│   ├── css/styles.css      # Sistema de diseño + componentes + responsive
│   ├── js/main.js          # Menú, progreso, reveals, navegación activa
│   └── img/favicon.svg     # Favicon vectorial original
├── README.md
└── .gitignore
```

---

## Criterios de accesibilidad y rendimiento

- HTML semántico y orden de encabezados correcto.
- Navegación por teclado con *skip link* y foco visible.
- `alt` descriptivo en todas las imágenes.
- Menú móvil con `aria-expanded`, cierre con `Escape` y bloqueo del scroll.
- Barra de progreso de lectura y botón de «volver al principio».
- Respeta `prefers-reduced-motion`: sin animaciones ni desplazamiento suave para quien lo pida.
- `loading="lazy"` y `decoding="async"` en todas las imágenes de contenido; la de portada usa `fetchpriority="high"`.
- Sin desplazamiento horizontal en ningún ancho de pantalla.
- Diseño adaptable a escritorio, notebook, tablet y celular.

---

## Imágenes y derechos

No existe ninguna fotografía libre de Pocho Lepratti. Para no infringir derechos de autor ni
presentar ilustraciones como documentos históricos, la página usa cuatro fotografías de
murales y esténciles con licencia libre (CC BY-SA 4.0, con atribución en la sección 8) y
gráficos originales creados para el proyecto.

---

## Producción

**URL de Vercel:** _se completa al publicar._

---

## Autoría

Creación y realización: **5.º B — Escuela N.º 15 Claudio Lepratti**

Integrantes: Gian Emanuel Cabrera · Giuliana Carotta · Miriam Casenaves · Luna Jeanne
Churrarín · Ana Pilar Dimier Gomez · Kiara Lucía Echeverría · Valentina Schaiel Gomez ·
Milagros Abigail Gutiérrez · Kevin Machado · Juan Gabriel Monzalvo · Santino Morel ·
Valentina Mariana Nicholson · Oriana Anabela Rodríguez · Melanie Z. Sanabria Silveira ·
Catalina Iris Santa Cruz · Tatiana Cristina Valdez · Zahira Valentina Velázquez
