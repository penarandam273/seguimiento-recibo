claves: vba, macro, automatizar, automatico, boton, bucle, recorrer, modulo, procedimiento, sub, formulario, userform, evento, copiar, pegar, exportar, importar, csv, pdf, hojas, libro
# Biblioteca: VBA para Excel

## Plantilla segura de macro
```vba
Public Sub AgenteTarea()
    Dim ws As Worksheet, ultimaFila As Long, i As Long
    Set ws = ActiveSheet
    Application.ScreenUpdating = False
    ultimaFila = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    For i = 2 To ultimaFila
        ' trabajo por fila
    Next i
    Application.ScreenUpdating = True
End Sub
```

## Patrones útiles
- Última fila / columna: ws.Cells(ws.Rows.Count,"A").End(xlUp).Row ; ws.Cells(1, ws.Columns.Count).End(xlToLeft).Column
- Rango usado: ws.UsedRange ; región actual: ws.Range("A1").CurrentRegion
- Leer/escribir rápido con arreglos: v = rng.Value ... rng.Value = v  (mucho más rápido que celda por celda).
- Crear hoja si no existe:
  On Error Resume Next: Set h = ActiveWorkbook.Worksheets("Resumen"): On Error GoTo 0
  If h Is Nothing Then Set h = ActiveWorkbook.Worksheets.Add(After:=ActiveWorkbook.Sheets(ActiveWorkbook.Sheets.Count)): h.Name = "Resumen"
- Convertir en tabla: ws.ListObjects.Add(xlSrcRange, ws.Range("A1").CurrentRegion, , xlYes).Name = "TablaInventario"
- Ordenar: rng.Sort Key1:=rng.Columns(3), Order1:=xlDescending, Header:=xlYes
- Filtro: rng.AutoFilter Field:=2, Criteria1:="Norte" ; quitar: ws.AutoFilterMode = False
- Quitar duplicados: rng.RemoveDuplicates Columns:=Array(1), Header:=xlYes
- Formato condicional (rojo si menor que mínimo):
  With rng.FormatConditions.Add(Type:=xlExpression, Formula1:="=$C2<$D2"): .Interior.Color = RGB(255,199,206): End With
- Diccionario para agrupar/sumar: Set d = CreateObject("Scripting.Dictionary"): d(clave) = d(clave) + valor
- Tabla dinámica:
  Set pc = ActiveWorkbook.PivotCaches.Create(xlDatabase, ws.Range("A1").CurrentRegion)
  Set pt = pc.CreatePivotTable(TableDestination:=hDestino.Range("A3"), TableName:="TD_Resumen")
  pt.PivotFields("Bodega").Orientation = xlRowField
  pt.AddDataField pt.PivotFields("Cantidad"), "Total Cantidad", xlSum
- Gráfico: Set ch = h.Shapes.AddChart2(201, xlColumnClustered).Chart: ch.SetSourceData h.Range("A3").CurrentRegion  (AddChart2 desde Excel 2013)
- Exportar a PDF: ws.ExportAsFixedFormat Type:=xlTypePDF, Filename:=ActiveWorkbook.Path & "\Reporte.pdf"
- Guardar copia CSV: ws.Copy: ActiveWorkbook.SaveAs ruta, xlCSVUTF8: ActiveWorkbook.Close False
- Abrir todos los archivos de una carpeta: f = Dir(carpeta & "\*.xlsx"): Do While f <> "": ... : f = Dir: Loop
- Fecha/hora en nombre: Format(Now, "yyyy-mm-dd_hhmm")

## Reglas
- Siempre Option Explicit y Dim; usa Long (no Integer) para filas.
- Nunca Select/Activate si no es necesario: trabaja con objetos (ws.Range(...).Value = ...).
- Restaura ScreenUpdating, Calculation y EnableEvents al terminar.
- Las macros no se deshacen con Ctrl+Z: guarda antes. El libro debe guardarse como .xlsm para conservar macros.
- Error 9 = hoja o elemento no existe; 1004 = error de Excel (rango/nombre inválido); 13 = tipo no coincide; 91 = objeto no asignado (falta Set).
