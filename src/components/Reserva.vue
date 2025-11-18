<template>
  <section id="reserva">
    <h2>Haz tu reserva</h2>
    <form @submit.prevent="crearReserva">
      <label>Tu nombre:</label>
      <input type="text" v-model="nombre" required />

      <label>Fecha:</label>
      <input type="date" v-model="fecha" required />

      <label>Hora:</label>
      <input type="time" v-model="hora" required />

      <label>Servicio:</label>
      <select v-model="servicioId">

        <option v-for="s in servicios" :key="s.id" :value="s.id">{{ s.nombre }}</option>
      </select>

      <button type="submit">Reservar</button>
    </form>
    <div id="resultado" :style="{color: resultadoColor}">{{ resultado }}</div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  servicios: {
    type: Array,
    required: true
  }
})

const nombre = ref('')
const fecha = ref('')
const hora = ref('')

let IdPrimerServicio = 1
if (props.servicios.length > 0) {
  IdPrimerServicio = props.servicios[0].id
}

const servicioId = ref(IdPrimerServicio)

const resultado = ref('')
const resultadoColor = ref('green')

function esValida(fechaReserva) {
  const hoy = new Date()
  const fr = new Date(fechaReserva + 'T00:00:00')
  return fr >= new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
}

function crearReserva() {
  if (!esValida(fecha.value)) {
    resultado.value = '❌ La fecha debe ser igual o posterior a hoy.'
    resultadoColor.value = 'red'
    return
  }
  const servicio = props.servicios.find(s => s.id === servicioId.value)
  resultado.value = `✔ Reserva creada: ${nombre.value} — ${fecha.value} ${hora.value} (Servicio: ${servicio.nombre})`
  resultadoColor.value = 'green'
}
</script>
