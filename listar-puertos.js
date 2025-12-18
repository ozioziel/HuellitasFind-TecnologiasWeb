import { SerialPort } from "serialport";

SerialPort.list().then(
  ports => {
    console.log("Puertos disponibles:");
    ports.forEach(port => {
      console.log(`${port.path} - ${port.manufacturer || "Desconocido"}`);
    });
  },
  err => {
    console.error("Error al listar puertos:", err);
  }
);
