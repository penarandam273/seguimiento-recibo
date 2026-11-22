claves: programacion, programación, codigo, código, python, javascript, node, express, api, sql, base de datos, html, css, react, git, github, json, servidor, app, aplicacion, desarrollador, error, depurar, npm, pip, script
# Biblioteca: Programación y desarrollo

## Principios
- Primero que funcione, luego que sea claro, luego rápido. Nombres descriptivos, funciones cortas, comentarios del "por qué".
- Nunca guardar claves/contraseñas en el código: usar variables de entorno o archivos .env (y agregarlos a .gitignore).
- Leer el mensaje de error completo: archivo, línea y tipo de error dicen dónde está el problema.

## Node.js + Express (API básica)
```javascript
// npm init -y && npm install express
const express = require('express');
const app = express();
app.use(express.json());
const productos = [];
app.get('/productos', (req, res) => res.json(productos));
app.post('/productos', (req, res) => {
  const { sku, nombre, stock } = req.body;
  if (!sku || !nombre) return res.status(400).json({ error: 'sku y nombre son obligatorios' });
  productos.push({ sku, nombre, stock: Number(stock) || 0 });
  res.status(201).json({ ok: true });
});
app.listen(3000, () => console.log('API en http://localhost:3000'));
```
- Errores típicos: "Cannot find module" → falta npm install; "EADDRINUSE" → el puerto ya está en uso; CORS → instalar y usar el paquete cors.

## Python para datos
```python
# pip install pandas openpyxl
import pandas as pd
df = pd.read_excel('inventario.xlsx', sheet_name='Movimientos')
resumen = df.pivot_table(index='SKU', columns='Tipo', values='Cantidad', aggfunc='sum', fill_value=0)
resumen['Saldo'] = resumen.get('Entrada', 0) - resumen.get('Salida', 0)
resumen.to_excel('resumen_stock.xlsx')
```

## SQL esencial
- SELECT sku, SUM(cantidad) AS total FROM movimientos WHERE tipo = 'Salida' GROUP BY sku ORDER BY total DESC;
- JOIN: SELECT p.nombre, m.cantidad FROM movimientos m JOIN productos p ON p.sku = m.sku;
- Siempre WHERE en UPDATE/DELETE; probar primero con SELECT.

## Git
git init · git add . · git commit -m "mensaje" · git remote add origin URL · git push -u origin main · git pull · git checkout -b rama-nueva

## HTML/CSS/JS rápido
Estructura: <!doctype html><html><head><meta charset="utf-8"><title>..</title></head><body>..<script>..</script></body></html>
fetch API: const r = await fetch('/productos'); const datos = await r.json();
