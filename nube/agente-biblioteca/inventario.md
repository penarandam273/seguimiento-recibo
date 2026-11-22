claves: inventario, stock, bodega, almacen, logistica, logístico, sku, referencia, producto, entrada, salida, kardex, despacho, recepcion, pedido, reorden, rotacion, abc, fifo, fefo, picking, ubicacion, conteo, merma, vencimiento, proveedor, compras, abastecimiento, wms, wps
# Biblioteca: Inventarios y logística de bodega

## Conceptos y fórmulas clave
- Stock disponible = Stock físico - Reservado/Comprometido.
- Kardex: Saldo = Saldo anterior + Entradas - Salidas (una fila por movimiento: fecha, SKU, tipo, cantidad, documento).
- Consumo promedio diario (CPD) = Salidas del periodo / días del periodo.
- Stock de seguridad (SS) ≈ Z × desviación estándar de la demanda diaria × √(lead time en días). Z: 90%=1.28, 95%=1.65, 99%=2.33.
  Versión simple: SS = (Consumo máx diario - Consumo promedio diario) × Lead time.
- Punto de reorden (ROP) = CPD × Lead time + SS. Si stock ≤ ROP → pedir.
- Cantidad económica de pedido (EOQ) = √(2 × Demanda anual × Costo por pedido / Costo de mantener una unidad al año).
- Rotación de inventario = Costo de ventas (o salidas) del periodo / Inventario promedio. Días de inventario = días del periodo / Rotación.
- Cobertura (días) = Stock actual / CPD.
- Exactitud de inventario (ERI) = (Referencias sin diferencia / Referencias contadas) × 100. Meta típica ≥ 98%.
- Diferencia de conteo = Conteo físico - Sistema; valorizada = diferencia × costo unitario.
- Fill rate = Unidades despachadas / Unidades pedidas. OTIF = pedidos a tiempo y completos / total pedidos.
- Merma % = Unidades perdidas / Unidades recibidas.
- Productividad picking = Líneas (o unidades) preparadas / horas hombre.

## Clasificación ABC (Pareto)
1. Valor anual por SKU = consumo anual × costo. 2. Ordenar de mayor a menor. 3. % acumulado.
4. A = hasta 80% del valor (≈20% SKUs, control estricto, conteo frecuente), B = 80–95%, C = 95–100%.
Fórmula Excel del % acumulado (datos ordenados en D2:D500): =SUM($D$2:D2)/SUM($D$2:$D$500)
Clase: =IF(E2<=0.8,"A",IF(E2<=0.95,"B","C"))

## Métodos de salida
- FIFO: primero en entrar, primero en salir. FEFO: primero en vencer, primero en salir (alimentos/perecederos).
- Conteo cíclico: contar a diario un grupo de SKUs (A más seguido) en lugar de un inventario general anual.

## Estructura recomendada de archivos
- Hoja Maestro: SKU | Descripción | Categoría | Unidad | Ubicación | Costo | Stock mínimo | Stock máximo | Lead time.
- Hoja Movimientos: Fecha | SKU | Tipo (Entrada/Salida/Ajuste) | Cantidad | Documento | Responsable.
- Hoja Stock: SKU | Entradas (SUMIFS) | Salidas (SUMIFS) | Saldo | Estado (semáforo) | Cobertura días.
- Hoja Dashboard: KPIs (ERI, rotación, agotados, bajo mínimo, valor del inventario) + gráficos.
