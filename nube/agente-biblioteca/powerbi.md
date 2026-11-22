claves: power bi, powerbi, power query, dax, medida, modelo, relacion, relación, columna calculada, m, consulta, transformar, combinar, anexar, calendario
# Biblioteca: Power BI y Power Query

## Flujo de trabajo
1. Obtener datos (Excel, CSV, carpeta, SQL) → 2. Transformar en Power Query → 3. Modelar (relaciones) → 4. Medidas DAX → 5. Visualizaciones → 6. Publicar/actualizar.
- Modelo estrella: tablas de hechos (Movimientos, Ventas) al centro; dimensiones (Productos, Bodegas, Calendario) alrededor; relaciones 1 a muchos desde la dimensión.
- Prefiere MEDIDAS a columnas calculadas para totales y KPIs.

## Power Query (lenguaje M) – pasos comunes
- Promover encabezados, cambiar tipos, quitar filas vacías, quitar duplicados, dividir columna, rellenar hacia abajo, anular dinamización (unpivot), combinar consultas (merge = BUSCARV), anexar (append = unir tablas).
- Combinar todos los Excel de una carpeta: Obtener datos > Carpeta > Combinar y transformar.
- Ejemplo M: = Table.SelectRows(#"Tipo cambiado", each [Cantidad] > 0)
- Columna condicional M: = Table.AddColumn(Origen, "Estado", each if [Stock] < [Minimo] then "Bajo" else "OK")

## DAX – medidas modelo
- Total Cantidad = SUM(Movimientos[Cantidad])
- Entradas = CALCULATE([Total Cantidad], Movimientos[Tipo] = "Entrada")
- Salidas = CALCULATE([Total Cantidad], Movimientos[Tipo] = "Salida")
- Saldo = [Entradas] - [Salidas]
- Valor Inventario = SUMX(Productos, Productos[Stock] * Productos[Costo])
- SKUs Bajo Mínimo = COUNTROWS(FILTER(Productos, Productos[Stock] < Productos[Minimo]))
- % Cumplimiento = DIVIDE([Real], [Meta], 0)
- Acumulado del año = TOTALYTD([Total Cantidad], Calendario[Fecha])
- Mes anterior = CALCULATE([Total Cantidad], DATEADD(Calendario[Fecha], -1, MONTH))
- Variación % = DIVIDE([Total Cantidad] - [Mes anterior], [Mes anterior])
- Tabla calendario: Calendario = ADDCOLUMNS(CALENDARAUTO(), "Año", YEAR([Date]), "Mes", FORMAT([Date], "MMM"), "MesNum", MONTH([Date]))
  (marcarla como tabla de fechas y relacionarla con la fecha de los hechos).

## Consejos
- DIVIDE en vez de "/" para evitar errores por cero.
- CALCULATE cambia el contexto de filtro; ALL() quita filtros (para % del total: DIVIDE([Total], CALCULATE([Total], ALL(Productos)))).
- Power BI Desktop es gratis (Windows). Publicar y compartir en la nube requiere licencia Pro o la que tenga la empresa.
- En Excel también existe Power Query (Datos > Obtener datos) y Power Pivot para medidas DAX.
