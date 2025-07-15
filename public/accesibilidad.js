(function () {
  // Obtiene la etiqueta <script> actual
  const scriptTag = document.currentScript;
  if (!scriptTag) return;

  // Lee la API Key desde el atributo data-apikey del <script>
  const apiKey = scriptTag.getAttribute('data-apikey');
  if (!apiKey) return console.error('❌ No se encontró la API Key');

  // Solicita al backend la configuración inicial de accesibilidad
  fetch('http://localhost:3000/configuracion', {
    headers: {
      'x-api-key': apiKey
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('Error al obtener configuración');
      return res.json();
    })
    .then(config => {
      aplicarConfiguracion(config); // Aplica los ajustes recibidos
    })
    .catch(err => {
      console.error('❌ Error:', err.message);
    });

  // Aplica ajustes como fuente y tamaño de letra según configuración
  function aplicarConfiguracion(config) {
    if (config.fuente === 'OpenDyslexic') {
      document.body.style.fontFamily = '"OpenDyslexic", sans-serif';
      cargarFuenteCDN(); // Carga la fuente desde CDN si no está ya cargada
    }

    if (config.tamanoLetra === 'grande') {
      document.body.style.fontSize = '1.3em';
    }
  }

  // Inserta el <link> de la fuente OpenDyslexic desde un CDN
  function cargarFuenteCDN() {
    if (document.getElementById('open-dyslexic-link')) return;

    const link = document.createElement('link');
    link.id = 'open-dyslexic-link';
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/gh/antijingoist/open-dyslexic@v1.0.0/open-dyslexic.css';
    document.head.appendChild(link);
  }

  // Crea el botón ♿ y el panel de accesibilidad flotante
  function crearWidget() {
    // Botón flotante ♿
    const btn = document.createElement('button');
    btn.innerHTML = '♿️';
    btn.title = 'Opciones de accesibilidad';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = '9999';
    btn.style.width = '45px';
    btn.style.height = '45px';
    btn.style.borderRadius = '50%';
    btn.style.border = 'none';
    btn.style.backgroundColor = '#0066cc';
    btn.style.color = '#fff';
    btn.style.fontSize = '20px';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);

    // Panel emergente con controles
    const panel = document.createElement('div');
    panel.style.display = 'none';
    panel.style.position = 'fixed';
    panel.style.bottom = '80px';
    panel.style.right = '20px';
    panel.style.background = '#fff';
    panel.style.border = '2px solid #000';
    panel.style.borderRadius = '10px';
    panel.style.padding = '10px';
    panel.style.zIndex = '10000';

    // Botón para aumentar/reducir tamaño de letra
    let fontSize = 100;
    const btnLetra = document.createElement('button');
    btnLetra.textContent = `Letra (${fontSize}%)`;
    btnLetra.onclick = () => {
      fontSize = fontSize < 200 ? fontSize + 10 : 100;
      document.body.style.fontSize = `${fontSize}%`;
      btnLetra.textContent = `Letra (${fontSize}%)`;
    };

    // Botón para activar/desactivar fuente OpenDyslexic
    const btnFuente = document.createElement('button');
    btnFuente.textContent = 'Fuente Dyslexic';
    btnFuente.onclick = () => {
      const isActive = document.body.classList.toggle('fuente-dyslexic');
      if (isActive) {
        document.body.style.fontFamily = '"OpenDyslexic", sans-serif';
        cargarFuenteCDN();
      } else {
        document.body.style.fontFamily = '';
      }
    };

    // Botón para alternar modo de alto contraste
    const btnContraste = document.createElement('button');
    btnContraste.textContent = 'Contraste';
    btnContraste.onclick = () => {
      const active = document.body.classList.toggle('contraste-activo');
      document.body.style.backgroundColor = active ? '#000' : '';
      document.body.style.color = active ? '#fff' : '';
    };

    // Botón para restablecer todos los cambios
    const btnReset = document.createElement('button');
    btnReset.textContent = 'Restablecer';
    btnReset.onclick = () => {
      document.body.style.fontSize = '';
      document.body.style.fontFamily = '';
      document.body.classList.remove('contraste-activo', 'fuente-dyslexic');
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
      fontSize = 100;
      btnLetra.textContent = `Letra (${fontSize}%)`;
    };

    // Botón para probar la voz
    const btnVoz = document.createElement('button');
    btnVoz.textContent = 'Probar Voz';
    btnVoz.onclick = () => {
      const mensaje = new SpeechSynthesisUtterance('Prueba de voz funcionando');
      const voces = speechSynthesis.getVoices();
      const vozEspanol = voces.find(v => v.lang.startsWith('es'));
      if (vozEspanol) mensaje.voice = vozEspanol;
      speechSynthesis.speak(mensaje);
    };

    // Añade botones al panel y aplica estilos
    [btnLetra, btnFuente, btnContraste, btnReset, btnVoz].forEach(b => {
      b.style.display = 'block';
      b.style.margin = '6px 0';
      b.style.width = '100%';
      b.style.padding = '6px';
      panel.appendChild(b);
    });

    document.body.appendChild(panel);

    // Alternar visibilidad del panel al hacer clic en el botón
    btn.onclick = () => {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    };
  }

  // Detecta imágenes sin descripción (alt) y genera aviso visual y sonoro
  function activarAvisoEnImagenes() {
    const imagenes = document.querySelectorAll('img');

    imagenes.forEach(img => {
      img.addEventListener('mouseenter', () => {
        const alt = img.getAttribute('alt');
        if (!alt || alt.trim() === '') {
          const aviso = document.createElement('div');
          aviso.textContent = 'Imagen sin descripción';
          aviso.className = 'tooltip-imagen-accesibilidad';
          aviso.style.position = 'fixed';
          aviso.style.background = 'rgba(0, 0, 0, 0.8)';
          aviso.style.color = '#fff';
          aviso.style.padding = '4px 8px';
          aviso.style.fontSize = '12px';
          aviso.style.borderRadius = '4px';
          aviso.style.zIndex = '9999';
          aviso.style.pointerEvents = 'none';

          document.body.appendChild(aviso);

          const moverTooltip = (e) => {
            aviso.style.top = e.clientY + 15 + 'px';
            aviso.style.left = e.clientX + 15 + 'px';
          };

          if (lastMouseEvent) {
            moverTooltip(lastMouseEvent);
          }

          document.addEventListener('mousemove', moverTooltip);
          img._moverTooltip = moverTooltip;
          img._tooltipAccesibilidad = aviso;

          const mensaje = new SpeechSynthesisUtterance('Imagen sin descripción');

          function hablar() {
            const voces = speechSynthesis.getVoices();
            const vozEspanol = voces.find(v => v.lang.startsWith('es'));
            if (vozEspanol) mensaje.voice = vozEspanol;
            if (speechSynthesis.speaking) {
              speechSynthesis.cancel();
            }
            speechSynthesis.speak(mensaje);
          }

          if (speechSynthesis.getVoices().length === 0) {
            speechSynthesis.addEventListener('voiceschanged', hablar, { once: true });
          } else {
            hablar();
          }
        }
      });

      img.addEventListener('mouseleave', () => {
        const aviso = img._tooltipAccesibilidad;
        if (aviso) {
          aviso.remove();
          delete img._tooltipAccesibilidad;
        }
        document.removeEventListener('mousemove', img._moverTooltip);
      });
    });
  }

  // Guarda el último evento de movimiento del mouse para usar en tooltips
  let lastMouseEvent = null;
  document.addEventListener('mousemove', e => {
    lastMouseEvent = e;
  });

  // Inicia creación del widget y aviso en imágenes
  crearWidget();
  activarAvisoEnImagenes();
})();
