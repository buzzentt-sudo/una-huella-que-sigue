# Una huella que sigue

**La vida, el compromiso y el legado de Claudio «Pocho» Lepratti**

Landing page documental, educativa y responsive, realizada como proyecto escolar por la
**divisional 5.º B de la Escuela N.º 15 Claudio Lepratti**.

---

## Qué es

Un documental digital de nueve secciones que recorre la biografía de Claudio Hugo
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
8. Fuentes históricas
9. Créditos de 5.º B

---

## Dirección visual

Editorial contemporáneo, sin estética de libro: fondo marfil, azul profundo como color
principal, terracota como acento y texto grafito. Tipografías **Fraunces** (títulos) e
**Inter** (texto), generosos espacios entre secciones, fotografías grandes e integradas y
composiciones alternadas para dar ritmo.

---

## Tecnologías

| Área | Elección |
|---|---|
| Estructura | HTML5 semántico (`section`, `nav`, `figure`, `blockquote`, `footer`) |
| Estilos | CSS moderno: custom properties, grid, clamp(), media queries |
| Comportamiento | JavaScript sin dependencias (IIFE clásica, sin módulos ES) |
| Tipografías | Fraunces e Inter (Google Fonts, licencia OFL) |
| Imágenes | Trece fotografías (ocho de Wikimedia Commons bajo CC BY-SA 4.0 y 3.0, cinco cedidas por la escuela) + gráficos originales |
| Implantación | Sitio estático, sin backend ni base de datos |

No hay framework ni paso de compilación: el repositorio **es** el sitio. Esto reduce el
tiempo de carga, elimina dependencias y hace que el despliegue en Vercel sea de
configuración cero.

---

## Animaciones

- Entrada escalonada de la portada.
- Aparición de secciones al entrar en el área visible (IntersectionObserver).
- Desplazamiento parcial de las fotografías grandes al hacer scroll.
- Barra de progreso de lectura y cabecera que se solidifica al desplazar.
- Línea de cronología que se dibuja según el avance de lectura.
- Galería de memoria con transición entre fotografías, miniaturas y teclado.
- Navegación suave con desplazamiento compensado y sección activa resaltada.

Todas se desactivan con `prefers-reduced-motion: reduce`.

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
├── index.html    # Las nueve secciones
├── styles.css    # Sistema de diseño + componentes + responsive
├── main.js       # Menú, progreso, reveals, parallax, galería
├── favicon.svg   # Favicon vectorial original
├── sitemap.xml   # Mapa del sitio (una sola URL)
├── robots.txt    # Permisos de indexación + referencia al sitemap
├── README.md
└── .gitignore
```

> Nota: la carpeta `assets/` (donde vivían CSS, JS y favicon en la versión anterior)
> quedó localmente con archivos marcadores sin uso. El sitio carga **todo desde la raíz**;
> en el repositorio esa carpeta ya no existe.

---

## Criterios de accesibilidad y rendimiento

- HTML semántico y orden de encabezados correcto.
- Navegación por teclado con *skip link* y foco visible.
- `alt` descriptivo en todas las imágenes; las de contexto están declaradas como tales.
- Menú móvil con `aria-expanded`, cierre con `Escape` y bloqueo del scroll.
- Galería con `aria-live` en el pie de foto y controles con nombre accesible.
- Barra de progreso de lectura y botón de «volver al principio».
- Respeta `prefers-reduced-motion`: sin animaciones ni desplazamiento suave para quien lo pida.
- `loading="lazy"` y `decoding="async"` en todas las imágenes de contenido; la de portada usa `fetchpriority="high"`.
- Sin desplazamiento horizontal en ningún ancho de pantalla.
- Diseño adaptable a escritorio, tablet y celular.

---

## Imágenes y derechos

No existe ninguna fotografía libre de Pocho Lepratti. Para no infringir derechos de autor ni
presentar ilustraciones como documentos históricos, la página usa **trece fotografías**, con
al menos una en cada sección del relato: ocho con licencia libre (CC BY-SA 4.0 y 3.0, con
atribución en la sección 8) y **cinco cedidas al proyecto** por la Escuela N.º 15 y por sus
autores —la fotografía de Pocho de la portada, su escuela primaria, la Biblioteca Popular
«Pocho Lepratti», la escuela del curso y una foto del alumnado—, más gráficos originales
creados para el proyecto.

---

## Producción

**URL de Vercel:** https://una-huella-que-sigue.vercel.app

**Repositorio:** https://github.com/buzzentt-sudo/una-huella-que-sigue

El despliegue está conectado al repositorio: cada publicación en la rama `main` genera una
nueva versión automática en Vercel.

---

## Autoría

Creación y realización: **5.º B — Escuela N.º 15 Claudio Lepratti**

Integrantes: Gian Emanuel Cabrera · Giuliana Carotta · Miriam Casenaves · Luna Jeanne
Churrarín · Ana Pilar Dimier Gomez · Kiara Lucía Echeverría · Valentina Schaiel Gomez ·
Milagros Abigail Gutiérrez · Kevin Machado · Juan Gabriel Monzalvo · Santino Morel ·
Valentina Mariana Nicholson · Oriana Anabela Rodríguez · Melanie Z. Sanabria Silveira ·
Catalina Iris Santa Cruz · Tatiana Cristina Valdez · Zahira Valentina Velázquez
