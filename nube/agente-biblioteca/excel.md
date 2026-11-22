claves: excel, formula, fórmula, celda, columna, fila, hoja, tabla, buscar, sumar, contar, promedio, fecha, texto, condicional, filtro, ordenar, validacion, duplicado, rango
# Biblioteca: Excel (fórmulas y buenas prácticas)

## Reglas para escribir fórmulas desde el agente
- Desde VBA o al insertar: funciones en INGLÉS y separador COMA (Range.Formula). Excel las muestra en español (SUMA, SI, BUSCARV, ; ).
- Equivalencias: SUM=SUMA, IF=SI, IFERROR=SI.ERROR, VLOOKUP=BUSCARV, XLOOKUP=BUSCARX, INDEX=INDICE, MATCH=COINCIDIR, SUMIFS=SUMAR.SI.CONJUNTO, COUNTIFS=CONTAR.SI.CONJUNTO, AVERAGEIFS=PROMEDIO.SI.CONJUNTO, TEXT=TEXTO, TODAY=HOY, NETWORKDAYS=DIAS.LAB, UNIQUE=UNICOS, FILTER=FILTRAR, SORT=ORDENAR.
- XLOOKUP, FILTER, UNIQUE, SORT, LET, LAMBDA solo existen en Excel 365/2021. Para 2016/2019 usa INDEX+MATCH, SUMIFS, COUNTIFS.
- Usa referencias absolutas ($A$2:$A$500) cuando la fórmula se copiará hacia abajo; mejor aún, convierte el rango en Tabla (Ctrl+T) y usa referencias estructuradas: =SUM(Tabla1[Cantidad]).

## Fórmulas modelo
- Buscar compatible: =IFERROR(INDEX(Precios!$C:$C, MATCH(A2, Precios!$A:$A, 0)), "No existe")
- Buscar 365: =XLOOKUP(A2, Precios!A:A, Precios!C:C, "No existe")
- Sumar con condiciones: =SUMIFS(D:D, B:B, "Norte", C:C, ">="&DATE(2026,1,1))
- Contar con condiciones: =COUNTIFS(B:B, "Norte", E:E, "<"&F2)
- Detectar duplicados: =COUNTIF($A$2:$A$1000, A2)>1
- Días hábiles entre fechas: =NETWORKDAYS(A2, B2)
- Edad de inventario (días): =TODAY()-C2
- Semáforo de stock: =IF(D2<=0,"AGOTADO",IF(D2<E2,"BAJO MÍNIMO","OK"))
- Texto: =TRIM(PROPER(A2)) limpia espacios; =LEFT(A2,3) / =RIGHT / =MID; unir: =A2&" - "&B2 o =TEXTJOIN(", ",TRUE,A2:A10)
- Mes y año de una fecha: =TEXT(A2,"yyyy-mm")  (en español el formato puede ser "aaaa-mm")
- Porcentaje de cumplimiento: =IFERROR(Real/Meta, 0) con formato %.

## Buenas prácticas
- Una fila = un registro; una columna = un dato; encabezados en la fila 1 sin celdas combinadas.
- Datos crudos en una hoja, cálculos en otra, resumen/dashboard en otra.
- Validación de datos (listas desplegables) para evitar errores de digitación.
- Formato condicional para alertas (rojo bajo mínimo, amarillo cerca del mínimo).
- Evita columnas completas en libros muy grandes si va lento: usa Tablas.
- Errores comunes: #N/A (no encontró), #¿NOMBRE? (función mal escrita o no existe en esa versión), #¡REF! (referencia borrada), #¡VALOR! (texto donde va número), #¡DESBORDAMIENTO! (no hay espacio para el resultado).
- Números guardados como texto: =VALUE(A2) o multiplicar por 1; fechas como texto: =DATEVALUE(A2).
