const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));

const page = (result = '') => `
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Calculadora</title>
  <style>
    body{font-family:system-ui,Arial;margin:2rem;max-width:600px}
    form{display:grid;gap:.75rem}
    label{font-weight:600}
    .ops{display:flex;gap:1rem;flex-wrap:wrap}
    .res{margin-top:1rem;padding:.75rem;border:1px solid #ddd;border-radius:8px;background:#f9f9f9}
    input,button{padding:.5rem}
    button{cursor:pointer}
  </style>
</head>
<body>
  <h1>Calculadora básica</h1>
  <form method="POST" action="/calc">
    <div class="ops">
      <label><input type="radio" name="op" value="sum" required> Sumar</label>
      <label><input type="radio" name="op" value="sub"> Restar</label>
      <label><input type="radio" name="op" value="mul"> Multiplicar</label>
      <label><input type="radio" name="op" value="div"> Dividir</label>
    </div>
    <label>Valor de a:
      <input type="number" name="a" required>
    </label>
    <label>Valor de b:
      <input type="number" name="b" required>
    </label>
    <button type="submit">Calcular</button>
  </form>
  ${result ? `<div class="res"><strong>Resultado:</strong> ${result}</div>` : ''}
</body>
</html>
`;

app.get('/', (req, res) => res.send(page()));

app.post('/calc', (req, res) => {
  const a = parseFloat(req.body.a);
  const b = parseFloat(req.body.b);
  const op = req.body.op;

  if (Number.isNaN(a) || Number.isNaN(b)) return res.send(page('Entradas inválidas.'));
  let r;
  switch (op) {
    case 'sum': r = a + b; break;
    case 'sub': r = a - b; break;
    case 'mul': r = a * b; break;
    case 'div':
      if (b === 0) return res.send(page('Error: división por cero.'));
      r = a / b;
      break;
    default: return res.send(page('Operación inválida.'));
  }
  res.send(page(String(r)));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Calculadora en http://localhost:${PORT}`));
