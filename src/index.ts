import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { validApiKeys } from './apiKeys';


const app = express();

// Habilita CORS (puedes quitarlo si no es necesario)
app.use(cors());

// Sirve archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint raíz para comprobar que el servidor funciona
app.get('/', (req, res) => {
  res.send('✅ API DE ACCESIBILIDAD FUNCIONANDO');
});

// Endpoint protegido con API Key
app.get('/configuracion', (req, res) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || typeof apiKey !== 'string') {
    return res.status(400).json({ error: '❌ Se requiere una clave API válida' });
  }

  if (!validApiKeys.includes(apiKey)) {
    return res.status(403).json({ error: '⛔ Clave API no válida' });
  }

  const configuracion = {
    contraste: true,
    fuente: 'OpenDyslexic',
    tamanoLetra: 'grande',
  };

  res.json(configuracion);
});

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
