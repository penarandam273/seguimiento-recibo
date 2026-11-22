claves: estadistica, estadística, promedio, media, mediana, moda, desviacion, desviación, varianza, tendencia, pronostico, pronóstico, regresion, correlacion, percentil, cuartil, histograma, analizar, analisis, análisis, atipico, outlier, proyeccion
# Biblioteca: Estadística aplicada (Excel)

## Medidas básicas (nombres en inglés para fórmulas del agente)
- Promedio =AVERAGE(r) | Mediana =MEDIAN(r) | Moda =MODE.SNGL(r)
- Desviación estándar muestra =STDEV.S(r) | población =STDEV.P(r) | Varianza =VAR.S(r)
- Mínimo/Máximo =MIN / =MAX | Percentil =PERCENTILE.INC(r, 0.9) | Cuartil =QUARTILE.INC(r, 1)
- Coeficiente de variación = STDEV.S/AVERAGE (alto = demanda irregular).
- Correlación =CORREL(x, y) (−1 a 1; |r|>0.7 fuerte).

## Pronósticos
- Tendencia lineal: =FORECAST.LINEAR(x_nuevo, y_conocidos, x_conocidos) (en 2013: =FORECAST).
- Promedio móvil de 3 periodos: =AVERAGE(B2:B4) arrastrado.
- Excel 2016+: Datos > Previsión > Hoja de previsión (suavizado exponencial con estacionalidad) o =FORECAST.ETS.
- Pendiente y crecimiento: =SLOPE(y, x), =TREND(...), =GROWTH(...).

## Detectar datos atípicos (método IQR)
Q1 =QUARTILE.INC(r,1), Q3 =QUARTILE.INC(r,3), IQR = Q3−Q1.
Atípico si valor < Q1 − 1.5·IQR o > Q3 + 1.5·IQR. Marcar: =OR(A2<$F$1-1.5*$F$3, A2>$F$2+1.5*$F$3)

## Cómo analizar un conjunto de datos (orden recomendado)
1. Revisar calidad: vacíos, duplicados, texto en columnas numéricas, fechas inválidas.
2. Resumen: conteo, suma, promedio, mediana, mín, máx por categoría (tabla dinámica).
3. Distribución: histograma (Insertar > Gráfico estadístico) y atípicos.
4. Tendencia en el tiempo: gráfico de líneas por mes.
5. Conclusiones accionables (qué hacer), no solo números.
- Herramienta extra: Archivo > Opciones > Complementos > "Herramientas para análisis" (Análisis de datos: estadística descriptiva, regresión, histograma).
