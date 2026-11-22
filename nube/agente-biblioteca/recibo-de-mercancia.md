claves: recibo, recepcion, recepción, mercancia, mercancía, conferencia, auditoria, auditoría, proveedor, descargue, cita, factura, remision, orden de compra, novedad, averia, avería, faltante, sobrante, rechazo, devolucion, temperatura, frio, frío, cadena de frio, lote, vencimiento, etiqueta, estiba, reestibar, embalaje, sap, wpms, operador
# Biblioteca: Recibo de mercancía y conferencia (auditoría) de recibo

## Flujo general del recibo en un CEDI
1. Cita del proveedor → llegada a portería → asignación de muelle.
2. Revisión documental: orden de compra (OC), factura o remisión, y que coincidan proveedor, códigos y cantidades.
3. Inspección del vehículo: limpieza, olores, plagas, sellos/precintos; en refrigerados y congelados medir temperatura del furgón y del producto.
4. Descargue y verificación: cantidades (cajas y unidades), estado del embalaje, lote y fecha de vencimiento, etiqueta del proveedor y código (EAN/SAP).
5. Registro en el sistema (WPMS/SAP), etiquetado de estibas y ubicación o traslado a almacenamiento.
6. Novedades: se documentan con fotos y se informan antes de que el vehículo se vaya.

## Conferencia de recibo (lo que registra la app)
- Por cada estiba o etiqueta revisada: fecha, operador que recibió, proveedor, etiqueta, código SAP, descripción, categoría, criterios (embalaje, cantidad, vencimiento, temperatura, etc. según la planilla), observaciones y fotos.
- Productos críticos (carnes, lácteos, congelados, frágiles, alto valor) se revisan con más detalle.
- Buenas fotos de evidencia: etiqueta legible, producto dañado de cerca y foto general de la estiba.

## Tipos de novedad y qué hacer
- Faltante: llegó menos de lo facturado → se recibe lo real y se registra la diferencia con firma del transportador.
- Sobrante: llegó más → no se recibe sin autorización (o se recibe según política) y se informa.
- Avería: caja rota, mojada, aplastada o producto dañado → foto, separar y rechazar o devolver según política.
- Vencimiento corto: menos vida útil que la mínima aceptada → rechazo o autorización del área comercial.
- Temperatura fuera de rango (cadena de frío): foto del termómetro, registrar valor y rechazar según política.
- Mal estibado: estiba inestable o sobrepasada en altura → reestibar y registrar.
- Etiqueta o código que no corresponde → corregir antes de ubicar.

## Indicadores útiles de recibo
- % conferencias con novedad = conferencias con novedad / total.
- Novedades por proveedor (ranking) y por tipo (Pareto).
- Tiempo de descargue por vehículo y cumplimiento de citas.
- Exactitud del recibo = estibas sin diferencia / estibas revisadas.
- Conferencias por auditor por día (productividad).

## FEFO en recibo
Al ubicar, el producto que vence primero debe quedar para salir primero; registrar bien el lote y la fecha es lo que lo permite.
