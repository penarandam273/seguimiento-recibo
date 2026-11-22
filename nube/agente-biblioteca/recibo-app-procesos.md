claves: recibo, app, error, falla, sincronizar, sincronizacion, nube, puente, drive, foto, fotos, subir, planilla, auditor, invitacion, enlace, codigo, sesion, clave, contraseña, apk, android, instalar, actualizar, supabase, github, maestro, edwin, arregoces, sin_acceso, diagnostico
# Biblioteca: Seguimiento de Recibo — procesos ya resueltos

## Fotos "por subir" que no suben
1. Revisar que haya señal y que el chip de arriba no diga "Solo en este equipo".
2. Agente → Diagnóstico → "Revisar todo": si el Puente de Google Drive sale con ❌, tocar "Probar otra vez".
3. Si dice "sin_acceso": cerrar sesión y entrar otra vez (Luis con su cuenta; auditores con su enlace de invitación).
4. Si el puente no responde: en Apps Script (cuenta themendomendoza@gmail.com) → Implementar → Gestionar implementaciones → lápiz → Versión nueva → Implementar. La dirección no cambia.
5. Tocar "Sincronizar ahora". Las fotos suben solas a Drive; en la nube solo queda la referencia.

## Un auditor no aparece o su planilla está vacía en la nube
1. Sus conferencias están solo en su celular hasta que sincronice.
2. Que abra la app con internet (sin borrar datos del navegador ni desinstalar) y toque "Sincronizar ahora".
3. Si no tiene acceso: Luis crea una invitación nueva en Ajustes → Nube del equipo y se la manda por WhatsApp.
4. Luis revisa en Agente → Diagnóstico la línea "Auditores" para confirmar que llegó.

## Pasar a un auditor al enlace nuevo (penarandam273.github.io/seguimiento-recibo)
1. Primero que sincronice todo en el enlace viejo.
2. Luis abre el enlace nuevo, entra con su cuenta y crea la invitación (Ajustes → Nube del equipo).
3. El auditor abre la invitación (o pega el enlace en "Código de equipo"), pone su nombre en "Auditor de este equipo" y activa "Actualizar Drive solo" si aplica.

## "Invalid login credentials" al entrar como Luis
1. La cuenta es la de penarandam273@gmail.com en el proyecto THEMENDO-RECIBO-PRO.
2. La clave la cambia Luis mismo en Supabase (nunca se escribe en el chat ni la ve el agente).

## Instalar o actualizar la app Android
1. En la página tocar "📲 Descargar app" (o Releases del repositorio penarandam273/seguimiento-recibo).
2. Abrir el APK y permitir "instalar apps de origen desconocido" para el navegador.
3. Actualizar = instalar el APK nuevo encima: los datos se conservan porque la firma es la misma.
4. Si GitHub Actions falla al compilar: revisar el registro del flujo "App Android"; la llave está en los secretos LLAVE_APK y CLAVE_LLAVE_APK (si quedan cambiados de lugar el flujo los acomoda solo).

## Archivo maestro de Drive desactualizado
1. Ajustes → Google Drive → "Actualizar Drive ahora" (o Agente → acción "Actualizar Drive ahora").
2. El maestro "Seguimiento de Recibo - Historial completo.xlsx" se rehace con todas las conferencias de todos los auditores, con dashboard y evidencias por operador.
3. Las planillas para imprimir quedan en "Planillas (formato físico)", una carpeta por auditor.

## Reglas fijas del proyecto
- No borrar nada sin autorización de Luis; lo viejo va a la papelera o a "anteriores".
- Fotos comprimidas (~180 KB) y solo en Drive, para no pasar los límites gratis de Supabase.
- El agente no cambia el código: redacta el pedido para Claude.
