# Seguimiento de Recibo

App web para las conferencias de recibo del CEDI: planillas por día, artículos, auditor, fotos de evidencia, impresión en PDF y Excel, tablero y enlaces de Drive para el equipo.

Este repositorio tiene **todo** lo que necesita para funcionar en cualquier dirección web.

## Qué hay aquí

| Carpeta / archivo | Qué es |
|---|---|
| `index.html` | La app completa (una sola página). |
| `entorno.js` | La conexión con la nube del equipo, el puente de Drive y la tarjeta "Nube del equipo" en Ajustes. |
| `nube/supabase/functions/recibo/index.ts` | La función de la nube en Supabase (guarda planillas, artículos, ajustes y fotos; códigos de equipo y personas invitadas). |
| `nube/supabase/esquema.sql` | Las 3 tablas de la nube (`recibo_docs`, `recibo_equipo`, `recibo_miembros`). |
| `nube/supabase/exportar-datos.sql` | Consultas para sacar los datos desde el panel de Supabase. |
| `nube/google/` | Nube alternativa en Google (hoja de cálculo + Apps Script), sin cuotas de salida. Tiene su propio paso a paso. |
| `nube/puente-drive/Codigo.gs` | Puente de Google Drive (Apps Script) para las fotos, los informes y el archivo maestro. |
| `.github/workflows/publicar.yml` | Publica la página en GitHub Pages en cada cambio. |

La página solo usa librerías públicas (cdnjs y Google Fonts): no depende de ningún otro archivo.

## Migrar a otra dirección (URL)

### Antes de cambiar: sube todo a la nube

Los datos que cada celular guarda en su navegador **pertenecen a la dirección vieja** y no pasan solos a la nueva. Antes de mover:

1. En cada equipo, abre la app en la dirección vieja con internet y espera a que diga que está al día (la app sube las planillas que solo existen en ese equipo).
2. Luis revisa en el Tablero que estén las planillas de todos.

### 1. Publicar la página

Elige una opción:

- **GitHub Pages (recomendado):** crea un repositorio nuevo, sube estos archivos y en *Settings → Pages → Source* elige **GitHub Actions**. Queda en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.
- **Netlify o Cloudflare Pages:** arrastra la carpeta (o conecta el repositorio). No necesita compilar nada.
- **Cualquier hosting:** sube `index.html` y `entorno.js` a la misma carpeta.

### 2. Escoger la nube

| Opción | Qué cambias | Cuándo |
|---|---|---|
| **A. Seguir con la nube actual** | Nada. La función acepta cualquier dirección. | Si solo cambia la URL de la página. |
| **B. Supabase nuevo** | `esquema.sql` + la función + 2 líneas de `entorno.js`. | Si quieres un proyecto propio. |
| **C. Google (hoja + Apps Script)** | Sigue `nube/google/LEEME-nube-google.md` y pon la dirección `.../exec` en `NUBE_GOOGLE`. | Para no depender de las cuotas de Supabase. |

**Opción B, paso a paso:**

1. Crea el proyecto en Supabase.
2. *SQL Editor* → pega `nube/supabase/esquema.sql` → *Run*.
3. Crea la función: *Edge Functions → Deploy a new function → Via Editor*, nómbrala **`recibo`**, pega `index.ts` y **desactiva "Verify JWT"** (la función valida el acceso ella misma).
4. *Authentication → Users → Add user*: crea la cuenta de Luis. **El primer usuario creado es el dueño** (el que puede crear códigos e invitar).
5. En `entorno.js` cambia:
   ```js
   const NUBE = {
     url: 'https://TU-PROYECTO.supabase.co',
     llave: 'TU-LLAVE-PUBLICABLE',   // Settings → API Keys → Publishable key
   };
   ```
6. Si traes datos: exporta con `exportar-datos.sql` en el proyecto viejo e impórtalos en las mismas tablas del nuevo.

### 3. Drive

- La dirección del puente de Drive se guarda **en la nube** (`config/puente`), así que si conservas la nube no hay que tocar nada.
- Si cambias de nube, en `nube/puente-drive/Codigo.gs` actualiza `FUNCION` y `LLAVE` con los del proyecto nuevo, vuelve a publicarlo (*Implementar → Gestionar implementaciones → Editar → Versión nueva*) y pon la dirección en Ajustes de la app.
- La carpeta de Drive es la misma: `Seguimiento de Recibo` (`1FXRhzXK_yKPMdR3s_E5ScwQgDdN89YL0`).

### 4. Conectar al equipo en la dirección nueva

1. Luis abre la dirección nueva e inicia sesión en *Ajustes → Nube del equipo*.
2. Desde ahí crea los enlaces de invitación (`…/#equipo=XXXXX-XXXXX`) y los manda por WhatsApp.
3. Cada persona abre su enlace una vez y queda conectada. Las planillas bajan solas de la nube.

### 5. Probar

1. Crea una planilla de prueba en un celular y mira que aparezca en otro en menos de 30 segundos.
2. Toma una foto y revisa que llegue a Drive.
3. Imprime una planilla y descarga el Excel.
4. Borra la planilla de prueba.

## Seguridad

- La página no lleva claves secretas: la llave de `entorno.js` es pública (publicable) y las tablas están cerradas; solo la función entra.
- Los códigos de equipo y de cada persona se guardan como hash; Luis puede quitar a cualquiera.
- Ningún dato del equipo se queda en este repositorio.
