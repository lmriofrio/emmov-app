
function mostrarAlerta(mensaje, tipo = 'success') {

  $('#alert-container').find('.alert').remove();

  const estadoTexto =
    tipo === 'success' ? 'ÉXITO' :
      tipo === 'warning' ? 'ATENCIÓN' :
        tipo === 'danger' ? 'ERROR' :
          'INFORMACIÓN';

  $('#alert-container').html(`
    <div class="alert alert-${tipo} alert-dismissible p-2 fade show d-flex col-12 align-items-center shadow-alert">
      <div class="col-11 pe-2">
        <div class="row">
          <strong class="col-12">¡${estadoTexto}!</strong>
        </div>
        <div class="row">
          <span class="col text-nowrap">
            ${mensaje}
          </span>
        </div>
      </div>
      <div class="col-auto">
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    </div>
  `);

  const $alert = $('#alert-container').find('.alert');
  setTimeout(function () {
    $alert.addClass('fade-out');
    setTimeout(() => $alert.alert('close'), 1000);
  }, 3000);
}

$(document).ready(function () {
  $('#loginForms').submit(function (event) {
    event.preventDefault();
    const formData = $(this).serialize();
    $.ajax({
      type: 'POST',
      url: '/login',
      data: formData,
      success: function (response) {
        if (response.success) {
          window.location.href = '/home';
        } else {
          mostrarAlerta('Usuario o contraseña incorrectos.', 'danger');
        }
      },
      error: function (error) {
        console.error('Error en la solicitud AJAX:', error.statusText);
      }
    });
  });
});
