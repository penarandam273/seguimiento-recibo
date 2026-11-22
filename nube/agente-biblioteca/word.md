claves: word, documento, carta, informe, acta, plantilla, combinar correspondencia, correspondencia, docx, parrafo, párrafo, membrete, certificado, contrato
# Biblioteca: Word y automatización de documentos

## Desde Excel con VBA (enlace tardío, sin referencias)
```vba
Public Sub AgenteTarea()
    Dim wd As Object, doc As Object, ws As Worksheet
    Set ws = ActiveSheet
    Set wd = CreateObject("Word.Application")
    wd.Visible = True
    Set doc = wd.Documents.Add
    doc.Content.Text = "Informe de inventario - " & Format(Date, "dd/mm/yyyy")
    doc.Paragraphs(1).Range.Font.Size = 16
    doc.Paragraphs(1).Range.Font.Bold = True
    doc.Content.InsertParagraphAfter
    doc.Content.InsertAfter "Total de referencias: " & Application.WorksheetFunction.CountA(ws.Range("A:A")) - 1
    doc.SaveAs2 ActiveWorkbook.Path & "\Informe_" & Format(Now, "yyyymmdd_hhmm") & ".docx"
End Sub
```
- Plantilla con marcadores: en Word inserta Marcadores (Insertar > Marcador) y desde VBA: doc.Bookmarks("Nombre").Range.Text = valor.
- Reemplazar etiquetas tipo {{NOMBRE}}: With doc.Content.Find: .Text = "{{NOMBRE}}": .Replacement.Text = valor: .Execute Replace:=2: End With  (2 = wdReplaceAll)
- Pegar una tabla de Excel: ws.Range("A1").CurrentRegion.Copy: doc.Paragraphs(doc.Paragraphs.Count).Range.PasteExcelTable False, False, False
- Exportar a PDF: doc.ExportAsFixedFormat OutputFileName:=ruta & ".pdf", ExportFormat:=17  (17 = wdExportFormatPDF)

## Combinar correspondencia (sin código)
Word > Correspondencia > Iniciar combinación > Seleccionar destinatarios > Usar lista existente (el Excel) > Insertar campo combinado > Finalizar y combinar. Ideal para certificados, cartas o etiquetas masivas.

## Buenas prácticas
- Usa Estilos (Título 1, Título 2) para poder generar tabla de contenido automática.
- Guarda las plantillas como .dotx; las que llevan macros como .docm.
