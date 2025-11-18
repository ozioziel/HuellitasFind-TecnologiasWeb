<template>
  <section id="equipo">
    <h2>Nuestro equipo</h2>
    <div class="miembros">
      <div class="miembro" v-for="(miembro, index) in miembros" :key="index">
        <img :src="miembro.img" :alt="miembro.nombre" />
        <p>{{ miembro.nombre }}</p>
        <p>{{ miembro.cargo }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>

const props = defineProps({
  miembros: {
    type: Array,
    required: true
  }
})
</script>
