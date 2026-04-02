$(document).ready(function () {
    const $dropZone = $('#drop-zone');
    const $fileInput = $('#fileInput');
    const $btnSubir = $('#btnSubirDococumentoInformacion');
    const $statusBadge = $('#file-status-badge');
    const $statusText = $('#status-text');
    const $uploadedFileName = $('#uploaded-file-name');
    const $successContainer = $('#upload-success-container');

    $('#uploadForm').on('submit', function (e) {
        e.preventDefault();
    });

    $dropZone.on('click', function () {
        $fileInput.click();
    });

    $fileInput.on('change', function () {
        const file = this.files[0];
        if (file) {
            // Validar tipo MIME (solo PDF)
            if (file.type !== 'application/pdf') {
                mostrarAlerta('Solo se permiten archivos PDF.', 'danger');
                this.value = '';
                $dropZone.find('h6').text('Haz clic aquí o arrastra tu PDF');
                $dropZone.find('small').text('Solo formato PDF (Máx 500 KB)');
                $dropZone.css({ 'background-color': '#fff', 'border-color': '#ccc' });
                $statusBadge.removeClass('alert-info alert-success').addClass('alert-danger');
                $statusText.html('<strong>Error:</strong> formato no válido');
                return;
            }

            // Validar tamaño (máx 1MB)
            if (file.size > 1048576) {
                mostrarAlerta('El archivo excede el límite de 1MB.', 'danger');
                this.value = '';
                $dropZone.find('h6').text('Haz clic aquí o arrastra tu PDF');
                $dropZone.find('small').text('Solo formato PDF (Máx 500 KB)');
                $dropZone.css({ 'background-color': '#fff', 'border-color': '#ccc' });
                $statusBadge.removeClass('alert-info alert-success').addClass('alert-danger');
                $statusText.html('<strong>Error:</strong> archivo demasiado grande');
                return;
            }

            // Actualizar UI si es válido
            $dropZone.find('h6').text(`Archivo listo: ${file.name}`);
            $dropZone.find('small').text('Haz clic si deseas cambiar el archivo');
            $dropZone.css({ 'background-color': '#f0f7ff', 'border-color': '#0d6efd' });
            $statusBadge.removeClass('alert-danger alert-success').addClass('alert-info');
            $statusText.html(`<strong>Seleccionado:</strong> ${file.name}`);
        }
    });

    $btnSubir.off('click').on('click', function (e) {
        e.preventDefault();
        const file = $fileInput[0].files[0];

        if (!file) {
            mostrarAlerta('Por favor, selecciona un archivo primero.', 'warning');
            return;
        }

        if (file.type !== 'application/pdf') {
            mostrarAlerta('Solo se permiten archivos PDF.', 'danger');
            return;
        }

        const formData = new FormData();
        formData.append('archivo_pdf', file);
        formData.append('id_referencia', $('#id_referencia').val() || '');
        formData.append('id_documento_informacion', $('#id_documento_informacion').val());
        formData.append('adjuntar_documento_id_tramite', $('#adjuntar_documento_id_tramite').val());

        $.ajax({
            type: 'POST',
            url: '/registrar-documento-matriculacion-area-informacion',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function () {
                $btnSubir.prop('disabled', true).text('Subiendo...');
            },
            success: function (res) {
                if (res.success) {
                    // Mostrar contenedor de éxito con nombre del archivo
                    $uploadedFileName.text(file.name);
                    $successContainer.show();

                    setTimeout(function () {
                        location.reload();
                    }, 2000);
                } else {
                    mostrarAlerta(res.message, 'warning');
                }
            },
            error: function () {
                mostrarAlerta('Error de conexión', 'danger');
            },
            complete: function () {
                $btnSubir.prop('disabled', false).html('<i class="ti ti-cloud-upload fs-5 me-2"></i> Subir PDF');
            }
        });
    });
});
