<template>
  <header>
    <img src="./assets/logo.jpeg" alt="Logo Huellitas" id="logo">
    <h1>Reservas Huellitas 🐕</h1>
    <p>{{ fechaHora }}</p>
    <p>{{ diaSemanaTexto }}</p>

    <nav>
      <a href="#galeria">Galería</a>
      <a href="#servicios">Servicios</a>
      <a href="#reserva">Reservar</a>
      <a href="#equipo">Equipo</a>
    </nav>
  </header>

  <main>
    <Galeria :imagenes="imagenes" 
    @video-seleccionado="videoSeleccionado = $event" 
    :video-seleccionado="videoSeleccionado"/>
    
    <Servicios :servicios="servicios"/>
    <Reserva :servicios="servicios"/>
    <Equipo :miembros="equipo"/>
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

import { imagenes } from './data/imagenes';
import { equipo } from './data/equipo';
import { servicios } from './data/servicios';

const fechaHora = ref("");
const diaSemanaTexto = ref("");
const year = ref(new Date().getFullYear());
const videoSeleccionado = ref("")

function actualizarFechaHora() {
  const now = new Date(); 
  const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  fechaHora.value = `${now.toLocaleDateString('es-ES', opciones)} — ${now.toLocaleTimeString('es-ES')}`;

  const dias = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  const dia = now.getDay();
  diaSemanaTexto.value = (dia === 0 || dia === 6) ? `${dias[dia]} (fin de semana)` : `${dias[dia]} (día laboral)`;
}

onMounted(() => {
  actualizarFechaHora();
  setInterval(actualizarFechaHora, 30000);
});
</script>


<style src="./style.css"></style>
