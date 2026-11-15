const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MAX_CHAVE = 255; 
const MAX_TEXTO_CIFRADO = 2048; 

function xor(dados, chave) {
  const resultado = Buffer.alloc(dados.length);
  for (let i = 0; i < dados.length; i++) {
    resultado[i] = dados[i] ^ chave[i];
  }
  return resultado;
}

function bytesParaBinario(buffer) {
  return Array.from(buffer, (b) => b.toString(2).padStart(8, '0')).join('');
}

function binarioParaBytes(binario) {
  const grupos = binario.match(/.{8}/g);
  return Buffer.from(grupos.map((g) => parseInt(g, 2)));
}

app.post('/cifrar', (req, res) => {
  const { textoClaro, chave } = req.body;

  if (typeof textoClaro !== 'string' || textoClaro.length === 0) {
    return res.status(400).json({ error: 'O campo "textoClaro" é obrigatório.' });
  }
  if (typeof chave !== 'string' || chave.length === 0) {
    return res.status(400).json({ error: 'O campo "chave" é obrigatório.' });
  }
  if (chave.length > MAX_CHAVE) {
    return res.status(400).json({ error: `A chave excede ${MAX_CHAVE} caracteres.` });
  }

  const claroBytes = Buffer.from(textoClaro, 'utf8');
  const chaveBytes = Buffer.from(chave, 'utf8');

  if (chaveBytes.length !== claroBytes.length) {
    return res.status(400).json({
      error: `A chave deve ter o mesmo tamanho do texto claro (${claroBytes.length} bytes), mas tem ${chaveBytes.length}.`,
    });
  }

  const cifrado = xor(claroBytes, chaveBytes);
  res.json({ textoCifrado: bytesParaBinario(cifrado) });
});

app.post('/decifrar', (req, res) => {
  const { textoCifrado, chave } = req.body;

  if (typeof textoCifrado !== 'string' || !/^[01]+$/.test(textoCifrado) || textoCifrado.length % 8 !== 0) {
    return res.status(400).json({
      error: '"textoCifrado" deve conter apenas 0 e 1, em grupos de 8 bits (1 byte cada).',
    });
  }
  if (textoCifrado.length > MAX_TEXTO_CIFRADO) {
    return res.status(400).json({ error: `"textoCifrado" excede ${MAX_TEXTO_CIFRADO} caracteres.` });
  }
  if (typeof chave !== 'string' || chave.length === 0) {
    return res.status(400).json({ error: 'O campo "chave" é obrigatório.' });
  }
  if (chave.length > MAX_CHAVE) {
    return res.status(400).json({ error: `A chave excede ${MAX_CHAVE} caracteres.` });
  }

  const cifradoBytes = binarioParaBytes(textoCifrado);
  const chaveBytes = Buffer.from(chave, 'utf8');

  if (chaveBytes.length !== cifradoBytes.length) {
    return res.status(400).json({
      error: `A chave deve ter o mesmo tamanho do texto cifrado (${cifradoBytes.length} bytes), mas tem ${chaveBytes.length}.`,
    });
  }

  const claro = xor(cifradoBytes, chaveBytes);
  res.json({ textoClaro: claro.toString('utf8') });
});

app.listen(PORT, () => console.log(`API Vernam rodando em http://localhost:${PORT}`));