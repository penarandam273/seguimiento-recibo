claves: outlook, correo, email, enviar, adjunto, powerpoint, presentacion, presentación, diapositiva, office, teams, onedrive, sharepoint, access
# Biblioteca: Office (Outlook, PowerPoint, OneDrive)

## Enviar correo con Outlook desde Excel (VBA)
```vba
Public Sub AgenteTarea()
    Dim ol As Object, m As Object
    Set ol = CreateObject("Outlook.Application")
    Set m = ol.CreateItem(0)              ' 0 = olMailItem
    m.To = "destinatario@empresa.com"
    m.Subject = "Reporte de inventario " & Format(Date, "dd/mm/yyyy")
    m.HTMLBody = "<p>Hola,</p><p>Adjunto el reporte.</p>"
    m.Attachments.Add ActiveWorkbook.FullName
    m.Display                              ' muestra el correo para revisarlo; .Send lo envía directo
End Sub
```
- Regla del agente: usar .Display (no .Send) para que Luis revise antes de enviar, salvo que él pida enviar directo.
- Requiere Outlook de escritorio instalado y configurado. No funciona con Outlook web/nuevo Outlook.
- Correos masivos: recorrer filas con correo, nombre y dato personalizado; pausa entre envíos.

## PowerPoint desde Excel
```vba
Dim pp As Object, pres As Object, sld As Object
Set pp = CreateObject("PowerPoint.Application"): pp.Visible = True
Set pres = pp.Presentations.Add
Set sld = pres.Slides.Add(1, 11)          ' 11 = ppLayoutTitleOnly
sld.Shapes(1).TextFrame.TextRange.Text = "Indicadores de bodega"
ActiveSheet.ChartObjects(1).Chart.ChartArea.Copy
sld.Shapes.Paste
```

## OneDrive / SharePoint
- Si el libro está en OneDrive, ActiveWorkbook.Path puede devolver una URL (https://...). Para rutas locales usar la carpeta sincronizada (Environ("OneDrive")).
- Coautoría en línea: las macros no se ejecutan en Excel para la web.
