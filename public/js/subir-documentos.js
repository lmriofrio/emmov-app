$(document).ready(function () {
  const $dropZone = $('#drop-zone');
  const $fileInput = $('#fileInput');
  const $btnSubir = $('#btnSubirDococumentoInformacion');
  const $successContainer = $('#upload-success-container');
  const $statusContainer = $('#status-container');
  const $statusBadge = $('#file-status-badge');
  const $statusText = $('#status-text');
  const $uploadedFileName = $('#uploaded-file-name');

  $fileInput.attr('accept', '.pdf');

  function obtenerReglas() {
    const tipo = $('#area_documento').val() || 'matriculacion';
    let limite = 1;

    if (tipo === 'matriculacion') limite = 2;
    if (tipo === 'rtv') limite = 1;
    if (tipo === 'archivo') limite = 5;
    if (tipo === 'secretaria') limite = 5;

    return { tipo, limite };
  }

  $dropZone.on('click', () => $fileInput.click());

  $dropZone.on('dragover', function (e) {
    e.preventDefault();
    $(this).css('background-color', '#eef2ff');
  });

  $dropZone.on('dragleave', function (e) {
    e.preventDefault();
    $(this).css('background-color', '#f8fbff');
  });

  // 1. Validación al seleccionar el archivo
  $fileInput.on('change', function () {
    const file = this.files[0];
    const { tipo, limite } = obtenerReglas();

    if (file) {
      const esPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

      if (!esPDF) {
        mostrarAlerta('Solo se permiten archivos PDF.', 'danger');
        this.value = '';
        return;
      }

      if (file.size > limite * 1024 * 1024) {
        mostrarAlerta(`El archivo es muy grande. Máximo permitido ${limite} MB.`, 'danger');
        this.value = '';
        return;
      }

      $successContainer.hide();
      $statusContainer.fadeIn();

      $dropZone.find('h6').text(`ARCHIVO LISTO PARA GUARDAR`);
      $dropZone.find('small').text('Haga clic para cambiar el archivo');
      $dropZone.css({ 'background-color': '#e7f1ff', 'border-color': '#0d6efd' });

      $statusBadge.removeClass('alert-danger text-danger').addClass('alert-info text-primary');
      $statusText.html(`<strong>Seleccionado:</strong> ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    }
  });

  // 2. Proceso de subida al servidor
  $btnSubir.on('click', function (e) {
    e.preventDefault();
    const file = $fileInput[0].files[0];
    const { tipo } = obtenerReglas();

    if (!file) {
      mostrarAlerta('Por favor, selecciona un PDF primero.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('archivo_pdf', file);
    formData.append('id_referencia', $('#id_referencia').val() || '');
    formData.append('area_documento', tipo);

    $.ajax({
      type: 'POST',
      url: `/subir-documento-pdf?tipo=${tipo}`,
      data: formData,
      processData: false,
      contentType: false,
      beforeSend: function () {
        // Deshabilitar botón y mostrar estado de carga
        $btnSubir.prop('disabled', true);
      },
      success: function (res) {
        // Validamos éxito según la respuesta de tu ruta
        if (res.success || res.estadoSubida === 'OK') {
          mostrarAlerta(res.message || res.mensaje || '¡Éxito!', 'success');

          // Asignar ID del documento generado al input hidden
          if (res.id_documento) $('#id_documento_informacion').val(res.id_documento);

          // Manejo de contenedores visuales
          $statusContainer.fadeOut();
          $uploadedFileName.text(file.name);
          $successContainer.fadeIn();

          // Ocultar información adicional del dropzone
          

          // Estilo de zona bloqueada y exitosa
          $dropZone.css({
            'pointer-events': 'none',
            'opacity': '0.9',
            'background-color': '#f0fff4',
            'border-color': '#198754'
          });

          // Actualizar textos y estados finales
          $dropZone.find('h6').text('¡Guardado!');
          $btnSubir.hide();
          $btnSubir.prop('disabled', true);
          $('#info-drop-zone').addClass('d-none');

        } else {
          // Error controlado desde el servidor
          mostrarAlerta(res.mensaje || res.message || 'Error desconocido', 'danger');
          $btnSubir.prop('disabled', false).html('<i class="ti ti-cloud-upload me-2"></i> Reintentar Subida');
        }
      },
      error: function (xhr) {
        // Error de red o servidor (400, 500, etc.)
        const errorRes = xhr.responseJSON;
        mostrarAlerta(errorRes ? errorRes.mensaje : 'Error crítico en el servidor', 'danger');
        $btnSubir.prop('disabled', false).html('<i class="ti ti-cloud-upload me-2"></i> Subir PDF');
      }
    });
  });


});