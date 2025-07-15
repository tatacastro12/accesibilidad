♿ Widget de Accesibilidad para Sitios Web

Este script en JavaScript crea un widget accesible que se puede incrustar en cualquier sitio web mediante una <script> con una API Key. Permite a los usuarios mejorar la accesibilidad visual y auditiva del sitio.
🔧 ¿Qué hace este widget?

✔️ Carga una configuración de accesibilidad desde una API
✔️ Aplica automáticamente ajustes iniciales como:

    Tamaño de letra

    Fuente OpenDyslexic (desde CDN)

    Contraste alto (manual)

✔️ Muestra un botón ♿ flotante para abrir un panel de accesibilidad con:

    🔠 Aumentar/Reducir tamaño de letra

    🅰️ Cambiar a fuente OpenDyslexic

    🌓 Activar modo de alto contraste

    ♻️ Restablecer cambios

    🔊 Probar voz (sintetizador de habla)

✔️ Detecta imágenes sin alt y muestra:

    Un tooltip flotante

    Un aviso por voz que dice "Imagen sin descripción"

📦 Estructura del Proyecto

/public
  └── demo.html       // Sitio de prueba para el widget
  └── accesibilidad.js // Script que se incrusta vía <script>
/src
  └── index.ts        // Servidor Express que entrega configuración protegida por API Key

🚀 Cómo usarlo
1. Servidor (Node.js + Express)

Tu backend entrega una configuración al cliente:

GET /configuracion
Headers:
  x-api-key: TU_API_KEY

Ejemplo de respuesta:

{
  "fuente": "OpenDyslexic",
  "tamanoLetra": "grande",
  "contraste": false
}

2. Cliente (HTML)

Incrusta este script en tu sitio web:

<script 
  src="http://localhost:3000/accesibilidad.js" 
  data-apikey="TU_API_KEY">
</script>

    ⚠️ Cambia la URL por la de tu servidor si estás en producción.

📢 Dependencias

    Usa la API Web speechSynthesis para hablar.

    Carga la fuente OpenDyslexic desde un CDN:
    https://cdn.jsdelivr.net/gh/antijingoist/open-dyslexic

✅ Accesibilidad integrada

Este widget está pensado para:

    Personas con dislexia (tipografía accesible)

    Personas con baja visión (contraste y tamaño)

    Usuarios con lector de pantalla o necesidades auditivas

🧪 Funciones destacadas
Función	Descripción
crearWidget()	Crea el botón ♿ y el panel de controles
aplicarConfiguracion(config)	Aplica configuración de backend
activarAvisoEnImagenes()	Detecta imágenes sin alt y muestra aviso visual + voz
speechSynthesis	Utiliza voz en español para leer “Imagen sin descripción”