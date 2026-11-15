# API da Cifra de Vernam

API REST em Node.js (Express) que cifra e decifra mensagens usando a **Cifra de Vernam**: o texto e a chave são combinados byte a byte com a operação XOR, e a chave precisa ter o mesmo tamanho do texto.

Está hospedada em: https://api-vernan.onrender.com

## Integrantes

- José Henrique Falsarella Lima Oliveira

## Requisitos

- [Node.js](https://nodejs.org/) 18 ou superior

## Como executar

1. Abra um terminal na pasta do projeto (onde estão o `server.js` e o `package.json`).

2. Instale as dependências:

```bash
npm install
```

3. Inicie a API:

```bash
npm start
```

4. Se tudo der certo, o terminal mostra:

```
API Vernam rodando em http://localhost:3000
```

A API usa a porta `3000` por padrão. Para usar outra porta, defina a variável `PORT`:

## Endpoints

### POST `/cifrar`
**Exemplo de Request**

```json
{
  "textoClaro": "OLA",
  "chave": "CHT"
}
```

### POST `/decifrar`
**Exemplo de Request**

```json
{
  "textoCifrado": "000011000000010000010101",
  "chave": "CHT"
}
```

## Regras e validações

- `textoClaro`, `textoCifrado` e `chave` são obrigatórios e devem ser texto.
- A `chave` deve ter o mesmo tamanho do texto, em bytes. Caracteres com acento ocupam mais de 1 byte (por exemplo, `á` ocupa 2).
- A `chave` aceita no máximo 255 caracteres.
- O `textoCifrado` deve conter apenas `0` e `1`, com tamanho múltiplo de 8, e no máximo 2048 caracteres.

Quando alguma regra é violada, a API responde com status `400`:

```json
{
  "error": "A chave deve ter o mesmo tamanho do texto claro (3 bytes), mas tem 1."
}
```