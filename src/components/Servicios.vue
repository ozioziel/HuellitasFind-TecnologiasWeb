<template>
  <section id="servicios">
    <h2>Servicios disponibles</h2>
    <ul>
      <li v-for="s in servicios" :key="s.id">{{ s.nombre }} — {{ s.duracion }} min</li>
    </ul>
  </section>
</template>

<script setup>

const props = defineProps({
  servicios: {
    type: Array,
    required: true
  }
})
</script>
