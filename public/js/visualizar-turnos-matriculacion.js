$(document).ready(function () {

  /* =========================
     1️⃣ CARGA INICIAL (AJAX)
     ========================= */
  $.ajax({
    type: 'GET',
    url: '/visualizar-turnos-matriculacion-en-atencion',
    success: function (response) {

      const tbody = $('#tbody-tramites');
      tbody.empty();

      if (!response.success) return;

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
  });


  /* =========================
     2️⃣ AUDIO (SWITCH)
     ========================= */
  const sonido = document.getElementById('sonidoTurno');
  const switchSonido = document.getElementById('switchSonido');

  let audioDesbloqueado = false;
  let audioHabilitado = localStorage.getItem('sonidoTurnos') === 'true';

  // restaurar estado visual
  if (switchSonido) {
    switchSonido.checked = audioHabilitado;

    switchSonido.addEventListener('change', async () => {

      audioHabilitado = switchSonido.checked;
      localStorage.setItem('sonidoTurnos', audioHabilitado);

      // 🔓 desbloqueo real SOLO una vez
      if (audioHabilitado && !audioDesbloqueado) {
        try {
          await sonido.play();
          sonido.pause();
          sonido.currentTime = 0;

          audioDesbloqueado = true;
          console.log('Audio desbloqueado');
        } catch (err) {
          console.warn('Navegador bloqueó el audio');
        }
      }
    });
  }


  /* =========================
     3️⃣ SSE (TIEMPO REAL)
     ========================= */
  const eventSource = new EventSource('/sse-tramites');

  eventSource.onmessage = (event) => {

    const data = JSON.parse(event.data);
    if (data.tipo !== 'tramite_en_atencion') return;

    const fila = document.querySelector(
      `tr[data-funcionario="${String(data.id_funcionario)}"]`
    );

    if (!fila) return;

    const celdaPlaca = fila.querySelector('.placa');

    // reproducir solo si hubo cambio real
    if (celdaPlaca.textContent !== data.placa) {
      celdaPlaca.textContent = data.placa;

      if (audioHabilitado && audioDesbloqueado) {
        sonido.currentTime = 0;
        sonido.play().catch(() => {});
      }
    }
  };

});
