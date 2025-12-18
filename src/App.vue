<template>
  <header>
  
    <h1>Reservas Huellitas 🐕</h1>
    <p>{{ fechaHora }}</p>
    <p>{{ diaSemanaTexto }}</p>

    <nav>
      <a href="#galeria">Galería</a>
      <a href="#servicios">Servicios</a>
      <a href="#ubicacion">Ubicación</a>
      <a href="#reserva">Reservar</a>
      <a href="#equipo">Equipo</a>
    </nav>
  </header>

  <main>
    <section id="galeria">
      <Galeria
        :imagenes="imagenes"
        @video-seleccionado="videoSeleccionado = $event"
        :video-seleccionado="videoSeleccionado"
      />
    </section>

    <section id="servicios">
      <Servicios :servicios="servicios" />
    </section>

    <section id="ubicacion">
      <Ubicacion />
    </section>

    <section id="reserva">
      <Reserva :servicios="servicios" />
    </section>

    <section id="equipo">
      <Equipo :miembros="equipo" />
    </section>


    <section id="chatbot">
      <ChatBot />
    </section>
  </main>

  <footer>
    <p>© {{ year }} Huellitas - Amor y cuidado animal</p>
  </footer>
</template>

<script setup>
import { ref, onMounted } from "vue";

import Galeria from "./components/Galeria.vue";
import Servicios from "./components/Servicios.vue";
import Reserva from "./components/Reserva.vue";
import Equipo from "./components/Equipo.vue";
import Ubicacion from "./components/Ubicacion.vue";
import ChatBot from "./components/ChatBot.vue";  

import { imagenes } from "./data/imagenes";
import { equipo } from "./data/equipo";
import { servicios } from "./data/servicios";

const fechaHora = ref("");
const diaSemanaTexto = ref("");
const year = ref(new Date().getFullYear());
const videoSeleccionado = ref("");

function actualizarFechaHora() {
  const now = new Date();
  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  fechaHora.value = `${now.toLocaleDateString(
    "es-ES",
    opciones
  )} — ${now.toLocaleTimeString("es-ES")}`;

  const dias = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];

  const dia = now.getDay();
  diaSemanaTexto.value =
    dia === 0 || dia === 6
      ? `${dias[dia]} (fin de semana)`
      : `${dias[dia]} (día laboral)`;
}

onMounted(() => {
  actualizarFechaHora();
  setInterval(actualizarFechaHora, 30000);
});
</script>

<style src="./style.css"></style>
