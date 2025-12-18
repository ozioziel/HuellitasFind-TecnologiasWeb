# Vue 3 + Vite – HuellitasFind

Este proyecto utiliza **Vue 3** con **Vite** para el frontend y se integra con un backend en **Node.js** para la comunicación con un **Arduino** y un módulo **GPS NEO-8M** mediante puerto serie y WebSockets.

---

## Requisitos previos

* **Node.js** (versión actual recomendada)

  * Descargar desde: [https://nodejs.org/en/download/current](https://nodejs.org/en/download/current)
  * Durante la instalación:

    * Aceptar el instalador
    * Marcar la opción **Add to PATH**

* **npm** (incluido con Node.js)

---

## Instalación de Vue

1. Instalar Vue CLI de forma global:

   ```bash
   npm install -g @vue/cli
   ```

2. Crear el proyecto con Vite:

   ```bash
   npm create vite@latest
   ```

3. Seleccionar:

   * Framework: **Vue**
   * Variante: **JavaScript**

4. Entrar al proyecto e instalar dependencias iniciales:

   ```bash
   cd HuellitasFind
   npm install
   ```

---

## Ejecutar el proyecto (modo desarrollo)

Ubicarse dentro de la carpeta **HuellitasFind** y ejecutar:

```bash
npm run dev
```

Salida esperada:

```
ROLLDOWN-VITE v7.2.2  ready in xxxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

Abrir en el navegador:

```
http://localhost:5173/
```

---

## Compilación para producción

Genera los archivos optimizados para producción:

```bash
npm run build
```

Los archivos se crearán en la carpeta `dist/`.

---

## Dependencias adicionales (Backend y comunicación)

Estas librerías se utilizan para la comunicación con Arduino, GPS y el intercambio de datos con el frontend.

### 1. serialport y parser-readline

```bash
npm install serialport @serialport/parser-readline
```

**Descripción:**

* `serialport`: permite la comunicación con dispositivos conectados por puerto serie (Arduino).
* `@serialport/parser-readline`: facilita la lectura de datos línea por línea enviados desde el Arduino.

Uso típico: lectura de coordenadas GPS enviadas por el módulo NEO-8M.

---

### 2. express

```bash
npm install express
```

**Descripción:**

* Framework backend para Node.js.
* Se utiliza para crear un servidor HTTP que actúa como puente entre el frontend (Vue) y el hardware.

---

### 3. cors

```bash
npm install cors
```

**Descripción:**

* Permite solicitudes entre distintos orígenes (por ejemplo, frontend en `localhost:5173` y backend en otro puerto).
* Evita errores de seguridad CORS en el navegador.

---

### 4. ws (WebSocket)

```bash
npm install ws
```

**Descripción:**

* Implementa comunicación en tiempo real mediante WebSockets.
* Se utiliza para enviar las coordenadas GPS del Arduino al frontend sin necesidad de recargar la página.

---

### 5. axios

```bash
npm install axios
```

**Descripción:**

* Cliente HTTP para realizar peticiones desde el frontend.
* Se usa para consumir APIs del backend o servicios externos (por ejemplo, APIs de mapas o procesamiento de datos).

---

## Hardware

En la carpeta **HuellitasFind** se incluye una imagen con el **diagrama de conexión** del módulo **GPS NEO-8M** con el **Arduino**.

Esta conexión permite:

* Obtener latitud y longitud
* Enviar los datos por puerto serie al backend
* Mostrar la ubicación en el frontend (por ejemplo, en Google Maps)

---

## Por implementar

* Visualización del recorrido GPS
* Manejo de errores de conexión con el Arduino
* Almacenamiento de ubicaciones
* Mejorar la UI para seguimiento en tiempo real

---

## Notas

* Asegurarse de que el puerto serie del Arduino sea correcto según el sistema operativo.
* Ejecutar el backend con permisos adecuados para acceder al puerto serie (especialmente en Linux).

---

Proyecto desarrollado con **Vue 3 + Vite + Node.js**.
