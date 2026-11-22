// Agente de Seguimiento de Recibo (solo para Luis).
// Va como un archivo aparte dentro del mismo proyecto del puente de Drive: usa RAIZ, FUNCION y LLAVE de Codigo.gs
// y agrega sus herramientas a HERRAMIENTAS. No cambia nada de lo que ya funciona.
//
// Cerebro: Gemini (capa gratis). La clave la pone Luis en
//   Configuración del proyecto → Propiedades del script → GEMINI_KEY
// (opcional) GEMINI_MODELO = nombre exacto del modelo, si quiere fijar uno.
// Las lecciones que aprende quedan en Drive: "Seguimiento de Recibo/Agente - lecciones (no borrar).json".
// Los procesos que resuelve o que Luis le enseña: "Seguimiento de Recibo/Agente - procesos (no borrar).json".
// Su biblioteca de conocimiento: carpeta "Seguimiento de Recibo/Agente - biblioteca (no borrar)" con archivos .md
// (la primera línea "claves: a, b, c" dice cuándo usar cada uno). Para enseñarle un tema nuevo basta subir otro .md ahí.

const AG_ARCHIVO = 'Agente - lecciones (no borrar).json';
const AG_PROCESOS = 'Agente - procesos (no borrar).json';
const AG_BIBLIO = 'Agente - biblioteca (no borrar)';
const AG_TOPE_BIBLIO = 30000; // caracteres de biblioteca por pregunta
const AG_REPO_BIBLIO = 'https://raw.githubusercontent.com/penarandam273/seguimiento-recibo/main/nube/agente-biblioteca/'; // indice.txt = un archivo por línea
const AG_API = 'https://generativelanguage.googleapis.com/v1beta/';
const AG_RESPALDO = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];

const AG_SISTEMA = [
  'Eres THEMENDO Recibo, el agente personal de Luis Alfonso Mendoza Corzo dentro de la app "Seguimiento de Recibo".',
  'Hablas SIEMPRE en español de Colombia, claro, directo y amable. Luis es operador logístico en Jerónimo Martins (CEDI ATS R10 Valledupar), tecnólogo en construcción, proactivo. Explícale paso a paso y sin palabras técnicas innecesarias.',
  'Tus respuestas se pueden leer en voz alta: frases cortas, sin tablas largas ni código salvo que él lo pida. Usa listas cortas cuando ayuden.',
  '',
  'ERES ESPECIALISTA EN:',
  '- Diagnóstico y reparación de la app Seguimiento de Recibo (ver abajo).',
  '- Excel: fórmulas (BUSCARX, SUMAR.SI.CONJUNTO, FILTRAR, ÚNICOS, LET), tablas, tablas dinámicas, formato condicional, validación, Power Query, gráficos, macros VBA, dashboards.',
  '- Redacción: correos formales, informes de novedades, actas, reportes a jefes y proveedores, mensajes de WhatsApp de trabajo. Ortografía impecable.',
  '- Gestión logística: recibo de mercancía, conferencia/auditoría de recibo, cita de proveedores, descargue, verificación de cantidades, lotes y vencimientos (FEFO/FIFO), cadena de frío y temperaturas, averías, faltantes y sobrantes, rechazos y devoluciones a proveedor, reestibado, etiquetado, ubicación, WPMS, indicadores (exactitud, fill rate, OTIF, tiempos de descargue), 5S y seguridad en bodega.',
  '- Programación: HTML, CSS, JavaScript, Google Apps Script, Supabase (Postgres, funciones, RLS, límites del plan gratis), GitHub, GitHub Actions y Pages, Android (APK, WebView, firma), Python básico.',
  '- Google (Drive, Sheets, Gmail, Apps Script, AI Studio), Claude (cómo pedirle cambios), Android y correos.',
  '',
  'LA APP SEGUIMIENTO DE RECIBO:',
  '- Página: https://penarandam273.github.io/seguimiento-recibo/ (repositorio GitHub penarandam273/seguimiento-recibo; se publica sola con GitHub Actions). Archivos: index.html (toda la app) y entorno.js (nube, Drive y descargas).',
  '- App Android: se descarga con el botón "Descargar app"; es la misma página adentro (cámara, galería, descargas a Descargas/Seguimiento de Recibo, funciona sin señal). La compila GitHub Actions (flujo "App Android") con la llave guardada en los secretos LLAVE_APK y CLAVE_LLAVE_APK.',
  '- Pestañas: Registro (planilla del día por auditor; cada conferencia tiene fecha, operador, proveedor, etiqueta, código SAP, descripción, categoría, criterios de verificación, observaciones y fotos de evidencia), Tablero (resumen y novedades), Imprimir (formato físico y PDF/Excel) y Ajustes (encabezado, listas, nube del equipo, Google Drive).',
  '- Nube: Supabase proyecto "THEMENDO-RECIBO-PRO" (rastxqzdilvodkncricw), plan gratis. Función "recibo" y tablas recibo_docs, recibo_equipo, recibo_miembros. Luis entra con su cuenta; los auditores entran con un enlace de invitación o código personal que Luis crea en Ajustes → Nube del equipo.',
  '- Lo que no ha subido se queda guardado en el equipo (celular) y sube solo cuando hay señal. NUNCA se deben borrar los datos del navegador ni desinstalar sin sincronizar.',
  '- Fotos: se comprimen (unos 180 KB, máx. 1280 px) y van a Google Drive por el puente; en la nube solo queda la referencia. Así no se llena el plan gratis de Supabase (el proyecto viejo se bloqueó por exceso de tráfico).',
  '- Puente de Drive: Apps Script "Puente Drive - Seguimiento de Recibo" en la cuenta themendomendoza@gmail.com, dueña de la carpeta "Seguimiento de Recibo". Allí: archivo maestro "Seguimiento de Recibo - Historial completo.xlsx" (dashboard y evidencias por operador en un solo libro), "Planillas (formato físico)" con una carpeta por auditor (Luis Mendoza, Edwin Carrillo, Luis Arregoces) para imprimir, "Fotos" por semana y "Semanas". Si el puente responde "sin_acceso" es que la sesión o el código del equipo no son válidos; si responde error de servidor, se redespliega una versión nueva en Apps Script (Implementar → Gestionar implementaciones → Editar → Versión nueva).',
  '- Errores típicos: "Invalid login credentials" (clave equivocada: se cambia en Supabase), fotos "por subir" (falta puente o señal: sincronizar), planilla sin auditor (falta poner "Auditor de este equipo" en Ajustes), un auditor que no aparece (su celular no ha sincronizado: debe abrir la app con internet y tocar "Sincronizar ahora").',
  '',
  'REGLAS QUE NUNCA ROMPES:',
  '- No borras ni mandas a borrar nada sin que Luis lo autorice explícitamente. Prefiere siempre papelera o copia antes que borrar.',
  '- Nunca pidas, muestres ni repitas contraseñas, claves de API, tokens o llaves. Si hacen falta, dile a Luis dónde ponerlas él mismo.',
  '- No inventes datos: si algo no está en el diagnóstico o en la conversación, dilo y propone cómo comprobarlo.',
  '- Tú no cambias el código de la app. Si hace falta un cambio de código, redacta el pedido exacto para que Luis se lo pase a Claude (en una acción "copiar").',
  '- Fórmulas de Excel para que Luis las escriba en SU Excel (en español): nombres en español y separador punto y coma (=SUMAR.SI.CONJUNTO(D:D;B:B;"Norte")). Las bibliotecas las traen en inglés con coma porque son para VBA (Range.Formula): tradúcelas según para qué sea. En macros VBA: Option Explicit, .Display en vez de .Send para correos, y avisa que se guarde antes (Ctrl+Z no deshace macros).',
  '- Usa primero tu BIBLIOTECA y tus PROCESOS GUARDADOS (abajo) cuando apliquen; si un proceso guardado ya resolvió algo igual, síguelo y dilo.',
  '- Si Luis te enseña algo o te corrige ("aprende que…", "recuerda que…", "no es así, es…"), resúmelo en una frase en el campo "leccion". Si no, deja "leccion" vacío.',
  '',
  '- GUARDAR PROCESOS: cada vez que en tu respuesta guíes a Luis por un procedimiento de 3 o más pasos (arreglar un error, hacer algo en Excel, Drive, la app, un informe, un trámite de recibo), o él te explique cómo se hace algo, llena "proceso" con: "titulo" corto y claro, "claves" (palabras separadas por coma con las que se buscaría) y "pasos" (lista de pasos concretos). Si es la versión mejorada de un proceso guardado, usa exactamente el mismo título para reemplazarlo. Si no hay procedimiento, deja "proceso" vacío.',
  '',
  'ACCIONES: puedes proponer botones que Luis toca para ejecutar. Tipos permitidos:',
  '  sincronizar (subir y bajar cambios de la nube), subir_drive (actualizar Google Drive ahora), subir_locales (subir planillas que solo están en este equipo),',
  '  diagnosticar (volver a revisar todo), recargar (recargar la app), ir (con "tab": registro | tablero | imprimir | ajustes),',
  '  copiar (con "contenido": texto a copiar), abrir (con "url" https de github.com, google.com, supabase.com o aistudio.google.com), descargar_diagnostico.',
  'Propón solo las acciones que sirvan de verdad, con un "texto" corto para el botón.',
  '',
  'Responde SOLO con un objeto JSON: {"respuesta": "...", "acciones": [{"tipo": "...", "texto": "...", "tab": "", "url": "", "contenido": ""}], "leccion": "", "proceso": {"titulo": "", "claves": "", "pasos": []}}',
].join('\n');

// ---------- herramientas nuevas del puente ----------
HERRAMIENTAS.agente_estado = function (i) {
  agSoloLuis(i.token);
  const clave = agClave();
  return { clave: !!clave, modelo: clave ? agModelos(clave)[0] : '', lecciones: agLecciones().length, procesos: agProcesos().length, biblioteca: agBiblioteca().length };
};

HERRAMIENTAS.agente = function (i) {
  agSoloLuis(i.token);
  const clave = agClave();
  if (!clave) return { sinClave: true, respuesta: 'Todavía no tengo cerebro: falta la clave gratis de Gemini en las Propiedades del script del puente (GEMINI_KEY).' };
  const lecciones = agLecciones();
  let sistema = AG_SISTEMA;
  if (lecciones.length) sistema += '\n\nLECCIONES QUE LUIS TE HA ENSEÑADO (síguelas):\n' + lecciones.map((l) => '- ' + l.t).join('\n');
  const msgs = Array.isArray(i.mensajes) ? i.mensajes : [];
  const pregunta = msgs.filter((m) => m.r !== 'm').slice(-3).map((m) => String(m.t || '')).join(' ');
  const docs = agBiblioteca();
  if (docs.length) {
    sistema += '\n\nTU BIBLIOTECA (temas disponibles): ' + docs.map((d) => d.nombre).join(' · ');
    const elegidos = agElegir(pregunta, docs, (d) => d.claves.concat([d.nombre]));
    let usado = 0;
    for (const d of elegidos) {
      if (usado + d.texto.length > AG_TOPE_BIBLIO) continue;
      sistema += '\n\n=== BIBLIOTECA: ' + d.nombre + ' ===\n' + d.texto;
      usado += d.texto.length;
    }
  }
  const procs = agElegir(pregunta, agProcesos(), (p) => p.claves.concat(String(p.titulo).split(/\s+/))).slice(0, 6);
  if (procs.length) sistema += '\n\nPROCESOS QUE YA GUARDASTE Y SIRVEN AQUÍ:\n' + procs.map((p) => '## ' + p.titulo + ' (' + p.f + ')\n' + p.pasos.map((x, n) => (n + 1) + '. ' + x).join('\n')).join('\n\n');
  if (i.contexto) sistema += '\n\nDIAGNÓSTICO ACTUAL DE LA APP EN EL EQUIPO DE LUIS (' + new Date().toISOString() + '):\n' + String(JSON.stringify(i.contexto)).slice(0, 12000);
  const contents = msgs.slice(-20)
    .map((m) => ({ role: m.r === 'm' ? 'model' : 'user', parts: [{ text: String(m.t || '').slice(0, 6000) }] }))
    .filter((m) => m.parts[0].text);
  if (!contents.length || contents[contents.length - 1].role !== 'user') throw new Error('Falta la pregunta');
  const web = !!i.web;
  const cuerpo = {
    systemInstruction: { parts: [{ text: sistema }] },
    contents,
    generationConfig: { temperature: 0.5, maxOutputTokens: 8192 },
  };
  if (web) cuerpo.tools = [{ google_search: {} }];
  else {
    cuerpo.generationConfig.responseMimeType = 'application/json';
    cuerpo.generationConfig.responseSchema = {
      type: 'OBJECT',
      properties: {
        respuesta: { type: 'STRING' },
        acciones: { type: 'ARRAY', items: { type: 'OBJECT', properties: {
          tipo: { type: 'STRING' }, texto: { type: 'STRING' }, tab: { type: 'STRING' }, url: { type: 'STRING' }, contenido: { type: 'STRING' } }, required: ['tipo', 'texto'] } },
        leccion: { type: 'STRING' },
        proceso: { type: 'OBJECT', properties: { titulo: { type: 'STRING' }, claves: { type: 'STRING' }, pasos: { type: 'ARRAY', items: { type: 'STRING' } } } },
      },
      required: ['respuesta'],
    };
  }
  let ultimo = '';
  for (const modelo of agModelos(clave)) {
    const r = UrlFetchApp.fetch(AG_API + 'models/' + encodeURIComponent(modelo) + ':generateContent', {
      method: 'post', contentType: 'application/json', headers: { 'x-goog-api-key': clave },
      payload: JSON.stringify(cuerpo), muteHttpExceptions: true,
    });
    const codigo = r.getResponseCode();
    if (codigo === 404 || codigo === 429 || codigo >= 500) { ultimo = codigo === 429 ? 'cupo' : 'modelo ' + modelo + ' (' + codigo + ')'; continue; }
    let d = {};
    try { d = JSON.parse(r.getContentText()); } catch (x) { /* respuesta rara */ }
    if (codigo !== 200) throw new Error('Gemini respondió ' + codigo + ': ' + String((d.error && d.error.message) || '').slice(0, 200));
    const cand = (d.candidates || [])[0] || {};
    const texto = ((cand.content && cand.content.parts) || []).map((p) => p.text || '').join('').trim();
    const out = agLeer(texto);
    out.modelo = modelo;
    const g = cand.groundingMetadata;
    if (g && g.groundingChunks) out.fuentes = g.groundingChunks.map((c) => c.web).filter(Boolean).slice(0, 6).map((w) => ({ t: w.title || w.uri, u: w.uri }));
    const lec = String(out.leccion || '').trim();
    if (lec) { agGuardar(agLecciones().concat([{ id: Utilities.getUuid().slice(0, 8), t: lec.slice(0, 400), f: new Date().toISOString().slice(0, 10) }])); out.aprendida = lec; }
    const pr = out.proceso;
    if (pr && String(pr.titulo || '').trim() && Array.isArray(pr.pasos) && pr.pasos.filter(Boolean).length >= 2) {
      out.procesoGuardado = agGuardarProceso(pr).titulo;
    }
    delete out.proceso;
    return out;
  }
  if (ultimo === 'cupo') return { respuesta: 'Se acabó por ahora el cupo gratis de Gemini. Espera un minuto (o hasta mañana si es el cupo del día) y vuelve a preguntar.', acciones: [], cupo: true };
  throw new Error('Gemini no respondió (' + ultimo + ')');
};

HERRAMIENTAS.agente_lecciones = function (i) { agSoloLuis(i.token); return { lecciones: agLecciones() }; };

HERRAMIENTAS.agente_leccion = function (i) {
  agSoloLuis(i.token);
  const t = String(i.texto || '').trim();
  if (!t) throw new Error('Lección vacía');
  const l = { id: Utilities.getUuid().slice(0, 8), t: t.slice(0, 400), f: new Date().toISOString().slice(0, 10) };
  agGuardar(agLecciones().concat([l]));
  return { ok: true, leccion: l };
};

// Solo cuando Luis toca "Olvidar" en una lección y lo confirma.
HERRAMIENTAS.agente_olvidar = function (i) {
  agSoloLuis(i.token);
  const antes = agLecciones();
  const despues = antes.filter((l) => l.id !== String(i.id || ''));
  if (despues.length !== antes.length) agGuardar(despues);
  return { ok: true, lecciones: despues };
};

// Revisión de la carpeta de Drive para el diagnóstico (solo lectura).
HERRAMIENTAS.agente_drive = function (i) {
  agSoloLuis(i.token);
  const raiz = DriveApp.getFolderById(RAIZ);
  const out = { carpeta: raiz.getName(), maestro: null, auditores: [], fotos: { semanas: 0, archivos: 0 } };
  const arch = raiz.getFiles();
  while (arch.hasNext()) {
    const a = arch.next();
    if (/Historial completo/i.test(a.getName())) out.maestro = { nombre: a.getName(), actualizado: a.getLastUpdated().toISOString(), kb: Math.round(a.getSize() / 1024) };
  }
  const subs = raiz.getFolders();
  while (subs.hasNext()) {
    const s = subs.next(), n = s.getName();
    if (/^Planillas/i.test(n)) {
      const aud = s.getFolders();
      while (aud.hasNext()) {
        const c = aud.next(); let cuantas = 0, ultima = 0;
        const fs = c.getFiles();
        while (fs.hasNext()) { const f = fs.next(); cuantas++; ultima = Math.max(ultima, f.getLastUpdated().getTime()); }
        out.auditores.push({ nombre: c.getName(), planillas: cuantas, ultima: ultima ? new Date(ultima).toISOString() : '' });
      }
    } else if (n === CARPETA_FOTOS) {
      const sem = s.getFolders();
      while (sem.hasNext()) {
        const c = sem.next(); out.fotos.semanas++;
        const fs = c.getFiles(); while (fs.hasNext()) { fs.next(); out.fotos.archivos++; }
      }
    }
  }
  return out;
};

// Procesos guardados (los que el agente resolvió o Luis le enseñó).
HERRAMIENTAS.agente_procesos = function (i) { agSoloLuis(i.token); return { procesos: agProcesos() }; };

HERRAMIENTAS.agente_proceso_guardar = function (i) {
  agSoloLuis(i.token);
  const pasos = (Array.isArray(i.pasos) ? i.pasos : String(i.pasos || '').split('\n')).map((x) => String(x).trim()).filter(Boolean);
  if (!String(i.titulo || '').trim() || !pasos.length) throw new Error('Falta el título o los pasos');
  return { ok: true, proceso: agGuardarProceso({ titulo: i.titulo, claves: i.claves, pasos }) };
};

// Solo cuando Luis toca "Olvidar" en un proceso y lo confirma.
HERRAMIENTAS.agente_olvidar_proceso = function (i) {
  agSoloLuis(i.token);
  const antes = agProcesos();
  const despues = antes.filter((p) => p.id !== String(i.id || ''));
  if (despues.length !== antes.length) agEscribirJson(AG_PROCESOS, despues);
  return { ok: true, procesos: despues };
};

// Biblioteca: lista de temas y subir uno nuevo (si ya existe, la versión anterior se guarda en "anteriores").
HERRAMIENTAS.agente_biblioteca = function (i) {
  agSoloLuis(i.token);
  return { carpeta: agCarpetaBiblio().getUrl(), temas: agBiblioteca().map((d) => ({ nombre: d.nombre, claves: d.claves.slice(0, 12), kb: Math.round(d.texto.length / 1024 * 10) / 10 })) };
};

// Trae del repositorio las bibliotecas nuevas o cambiadas (las versiones viejas van a "anteriores", nada se borra).
HERRAMIENTAS.agente_biblioteca_actualizar = function (i) {
  agSoloLuis(i.token);
  return agImportarRepo();
};

HERRAMIENTAS.agente_biblioteca_guardar = function (i) {
  agSoloLuis(i.token);
  let nombre = String(i.nombre || '').replace(/[\\/:*?"<>|]+/g, ' ').trim().slice(0, 80);
  const texto = String(i.texto || '');
  if (!nombre || !texto.trim()) throw new Error('Falta el nombre o el texto');
  if (texto.length > 200000) throw new Error('El documento es muy grande (máximo 200 mil caracteres)');
  if (!/\.(md|txt)$/i.test(nombre)) nombre += '.md';
  agGuardarDoc(nombre, texto);
  return { ok: true, nombre };
};

// ---------- ayudantes ----------
function agSoloLuis(token) {
  token = String(token || '');
  if (!token) throw new Error('solo_luis: el agente es solo para Luis');
  const clave = 'L|' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token));
  const cache = CacheService.getScriptCache();
  if (cache.get(clave) === '1') return;
  const r = UrlFetchApp.fetch(FUNCION, { method: 'post', contentType: 'application/json', headers: { apikey: LLAVE, Authorization: 'Bearer ' + token }, payload: JSON.stringify({ accion: 'estado' }), muteHttpExceptions: true });
  let d = {};
  try { d = JSON.parse(r.getContentText()); } catch (x) { /* respuesta rara */ }
  if (!d.luis) throw new Error('solo_luis: el agente es solo para Luis');
  cache.put(clave, '1', 600);
}

function agClave() { return String(PropertiesService.getScriptProperties().getProperty('GEMINI_KEY') || '').trim(); }

// El modelo "Flash" más nuevo que la clave puede usar (se revisa cada 6 horas), y respaldos por si uno falla o se acaba su cupo.
function agModelos(clave) {
  const fijo = String(PropertiesService.getScriptProperties().getProperty('GEMINI_MODELO') || '').trim();
  const cache = CacheService.getScriptCache();
  let lista = [];
  const guardada = cache.get('ag_modelos');
  if (guardada) { try { lista = JSON.parse(guardada); } catch (x) { lista = []; } }
  if (!lista.length) {
    try {
      const r = UrlFetchApp.fetch(AG_API + 'models?pageSize=200', { headers: { 'x-goog-api-key': clave }, muteHttpExceptions: true });
      const d = JSON.parse(r.getContentText() || '{}');
      const ver = (n) => { const m = n.match(/gemini-(\d+(?:\.\d+)?)/); return m ? parseFloat(m[1]) : 0; };
      const flash = (d.models || [])
        .filter((m) => (m.supportedGenerationMethods || []).indexOf('generateContent') >= 0)
        .map((m) => String(m.name || '').replace(/^models\//, ''))
        .filter((n) => /^gemini-[\d.]+-flash/.test(n) && !/image|tts|audio|live|embed|exp|thinking|robotics|computer/.test(n));
      const orden = (a, b) => (ver(b) - ver(a)) || ((/preview/.test(a) ? 1 : 0) - (/preview/.test(b) ? 1 : 0)) || ((/lite/.test(a) ? 1 : 0) - (/lite/.test(b) ? 1 : 0)) || (a.length - b.length);
      const normales = flash.filter((n) => !/lite/.test(n)).sort(orden);
      const livianos = flash.filter((n) => /lite/.test(n)).sort(orden);
      lista = normales.slice(0, 3).concat(livianos.slice(0, 1));
      if (lista.length) cache.put('ag_modelos', JSON.stringify(lista), 21600);
    } catch (x) { lista = []; }
  }
  if (!lista.length) lista = AG_RESPALDO.slice();
  if (fijo) lista = [fijo].concat(lista.filter((n) => n !== fijo));
  return lista;
}

function agLeer(texto) {
  let o = null;
  try { o = JSON.parse(texto); } catch (x) {
    const m = texto.match(/\{[\s\S]*\}/);
    if (m) { try { o = JSON.parse(m[0]); } catch (y) { o = null; } }
  }
  if (!o || typeof o !== 'object' || typeof o.respuesta !== 'string') o = { respuesta: texto || 'No entendí la respuesta de Gemini. Pregúntame otra vez.', acciones: [] };
  if (!Array.isArray(o.acciones)) o.acciones = [];
  o.acciones = o.acciones.slice(0, 6);
  return o;
}

function agArchivo() {
  const raiz = DriveApp.getFolderById(RAIZ);
  const it = raiz.getFilesByName(AG_ARCHIVO);
  return it.hasNext() ? it.next() : null;
}
function agLecciones() {
  const a = agArchivo();
  if (!a) return [];
  try { const l = JSON.parse(a.getBlob().getDataAsString('UTF-8')); return Array.isArray(l) ? l : []; } catch (x) { return []; }
}
function agGuardar(lista) {
  const txt = JSON.stringify(lista.slice(-200), null, 1);
  const a = agArchivo();
  if (a) a.setContent(txt);
  else DriveApp.getFolderById(RAIZ).createFile(AG_ARCHIVO, txt, 'application/json');
}

// ---------- biblioteca y procesos ----------
function agCarpetaBiblio() {
  const raiz = DriveApp.getFolderById(RAIZ);
  const it = raiz.getFoldersByName(AG_BIBLIO);
  return it.hasNext() ? it.next() : raiz.createFolder(AG_BIBLIO);
}

// Guarda un documento en la biblioteca; si ya había uno con ese nombre y es distinto, el viejo pasa a "anteriores".
function agGuardarDoc(nombre, texto) {
  const carpeta = agCarpetaBiblio();
  const viejos = carpeta.getFilesByName(nombre);
  if (viejos.hasNext()) {
    const v = viejos.next();
    if (v.getBlob().getDataAsString('UTF-8') === texto) return 'igual';
    const it = carpeta.getFoldersByName('anteriores');
    const ant = it.hasNext() ? it.next() : carpeta.createFolder('anteriores');
    v.moveTo(ant);
    v.setName(nombre.replace(/(\.\w+)$/, ' (' + new Date().toISOString().slice(0, 10) + ')$1'));
    carpeta.createFile(nombre, texto, 'text/markdown');
    CacheService.getScriptCache().remove('ag_bib');
    return 'actualizada';
  }
  carpeta.createFile(nombre, texto, 'text/markdown');
  CacheService.getScriptCache().remove('ag_bib');
  return 'nueva';
}

function agImportarRepo() {
  const r = UrlFetchApp.fetch(AG_REPO_BIBLIO + 'indice.txt', { muteHttpExceptions: true });
  if (r.getResponseCode() !== 200) throw new Error('GitHub respondió ' + r.getResponseCode());
  const res = { nuevas: [], actualizadas: [], iguales: 0 };
  const nombres = r.getContentText('UTF-8').split(/\r?\n/).map((x) => x.trim()).filter((x) => /^[\w.-]+\.(md|txt)$/i.test(x) && x !== 'indice.txt');
  for (const n of nombres) {
    const t = UrlFetchApp.fetch(AG_REPO_BIBLIO + encodeURIComponent(n), { muteHttpExceptions: true });
    if (t.getResponseCode() !== 200) continue;
    const e = agGuardarDoc(n, t.getContentText('UTF-8'));
    if (e === 'nueva') res.nuevas.push(n); else if (e === 'actualizada') res.actualizadas.push(n); else res.iguales++;
  }
  return res;
}

// Todos los .md/.txt de la biblioteca: { nombre, claves[], texto } (se recuerdan 10 minutos).
function agBiblioteca() {
  const cache = CacheService.getScriptCache();
  const g = cache.get('ag_bib');
  if (g) { try { return JSON.parse(g); } catch (x) { /* se vuelve a leer */ } }
  const docs = [];
  const carpeta = agCarpetaBiblio();
  if (!carpeta.getFiles().hasNext()) { try { agImportarRepo(); } catch (x) { /* sin GitHub por ahora */ } }
  const fs = carpeta.getFiles();
  while (fs.hasNext()) {
    const f = fs.next();
    const n = f.getName();
    if (!/\.(md|txt)$/i.test(n) && !/^text\//.test(f.getMimeType())) continue;
    let texto = '';
    try { texto = f.getBlob().getDataAsString('UTF-8'); } catch (x) { continue; }
    let claves = [];
    const m = texto.match(/^\s*claves\s*:\s*(.+)$/im);
    if (m) { claves = m[1].split(',').map((c) => c.trim()).filter(Boolean); texto = texto.replace(m[0], '').trim(); }
    docs.push({ nombre: n.replace(/\.(md|txt)$/i, ''), claves, texto: texto.slice(0, 60000) });
  }
  docs.sort((a, b) => a.nombre.localeCompare(b.nombre));
  try { const j = JSON.stringify(docs); if (j.length < 95000) cache.put('ag_bib', j, 600); } catch (x) { /* muy grande para la caché */ }
  return docs;
}

function agNorm(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

// Ordena por cuántas claves aparecen en la pregunta; solo devuelve los que tengan al menos una.
function agElegir(pregunta, lista, clavesDe) {
  const q = ' ' + agNorm(pregunta).replace(/[^a-z0-9ñ]+/g, ' ') + ' ';
  return lista.map((x) => {
    let p = 0;
    for (const c of clavesDe(x)) {
      const k = agNorm(c).replace(/[^a-z0-9ñ]+/g, ' ').trim();
      if (k.length < 3) continue;
      if (q.indexOf(' ' + k + ' ') >= 0) p += 2;
      else if (k.length >= 5 && q.indexOf(' ' + k) >= 0) p += 1; // plural o palabra más larga
    }
    return { x, p };
  }).filter((o) => o.p > 0).sort((a, b) => b.p - a.p).map((o) => o.x);
}

function agProcesos() { const l = agLeerJson(AG_PROCESOS); return l.map((p) => Object.assign({ claves: [], pasos: [] }, p)); }

function agGuardarProceso(pr) {
  const titulo = String(pr.titulo).trim().slice(0, 120);
  const claves = (Array.isArray(pr.claves) ? pr.claves : String(pr.claves || '').split(',')).map((c) => String(c).trim()).filter(Boolean).slice(0, 20);
  const pasos = pr.pasos.map((x) => String(x).trim()).filter(Boolean).slice(0, 40).map((x) => x.slice(0, 500));
  const lista = agProcesos();
  const igual = lista.find((p) => agNorm(p.titulo) === agNorm(titulo));
  const hoy = new Date().toISOString().slice(0, 10);
  let p;
  if (igual) { igual.claves = claves.length ? claves : igual.claves; igual.pasos = pasos; igual.f = hoy; igual.veces = (igual.veces || 1) + 1; p = igual; }
  else { p = { id: Utilities.getUuid().slice(0, 8), titulo, claves, pasos, f: hoy, veces: 1 }; lista.push(p); }
  agEscribirJson(AG_PROCESOS, lista.slice(-300));
  return p;
}

function agLeerJson(nombre) {
  const it = DriveApp.getFolderById(RAIZ).getFilesByName(nombre);
  if (!it.hasNext()) return [];
  try { const l = JSON.parse(it.next().getBlob().getDataAsString('UTF-8')); return Array.isArray(l) ? l : []; } catch (x) { return []; }
}
function agEscribirJson(nombre, lista) {
  const txt = JSON.stringify(lista, null, 1);
  const it = DriveApp.getFolderById(RAIZ).getFilesByName(nombre);
  if (it.hasNext()) it.next().setContent(txt);
  else DriveApp.getFolderById(RAIZ).createFile(nombre, txt, 'application/json');
}
