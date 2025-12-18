
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function obtenerRespuesta(mensaje) {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mensaje }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    return data.respuesta || "No recibí respuesta del servidor.";
  } catch (error) {
    console.error("Error al obtener respuesta:", error);
    throw error;
  }
}