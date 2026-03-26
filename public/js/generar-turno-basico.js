$(document).ready(function () {
    $('#GenerarTurnoBasico').click(function (e) {
        e.preventDefault();

        const btn = $(this);
        // 1. Verificación inmediata: si ya está deshabilitado, salir
        if (btn.prop('disabled')) return;

        const placa = $('#input-placa').val().trim();
        const servicio = $('#select-categoria').val();
        const tramite = $('#select-servicio').val();

        if (!placa || !tramite) {
            alert("Por favor, ingrese la placa y seleccione un trámite.");
            return;
        }

        // 2. Bloqueo total del botón y cambio de estado visual
        btn.prop('disabled', true)
           .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> GENERANDO...');

        $.ajax({
            type: 'POST',
            url: '/generar-turno-basico',
            data: { placa, servicio, tramite },
            success: function (response) {
                if (response.success) {
                    const t = response.turno;

                    // Llenado de datos en pantalla y ticket
                    $('#view-turno, #t-numero').text(t.numero_turno);
                    $('#view-nombre, #t-nombre').text(t.nombre_propietario);
                    $('#view-identificacion, #t-identificacion').text(t.identificacion_propietario);
                    $('#view-servicio, #t-servicio').text(t.tramite);
                    $('#view-placa, #t-placa').text(t.placa);
                    
                    const fechaLocal = new Date(t.fecha_creacion).toLocaleString();
                    $('#view-fecha, #t-fecha').text(fechaLocal);

                    // Cambiar de pantalla
                    mostrarPantalla('pantalla-confirmacion');

                    // IMPORTANTE: No reactivamos el botón aquí porque ya cumplió su función.
                    // Se reactivará solo cuando el flujo regrese al inicio.
                } else {
                    alert('Error: ' + response.message);
                    // Solo reactivar si hubo un error de validación para permitir corregir
                    btn.prop('disabled', false).text('GENERAR TURNO');
                }
            },
            error: function (error) {
                console.error('Error:', error);
                alert('No se pudo conectar con el servidor.');
                // Reactivar para permitir reintentar en caso de fallo de red
                btn.prop('disabled', false).text('GENERAR TURNO');
            }
        });
    });
});