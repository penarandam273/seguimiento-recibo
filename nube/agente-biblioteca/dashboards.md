claves: dashboard, tablero, indicador, kpi, grafico, gráfico, reporte, informe, tabla dinamica, dinámica, segmentacion, segmentación, visual, resumen, metrica, panel
# Biblioteca: Dashboards en Excel

## Pasos para un dashboard
1. Datos limpios en una Tabla (Ctrl+T) en hoja "Datos".
2. Hoja "Calculos": tablas dinámicas o fórmulas SUMIFS/COUNTIFS que resumen.
3. Hoja "Dashboard": solo KPIs, gráficos y segmentaciones. Sin datos crudos.
4. Segmentaciones (slicers) y escala de tiempo conectadas a todas las tablas dinámicas (Analizar > Conexiones de filtro).
5. Actualizar: Datos > Actualizar todo (o macro: ActiveWorkbook.RefreshAll).

## Qué gráfico usar
- Comparar categorías (bodegas, productos): columnas o barras horizontales (ordenadas de mayor a menor).
- Evolución en el tiempo: líneas.
- Parte de un todo (máx. 5 partes): anillo; si hay más, barras.
- Meta vs real: columnas agrupadas o barra con línea de meta.
- Pareto/ABC: columnas + línea de % acumulado en eje secundario.
- Un solo número importante: tarjeta KPI (celda grande con fórmula, formato condicional y flecha ▲▼).

## Diseño
- Máximo 6–8 elementos por pantalla; lo más importante arriba a la izquierda.
- Colores: uno neutro para todo y uno de acento para lo que importa; rojo solo para alertas.
- Quitar líneas de cuadrícula (Vista > Líneas de cuadrícula), títulos claros con la unidad (Unidades, $ COP, %).
- Tarjeta KPI con variación: =TEXT((Actual-Anterior)/Anterior,"▲0.0%;▼0.0%")
- Mini-gráficos: Insertar > Minigráficos (sparklines) para tendencias por fila.

## KPIs típicos de bodega
Valor del inventario, unidades en stock, SKUs agotados, SKUs bajo mínimo, exactitud de inventario (ERI), rotación, días de cobertura, OTIF, fill rate, productividad de picking, devoluciones.

## Macro para crear tabla dinámica + gráfico: ver biblioteca VBA (PivotCaches.Create, AddChart2).
