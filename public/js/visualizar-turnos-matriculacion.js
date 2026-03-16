$(document).ready(function () {
    console.log('📌 Documento listo, inicializando...');

    // Elementos del DOM
    const sonido = document.getElementById('sonidoTurno');
    const switchSonido = document.getElementById('switchSonido');
    const tbody = $('#tbody-tramites');

    // Estado del Audio
    let audioDesbloqueado = false;
    let audioHabilitado = localStorage.getItem('sonidoTurnos') === 'true';

    /* =========================
       1️⃣ CONFIGURACIÓN INICIAL
       ========================= */
    if (switchSonido) {
        switchSonido.checked = audioHabilitado;
        switchSonido.addEventListener('change', () => {
            audioHabilitado = switchSonido.checked;
            localStorage.setItem('sonidoTurnos', audioHabilitado);
            console.log('🔄 Sonido ' + (audioHabilitado ? 'HABILITADO' : 'DESHABILITADO'));
        });
    }

    // Función para desbloquear el audio (necesaria para navegadores)
    const desbloquearAudio = async () => {
        if (audioHabilitado && !audioDesbloqueado && sonido) {
            try {
                await sonido.play();
                sonido.pause();
                sonido.currentTime = 0;
                audioDesbloqueado = true;
                console.log('🔓 Canal de audio desbloqueado por interacción');
                document.removeEventListener('click', desbloquearAudio);
            } catch (err) {
                console.warn('⚠️ Haz clic de nuevo para habilitar sonido');
            }
        }
    };
    document.addEventListener('click', desbloquearAudio);

    /* =========================
       2️⃣ CARGA INICIAL (AJAX)
       ========================= */
    $.ajax({
        type: 'GET',
        url: '/visualizar-turnos-matriculacion-en-atencion',
        success: function (response) {
            console.log('✅ Carga inicial exitosa');
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
        error: (xhr) => console.error('❌ Error en carga inicial:', xhr)
    });

    /* =========================
       3️⃣ SSE (TIEMPO REAL) - ÚNICA CONEXIÓN
       ========================= */
    const eventSource = new EventSource('/sse-tramites');
    console.log('📡 Conectando a SSE...');

    eventSource.onopen = () => console.log('✅ Conexión SSE establecida');
    eventSource.onerror = (err) => console.error('❌ Error SSE:', err);

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.tipo !== 'tramite_en_atencion') return;

        const fila = document.querySelector(`tr[data-funcionario="${String(data.id_funcionario)}"]`);
        if (!fila) return;

        const celdaPlaca = fila.querySelector('.placa');
        const placaActual = celdaPlaca.textContent.trim();
        const placaNueva = (data.placa || '').trim();

        // Solo actuar si la placa realmente cambió
        if (placaActual !== placaNueva) {
            console.log(`🔔 Cambio detectado: ${placaActual} -> ${placaNueva}`);
            celdaPlaca.textContent = placaNueva;

            // Reproducir sonido
            if (audioHabilitado) {
                if (audioDesbloqueado && sonido) {
                    sonido.currentTime = 0;
                    sonido.play()
                        .then(() => console.log('🔊 Sonido reproducido con éxito'))
                        .catch(e => console.error('❌ Error al reproducir:', e));
                } else {
                    console.warn('🚫 Sonido ON pero bloqueado. El usuario debe hacer clic en la pantalla.');
                }
            }
        }
    };
});