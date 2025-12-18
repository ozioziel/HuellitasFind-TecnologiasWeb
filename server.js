import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import http from "http";

dotenv.config();

const app = express();
const server = http.createServer(app);


app.use(cors());
app.use(express.json());

const WIT_TOKEN = process.env.WIT_TOKEN;
const ARDUINO_PORT = process.env.ARDUINO_PORT || "COM4";

if (!WIT_TOKEN) {
  console.error("❌ ERROR: WIT_TOKEN no encontrado en .env");
  process.exit(1);
}

let arduinoPort;
let arduinoConnected = false;
let ultimasCoordenadasGPS = { lat: null, lon: null };

try {
  arduinoPort = new SerialPort({
    path: ARDUINO_PORT,
    baudRate: 9600,
  });

  const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: "\n" }));

  arduinoPort.on("open", () => {
    console.log("✅ Arduino conectado en puerto:", ARDUINO_PORT);
    arduinoConnected = true;
  });

  arduinoPort.on("error", (err) => {
    console.error("❌ Error con Arduino:", err.message);
    arduinoConnected = false;
  });

  parser.on("data", (data) => {
    const linea = data.trim();
    console.log("📥 Arduino dice:", linea);


    let coords;
    
    if (linea.startsWith("GPS:")) {
      coords = linea.replace("GPS:", "").split(",");
    } else if (linea.includes(",")) {
   
      coords = linea.split(",");
    }

    if (coords && coords.length === 2) {
      const lat = parseFloat(coords[0].trim());
      const lon = parseFloat(coords[1].trim());

      if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        ultimasCoordenadasGPS = { lat, lon };
        console.log(`📍 GPS actualizado: Lat ${lat}, Lon ${lon}`);

        broadcastGPS(lat, lon);
      } else {
        console.log("⚠️ Coordenadas inválidas:", lat, lon);
      }
    }
  });
} catch (err) {
  console.warn("⚠️ Arduino no conectado:", err.message);
  arduinoConnected = false;
}


const wss = new WebSocketServer({ server });

function broadcastGPS(lat, lon) {
  const mapsLink = `https://www.google.com/maps?q=${lat},${lon}`;
  const mensaje = JSON.stringify({ lat, lon, mapsLink });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) { 
      client.send(mensaje);
    }
  });
}

wss.on("connection", (ws) => {
  console.log("🔌 Cliente WebSocket conectado");

  
  if (ultimasCoordenadasGPS.lat && ultimasCoordenadasGPS.lon) {
    const mapsLink = `https://www.google.com/maps?q=${ultimasCoordenadasGPS.lat},${ultimasCoordenadasGPS.lon}`;
    ws.send(JSON.stringify({ ...ultimasCoordenadasGPS, mapsLink }));
  }

  ws.on("close", () => {
    console.log("🔌 Cliente WebSocket desconectado");
  });
});


app.post("/chat", async (req, res) => {
  const mensaje = req.body.mensaje;

  if (!mensaje || !mensaje.trim()) {
    return res.json({ respuesta: "No enviaste ningún mensaje." });
  }

  try {
    const witRes = await fetch(
      `https://api.wit.ai/message?v=20251215&q=${encodeURIComponent(mensaje)}`,
      {
        headers: {
          Authorization: `Bearer ${WIT_TOKEN}`,
        },
      }
    );

    if (!witRes.ok) {
      throw new Error(`Wit.ai respondió con status ${witRes.status}`);
    }

    const witData = await witRes.json();
    console.log("Respuesta de Wit.ai:", JSON.stringify(witData, null, 2));

    let respuesta = "No entendí tu consulta. ¿Puedes reformularla?";
    let entityDetectada = null;
    let confidence = 0;

    const entities = witData.entities || {};

    if (entities["petfind_saludo:petfind_saludo"]?.[0]) {
      const entity = entities["petfind_saludo:petfind_saludo"][0];
      entityDetectada = "saludo";
      confidence = entity.confidence || 0;

      if (confidence > 0.7) {
        respuesta = "¡Hola! 👋 Bienvenido a PetFind. ¿En qué puedo ayudarte con tu mascota hoy?";
      }
    }
  
    else if (entities["petfind_precio:petfind_precio"]?.[0]) {
      const entity = entities["petfind_precio:petfind_precio"][0];
      entityDetectada = "precio";
      confidence = entity.confidence || 0;

      if (confidence > 0.7) {
        respuesta = "📋 Nuestros precios son:\n• Consulta veterinaria: $500\n• Vacunas: $300\n• Baño y peluquería: $200\n\n¿Te gustaría agendar una cita?";
      }
    }

    else if (entities["petfind_horario:petfind_horario"]?.[0]) {
      const entity = entities["petfind_horario:petfind_horario"][0];
      entityDetectada = "horario";
      confidence = entity.confidence || 0;

      if (confidence > 0.7) {
        respuesta = "🕐 Nuestro horario de atención es:\n• Lunes a Viernes: 9:00 - 18:00 hs\n• Sábados: 9:00 - 13:00 hs\n• Domingos: Cerrado";
      }
    }

    else if (entities["petfind_adopcion:petfind_adopcion"]?.[0]) {
      const entity = entities["petfind_adopcion:petfind_adopcion"][0];
      entityDetectada = "adopcion";
      confidence = entity.confidence || 0;

      if (confidence > 0.7) {
        respuesta = "🐕🐈 ¡Tenemos adorables mascotas esperando un hogar!\n\nPuedes ver todas las mascotas disponibles para adopción en nuestro catálogo. ¿Te gustaría saber más sobre alguna en particular?";
      }
    }
   
    else if (entities["petfind_ubicacion:petfind_ubicacion"]?.[0]) {
      const entity = entities["petfind_ubicacion:petfind_ubicacion"][0];
      entityDetectada = "ubicacion";
      confidence = entity.confidence || 0;

      if (confidence > 0.7) {
        if (ultimasCoordenadasGPS.lat && ultimasCoordenadasGPS.lon) {
          respuesta = `📍 Nuestra ubicación actual es:\nLat: ${ultimasCoordenadasGPS.lat}\nLon: ${ultimasCoordenadasGPS.lon}\n\n¿Te gustaría verlo en el mapa?`;
        } else {
          respuesta = "📍 Nos encontramos en:\nAv. Principal 123, La Paz, Bolivia\n\n¿Te gustaría que te enviemos la ubicación exacta en el mapa?";
        }
      }
    }

    else if (entities["petfind_despedida:petfind_despedida"]?.[0]) {
      const entity = entities["petfind_despedida:petfind_despedida"][0];
      entityDetectada = "despedida";
      confidence = entity.confidence || 0;

      if (confidence > 0.7) {
        respuesta = "¡Hasta pronto! 👋 Si necesitas algo más, no dudes en escribirme. ¡Que tengas un excelente día! 🐾";
      }
    }

    res.json({
      respuesta,
      debug: {
        entityDetectada,
        confidence,
        allEntities: Object.keys(entities),
      },
    });
  } catch (err) {
    console.error("Error con Wit.ai:", err);
    res.status(500).json({
      respuesta: "Error al procesar tu mensaje. Por favor, intenta de nuevo.",
      error: err.message,
    });
  }
});


app.get("/gps", (req, res) => {
  if (ultimasCoordenadasGPS.lat && ultimasCoordenadasGPS.lon) {
    res.json({
      ...ultimasCoordenadasGPS,
      mapsLink: `https://www.google.com/maps?q=${ultimasCoordenadasGPS.lat},${ultimasCoordenadasGPS.lon}`,
    });
  } else {
    res.json({ error: "No hay coordenadas GPS disponibles" });
  }
});


app.get("/", (req, res) => {
  res.json({
    mensaje: "Backend funcionando ✅",
    arduino: arduinoConnected ? "Conectado" : "Desconectado",
    gps: ultimasCoordenadasGPS.lat ? "Disponible" : "Sin señal",
    websocket: `Clientes conectados: ${wss.clients.size}`,
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor HTTP corriendo en http://localhost:${PORT}`);
  console.log(`WebSocket corriendo en ws://localhost:${PORT}`);
  console.log(`Arduino: ${arduinoConnected ? "Conectado" : "Desconectado"}`);
});