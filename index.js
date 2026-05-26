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
                function navegar() {
                    let input = document.getElementById('urlInput').value.trim();
                    if (!input) return;

                    let destino = input;

                    // Detectar si es una URL válida o si el usuario está buscando algo
                    const esUrl = input.includes('.') && !input.includes(' ');

                    if (esUrl) {
                        if (!input.startsWith('http://') && !input.startsWith('https://')) {
                            destino = 'https://' + input;
                        }
                    } else {
                        // Si no es URL, lo mandamos al buscador de Google cifrado
                        destino = 'https://www.google.com/search?q=' + encodeURIComponent(input);
                    }

                    document.getElementById('browserFrame').src = '/proxy?url=' + encodeURIComponent(destino);
                }

                document.getElementById('urlInput').addEventListener('keypress', function (e) {
                    if (e.key === 'Enter') navegar();
                });
            </script>
        </body>
        </html>
    `);
});

app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send('Falta la URL');

    try {
        const response = await axios.get(targetUrl, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);

        $('head').prepend(`
            <script>
                if (window.top !== window.self) { window.top.location = null; }
            </script>
        `);

        res.send($.html());
    } catch (error) {
        res.status(500).send('No se pudo cargar la página. Nota: Google y otras webs ultra-protegidas pueden bloquear peticiones automáticas de servidores gratuitos.');
    }
});

app.listen(PORT, () => console.log('Navegador listo'));
