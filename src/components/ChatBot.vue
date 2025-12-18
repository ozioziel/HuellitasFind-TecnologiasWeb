<template>
  <div class="chatbot">
    <div class="chat-header">
      <h3>🐾 Asistente PetFind</h3>
    </div>

    <div class="mensajes" ref="mensajesContainer">
      <div v-for="(msg, i) in mensajes" :key="i" :class="['mensaje', msg.role]">
        <strong>{{ msg.role === 'user' ? 'Tú' : '🤖 Asistente' }}:</strong>
        <span>{{ msg.content }}</span>
      </div>
      
      <div v-if="cargando" class="mensaje assistant typing">
        <strong>🤖 Asistente:</strong>
        <span class="dots">
          <span>.</span><span>.</span><span>.</span>
        </span>
      </div>

      <div v-if="error" class="mensaje error">
        <strong>⚠️ Error:</strong>
        <span>{{ error }}</span>
      </div>
    </div>

    <div class="input-container">
      <input 
        v-model="mensaje" 
        @keyup.enter="enviar" 
        placeholder="Escribe tu consulta sobre mascotas..." 
        :disabled="cargando"
      />
      <button @click="enviar" :disabled="cargando || !mensaje.trim()">
        {{ cargando ? '⏳' : '📤' }} Enviar
      </button>
    </div>
  </div>
</template>

<script>
import { ref, nextTick, onMounted } from "vue";
import { obtenerRespuesta } from "../composables/useChat.js";

export default {
  name: "ChatBot",
  setup() {
    const mensaje = ref("");
    const mensajes = ref([]);
    const cargando = ref(false);
    const error = ref("");
    const mensajesContainer = ref(null);

    // Scroll automático al último mensaje
    const scrollToBottom = () => {
      nextTick(() => {
        if (mensajesContainer.value) {
          mensajesContainer.value.scrollTop = mensajesContainer.value.scrollHeight;
        }
      });
    };

    // Mensaje de bienvenida
    onMounted(() => {
      mensajes.value.push({
        role: "assistant",
        content: "¡Hola! 👋 Soy el asistente de PetFind. ¿En qué puedo ayudarte hoy?"
      });
    });

    const enviar = async () => {
      if (!mensaje.value.trim() || cargando.value) return;

      const textoMensaje = mensaje.value.trim();
      error.value = "";

      // Agregar mensaje del usuario
      mensajes.value.push({ role: "user", content: textoMensaje });
      mensaje.value = ""; // Limpiar input inmediatamente
      scrollToBottom();

      cargando.value = true;

      try {
        // Obtener respuesta desde el backend
        const respuesta = await obtenerRespuesta(textoMensaje);
        mensajes.value.push({ role: "assistant", content: respuesta });
      } catch (e) {
        console.error("Error en enviar:", e);
        error.value = "No pude conectarme al servidor. Verifica que esté corriendo.";
        mensajes.value.push({ 
          role: "assistant", 
          content: "Ocurrió un error al procesar tu consulta. Por favor, intenta de nuevo." 
        });
      } finally {
        cargando.value = false;
        scrollToBottom();
      }
    };

    return { 
      mensaje, 
      mensajes, 
      cargando, 
      error, 
      enviar, 
      mensajesContainer 
    };
  }
};
</script>

<style scoped>
.chatbot {
  max-width: 600px;
  margin: 2rem auto;
  border: 2px solid #4a90e2;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: white;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  text-align: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.mensajes {
  min-height: 400px;
  max-height: 500px;
  padding: 1rem;
  overflow-y: auto;
  background: #f9f9f9;
}

.mensaje {
  margin-bottom: 0.8rem;
  padding: 0.75rem;
  border-radius: 8px;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user {
  background: #e3f2fd;
  text-align: right;
  margin-left: 20%;
  border-bottom-right-radius: 2px;
}

.assistant {
  background: #f1f1f1;
  text-align: left;
  margin-right: 20%;
  border-bottom-left-radius: 2px;
}

.error {
  background: #ffebee;
  color: #c62828;
  text-align: center;
}

.typing .dots span {
  animation: blink 1.4s infinite;
  animation-fill-mode: both;
}

.typing .dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing .dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%, 80%, 100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}

.mensaje strong {
  display: block;
  margin-bottom: 0.3rem;
  font-size: 0.85rem;
  opacity: 0.8;
}

.input-container {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border-top: 1px solid #ddd;
}

input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.3s;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

button:active:not(:disabled) {
  transform: translateY(0);
}
</style>