claves: google, gmail, drive, sheets, hojas de calculo de google, apps script, formulario, forms, calendar, calendario, gsheet, nube
# Biblioteca: Google (Gmail, Drive, Sheets) con Apps Script

## Qué es
Apps Script (script.google.com o en Sheets: Extensiones > Apps Script) es JavaScript que corre en la nube de Google y puede automatizar Gmail, Drive, Sheets, Docs, Forms y Calendar. Gratis con una cuenta Google. Se programa con activadores (triggers) para que corra solo cada día/hora.

## Ejemplos
- Enviar correo desde Gmail con datos de una hoja:
```javascript
function enviarReporte() {
  const hoja = SpreadsheetApp.getActive().getSheetByName('Stock');
  const datos = hoja.getDataRange().getValues();      // matriz [fila][columna]
  const bajos = datos.slice(1).filter(f => f[3] < f[4]); // stock < mínimo
  if (bajos.length === 0) return;
  const cuerpo = bajos.map(f => `${f[0]} - ${f[1]}: ${f[3]} (mín ${f[4]})`).join('\n');
  GmailApp.sendEmail('correo@ejemplo.com', 'Productos bajo mínimo', cuerpo);
}
```
- Guardar adjuntos de Gmail en una carpeta de Drive:
```javascript
function guardarAdjuntos() {
  const carpeta = DriveApp.getFolderById('ID_DE_LA_CARPETA');
  GmailApp.search('has:attachment is:unread subject:inventario').forEach(hilo => {
    hilo.getMessages().forEach(m => m.getAttachments().forEach(a => carpeta.createFile(a.copyBlob())));
    hilo.markRead();
  });
}
```
- Programar: en el editor > Activadores (reloj) > Añadir activador > basado en tiempo (diario 7 a.m.).
- Leer un Excel subido a Drive: convertirlo a Google Sheets (Archivo > Guardar como Hojas de cálculo de Google) y luego SpreadsheetApp.openById.

## Fórmulas útiles de Google Sheets
- =QUERY(A1:E500, "select B, sum(D) where C = 'Norte' group by B", 1)
- =IMPORTRANGE("url_del_archivo", "Hoja1!A1:D100")
- =GOOGLEFINANCE, =ARRAYFORMULA(...) para aplicar a toda la columna.

## Límites
- Gmail gratuito: aprox. 100 destinatarios/día por script; cuentas Workspace tienen más.
- Desde Excel/VBA no se accede a Gmail directamente; usar Apps Script o Outlook.
