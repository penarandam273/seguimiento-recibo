-- Exportar los datos de Recibo desde el panel de Supabase (sirve aunque la API este bloqueada por cuota).
-- SQL Editor -> pegar una consulta -> Run -> boton "Export" -> CSV. Una por tabla.

-- 1. Planillas, articulos, ajustes, fotos y enlaces de Drive
select coleccion, id, datos::text as datos, version, borrado, actualizado_por, actualizado_en
from public.recibo_docs order by coleccion, id;

-- 2. Codigo general del equipo (hash, no se ve el codigo)
select * from public.recibo_equipo;

-- 3. Personas invitadas
select * from public.recibo_miembros;

-- Para cargarlos en el proyecto nuevo: Table Editor -> la tabla -> Insert -> Import data from CSV.
