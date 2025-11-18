<template>
  <section id="galeria">
    <h2>Galería de Huellitas</h2>

    <div class="carrusel">
      <img 
        v-for="(img, index) in imagenes" 
        :key="index" 
        :src="img.src" 
        :alt="img.alt" 
        @click="$emit('video-seleccionado', img.video)" 
      />
    </div>

   
    <div id="Videos_Galeria" v-if="videoSeleccionado">
      <video
        :key="videoSeleccionado"
        width="400"
        controls
        autoplay
      >
        <source :src="videoSeleccionado" type="video/mp4" />
        Tu navegador no soporta la reproducción de videos.
      </video>
    </div>
  </section>
</template>

<script setup>

const props = defineProps({
  imagenes: {
    type: Array,
    required: true
  },
  videoSeleccionado: {
    type: String,
    required: false
  }
})
</script>
