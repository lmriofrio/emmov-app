$(document).ready(function () {
  const $dropZone = $('#drop-zone');
  const $fileInput = $('#fileInput');
  const $btnSubir = $('#btnSubirDococumentoInformacion');
  const $successContainer = $('#upload-success-container');

  

  
  $fileInput.on('change', function () {
    const file = this.files[0];
    if (file) {
      if (file.size > 1048576) {
        mostrarAlerta('El archivo es demasiado grande (Máx. 1MB)', 'danger');
        this.value = '';
        return;
      }

     
      $successContainer.hide();
      $('#status-container').show();

      $dropZone.find('h6').text(`Archivo listo: ${file.name}`);
      $dropZone.css({ 'background-color': '#f0f7ff', 'border-color': '#0d6efd' });

      $('#file-status-badge').removeClass('alert-danger alert-success').addClass('alert-info');
      $('#status-text').html(`<strong>Seleccionado:</strong> ${file.name}`);
    }
  });

  $btnSubir.on('click', function (e) {
    e.preventDefault();
    const file = $fileInput[0].files[0];

    if (!file) {
      mostrarAlerta('No has seleccionado ningún archivo nuevo.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('archivo_pdf', file);
    formData.append('id_referencia', $('#id_referencia').val() || '');

    $.ajax({
      type: 'POST',
      url: '/subir-documento-matriculacion',
      data: formData,
      processData: false,
      contentType: false,
      beforeSend: function () {
        $btnSubir.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span> Subiendo...');
      },
      success: function (res) {
        if (res.success) {
          mostrarAlerta(res.message, 'success');
          $('#id_documento_informacion').val(res.id_documento);

          
          $('#status-container').hide();
          $('#uploaded-file-name').text(file.name);
          $successContainer.fadeIn();

         
          $dropZone.css('background-color', '#f0fff4');
          $dropZone.find('h6').text('¡Archivo guardado!');
          $dropZone.find('small').text('Haz clic aquí si quieres reemplazarlo por otro');

          $fileInput.val('');
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