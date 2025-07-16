(function () {
  // 🗣️ Activa el motor de voz tras el primer clic del usuario
  let vozHabilitada = false;
  window.addEventListener('click', () => {
    if (!vozHabilitada) {
      vozHabilitada = true;
      speechSynthesis.speak(new SpeechSynthesisUtterance(''));
    }
  }, { once: true });

  const scriptTag = document.currentScript;
  if (!scriptTag) return;
  const apiKey = scriptTag.getAttribute('data-apikey');
  if (!apiKey) return console.error('❌ No se encontró la API Key');

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
      aplicarConfiguracion(config);
    })
    .catch(err => {
      console.error('❌ Error:', err.message);
    });

  function aplicarConfiguracion(config) {
    if (config.fuente === 'OpenDyslexic') {
      document.body.style.fontFamily = '"OpenDyslexic", sans-serif';
      cargarFuenteCDN();
    }
    if (config.tamanoLetra === 'grande') {
      document.body.style.fontSize = '1.3em';
    }
  }

  function cargarFuenteCDN() {
    if (document.getElementById('open-dyslexic-link')) return;
    const link = document.createElement('link');
    link.id = 'open-dyslexic-link';
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/gh/antijingoist/open-dyslexic@v1.0.0/open-dyslexic.css';
    document.head.appendChild(link);
  }

  function crearWidget() {
    const btn = document.createElement('button');
    btn.innerHTML = '♿️';
    btn.title = 'Opciones de accesibilidad';
    Object.assign(btn.style, {
      position: 'fixed', bottom: '20px', right: '20px', zIndex: '9999',
      width: '45px', height: '45px', borderRadius: '50%', border: 'none',
      backgroundColor: '#0066cc', color: '#fff', fontSize: '20px', cursor: 'pointer'
    });
    document.body.appendChild(btn);

    const panel = document.createElement('div');
    Object.assign(panel.style, {
      display: 'none', position: 'fixed', bottom: '80px', right: '20px',
      background: '#fff', border: '2px solid #000', borderRadius: '10px',
      padding: '10px', zIndex: '10000'
    });

    let fontSize = 100;
    const btnLetra = document.createElement('button');
    btnLetra.textContent = `Letra (${fontSize}%)`;
    btnLetra.onclick = () => {
      fontSize = fontSize < 200 ? fontSize + 10 : 100;
      document.body.style.fontSize = `${fontSize}%`;
      btnLetra.textContent = `Letra (${fontSize}%)`;
    };

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

    const btnContraste = document.createElement('button');
    btnContraste.textContent = 'Contraste';
    btnContraste.onclick = () => {
      const active = document.body.classList.toggle('contraste-activo');
      document.body.style.backgroundColor = active ? '#000' : '';
      document.body.style.color = active ? '#fff' : '';
    };

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

    [btnLetra, btnFuente, btnContraste, btnReset].forEach(b => {
      Object.assign(b.style, {
        display: 'block', margin: '6px 0', width: '100%', padding: '6px'
      });
      panel.appendChild(b);
    });

    document.body.appendChild(panel);
    btn.onclick = () => {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    };
  }

  function activarAvisoEnImagenes() {
    const imagenes = document.querySelectorAll('img');

    imagenes.forEach(img => {
      const alt = img.getAttribute('alt');
      const texto = alt && alt.trim() !== '' ? alt : 'Imagen sin descripción';

      // Evita duplicar eventos e íconos
      if (img._bocinaAgregada) return;
      img._bocinaAgregada = true;

      // Contenedor para posicionar bocina solo al hacer hover
      const contenedor = document.createElement('span');
      contenedor.style.position = 'relative';
      img.parentNode.insertBefore(contenedor, img);
      contenedor.appendChild(img);

      const icono = document.createElement('span');
      icono.textContent = '🔊';
      icono.title = texto;
      icono.classList.add('icono-bocina');
      Object.assign(icono.style, {
        position: 'absolute', top: '0px', right: '0px', background: '#fff',
        borderRadius: '50%', fontSize: '16px', padding: '2px 4px', cursor: 'pointer',
        display: 'none', boxShadow: '0 0 3px rgba(0,0,0,0.3)', zIndex: '10'
      });

      icono.onclick = () => {
        if (!vozHabilitada) return;
        const mensaje = new SpeechSynthesisUtterance(texto);
        mensaje.lang = 'es-ES';
        const voces = speechSynthesis.getVoices();
        const vozEspanol = voces.find(v => v.lang.startsWith('es'));
        if (vozEspanol) mensaje.voice = vozEspanol;
        speechSynthesis.cancel();
        speechSynthesis.speak(mensaje);
      };

      contenedor.appendChild(icono);

      img.addEventListener('mouseenter', () => {
        icono.style.display = 'inline-block';
      });

      img.addEventListener('mouseleave', () => {
        icono.style.display = 'none';
      });
    });
  }

  let lastMouseEvent = null;
  document.addEventListener('mousemove', e => {
    lastMouseEvent = e;
  });

  crearWidget();
  activarAvisoEnImagenes();
})();
