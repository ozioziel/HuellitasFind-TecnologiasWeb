<template>
  <section class="ubicacion">
    <h2>📍 Ubicación GPS</h2>

    <div v-if="lat !== null && lon !== null" class="gps-data">
      <p class="coordenadas">
        <strong>Latitud:</strong> {{ lat }}<br />
        <strong>Longitud:</strong> {{ lon }}
      </p>

      <button @click="abrirGoogleMaps" class="btn-maps">
        🗺️ Ver en Google Maps
      </button>
    </div>

    <div v-else class="loading">
      <p>⏳ Esperando coordenadas del Arduino...</p>
      <small>Asegúrate de que el Arduino esté conectado y el GPS tenga señal</small>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const lat = ref(null);
const lon = ref(null);
const mapsLink = ref(null);
let ws = null;

function abrirGoogleMaps() {
  if (mapsLink.value) {
    window.open(mapsLink.value, "_blank");
  }
}

onMounted(() => {

  ws = new WebSocket("ws://localhost:3000");

  ws.onopen = () => {
    console.log("✅ Conectado al WebSocket del servidor");
  };

  ws.onmessage = (event) => {
    console.log("📩 Datos GPS recibidos:", event.data);

    try {
      const data = JSON.parse(event.data);

      if (data.lat && data.lon) {
        lat.value = data.lat;
        lon.value = data.lon;
        mapsLink.value = data.mapsLink;
        console.log(`📍 Coordenadas actualizadas: Lat ${data.lat}, Lon ${data.lon}`);
      }
    } catch (err) {
      console.error("❌ Error parseando mensaje WebSocket:", err);
    }
  };

  ws.onerror = (err) => {
    console.error("❌ Error WebSocket:", err);
  };

  ws.onclose = () => {
    console.log("🔌 WebSocket desconectado");
  };
});

onUnmounted(() => {

  if (ws) {
    ws.close();
  }
});
</script>

<style scoped>
.ubicacion {
  margin-top: 2rem;
  padding: 1.5rem;
  border: 2px solid #4CAF50;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-width: 500px;
}

h2 {
  margin-top: 0;
  color: #333;
}

.gps-data {
  text-align: center;
}

.coordenadas {
  font-size: 1.1rem;
  line-height: 1.8;
  margin: 1rem 0;
  padding: 1rem;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.coordenadas strong {
  color: #4CAF50;
}

.btn-maps {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn-maps:hover {
  background-color: #45a049;
}

.btn-maps:active {
  transform: scale(0.98);
}

.loading {
  text-align: center;
  color: #666;
}

.loading p {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.loading small {
  color: #999;
  font-size: 0.9rem;
}
</style>