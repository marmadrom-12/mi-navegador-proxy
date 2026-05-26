const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mi Navegador con Buscador</title>
            <style>
                body { margin: 0; font-family: sans-serif; display: flex; flex-direction: column; height: 100vh; background: #202124; overflow: hidden; }
                .bar { display: flex; padding: 10px; background: #35363a; gap: 10px; align-items: center; }
                input { flex: 1; padding: 8px; border: none; border-radius: 4px; font-size: 14px; background: #202124; color: white; border: 1px solid #5f6368; }
                button { padding: 8px 15px; border: none; background: #8ab4f8; color: #202124; border-radius: 4px; cursor: pointer; font-weight: bold; }
                iframe { flex: 1; border: none; background: white; }
            </style>
        </head>
        <body>
            <div class="bar">
                <input type="text" id="urlInput" value="https://www.wikipedia.org" placeholder="Busca en Google o escribe una URL...">
                <button onclick="navegar()">Buscar / Ir</button>
            </div>
            <iframe id="browserFrame" src="/proxy?url=https://www.wikipedia.org"></iframe>

            <script>
