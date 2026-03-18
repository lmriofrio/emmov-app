$(document).ready(function () {
    console.log('📌 Inicializando sistema de turnos persistente...');

    // Elementos del DOM
    const sonido = document.getElementById('sonidoTurno');
    const switchSonido = document.getElementById('switchSonido');
    const tbody = $('#tbody-tramites');

    // Estado del Audio
    let audioHabilitado = localStorage.getItem('sonidoTurnos') === 'true';

    /* =========================
       1️⃣ CONFIGURACIÓN DE AUDIO
       ========================= */
    if (switchSonido) {
        switchSonido.checked = audioHabilitado;
        switchSonido.addEventListener('change', () => {
            audioHabilitado = switchSonido.checked;
            localStorage.setItem('sonidoTurnos', audioHabilitado);
            if (audioHabilitado) intentarDesbloquearAudio();
        });
    }

    /* =========================
       1️⃣ CONFIGURACIÓN DE AUDIO
       ========================= */
    const intentarDesbloquearAudio = async () => {
        if (audioHabilitado && sonido) {
            try {
                // Guardamos el volumen original (por si no es 1)
                const volumenOriginal = sonido.volume;

                sonido.muted = true; // Silenciamos para el desbloqueo
                await sonido.play();
                sonido.pause();
                sonido.currentTime = 0;
                sonido.muted = false; // Restauramos para cuando llegue el SSE
                sonido.volume = volumenOriginal;

                console.log('🔓 Canal de audio verificado en silencio');
            } catch (err) {
                console.warn('⚠️ Audio bloqueado por el navegador.');
            }
        }
    };

    document.addEventListener('click', intentarDesbloquearAudio, { once: false });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            console.log('👁️ Pestaña activa, refrescando permisos de audio...');
            intentarDesbloquearAudio();
        }
    });

    /* =========================
       2️⃣ CARGA INICIAL (AJAX) - SE MANTIENE
       ========================= */
    function cargarDatosIniciales() {
        $.ajax({
            type: 'GET',
            url: '/visualizar-turnos-matriculacion-en-atencion',
            success: function (response) {
                console.log('✅ Carga AJAX inicial exitosa');
                tbody.empty();
                if (response.success) {
                    let numeroFila = 1;
                    response.data.forEach(item => {
                        tbody.append(`
                            <tr data-funcionario="${String(item.id_funcionario)}">
                                <td class="text-center">${numeroFila++}</td>
                                <td class="text-start">${item.nombre_funcionario_corto}</td>
                                <td class="placa text-center fw-semibold">
                                    ${item.placa_en_atención || '-'}
                                </td>
                            </tr>
                        `);
                    });
                }
            },
            error: (xhr) => console.error('❌ Error en carga AJAX:', xhr)
        });
    }

    cargarDatosIniciales();

    /* =========================
       3️⃣ SSE (AUTORECONECTABLE)
       ========================= */
    let eventSource;

    function iniciarSSE() {
        if (eventSource) {
            eventSource.close();
        }

        eventSource = new EventSource('/sse-tramites');
        console.log('📡 Conectando a SSE...');

        eventSource.onopen = () => console.log('✅ Conexión SSE establecida');

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.tipo !== 'tramite_en_atencion') return;

            const fila = document.querySelector(`tr[data-funcionario="${String(data.id_funcionario)}"]`);
            if (!fila) return;

            const celdaPlaca = fila.querySelector('.placa');
            const placaActual = celdaPlaca.textContent.trim();
            const placaNueva = (data.placa || '').trim();

            if (placaActual !== placaNueva) {
                console.log(`🔔 Cambio detectado: ${placaActual} -> ${placaNueva}`);

                // 1. Actualizar el texto
                celdaPlaca.textContent = placaNueva;

                // 2. APLICAR RESALTADO VISUAL (NUEVO)
                fila.classList.remove('resaltar-fila'); // Reiniciar si ya existía
                void fila.offsetWidth;                  // Forzar reflow para que la animación se repita
                fila.classList.add('resaltar-fila');    // Disparar animación CSS

                // 3. Reproducir sonido
                if (audioHabilitado && sonido) {
                    sonido.pause();
                    sonido.currentTime = 0;
                    sonido.play().catch(e => console.error('🚫 El navegador bloqueó el sonido:', e));
                }
            }
        };

        eventSource.onerror = (err) => {
            console.error('❌ Error SSE. Reintentando en 5 segundos...');
            eventSource.close();
            setTimeout(iniciarSSE, 5000);
        };
    }

    iniciarSSE();

    if ('wakeLock' in navigator) {
        let lock = null;
        const requestLock = async () => {
            try { lock = await navigator.wakeLock.request('screen'); } catch (e) { }
        };
        requestLock();
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') requestLock();
        });
    }
});