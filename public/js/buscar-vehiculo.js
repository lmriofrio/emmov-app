
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
  

  $('#buscarVehiculo').click(function () {
    
    const placa = $('input[name="placa"]').val();

    if (placa.length >= 8) {
     
      $('#modalPlacaExtensa').modal('show');
      return; 
    }


    $.ajax({
      type: 'POST',
      url: '/buscar-vehiculo',
      data: { placa },
      success: function (response) {
        if (response.success) {

          $('#clase_vehiculo').val(response.vehiculo.clase_vehiculo_tipo);
          $('#clase_transporte').val(response.vehiculo.clase_transporte);
          $('#id_usuario').val(response.vehiculo.id_usuario);
          $('#nombre_usuario').val(response.vehiculo.nombre_usuario);
          $('#canton_usuario').val(response.vehiculo.canton_usuario);
          $('#celular_usuario').val(response.vehiculo.celular_usuario);
          $('#email_usuario').val(response.vehiculo.email_usuario);

        } else {
          alert('Vehículo no encontrado');
        }
      },
      error: function (error) {
        console.error('Error al buscar vehículo en la antigua js:', error);
        alert('Error al buscar vehículo. Por favor, inténtelo de nuevo.');
      }
    });
  });
});

//buscar vehiculo para el web services
$(document).ready(function () {


  $('#buscarVehiculo_ServiciosWeb').click(function () {

    const placa = $('input[name="placa"]').val();

    if (placa.length >= 8) {

      $('#modalPlacaExtensa').modal('show');
      return;
    }


    $.ajax({
      type: 'POST',
      url: '/buscar-vehiculo',
      data: { placa },
      success: function (response) {
        if (response.success) {

          mostrarAlerta('Vehiculo encontrado', 'success');

          $('#info-vehiculo').removeClass('d-none');

          $('#clase_vehiculo_tipo').val('');
          $('#clase_transporte').val('');
          $('#tipo_peso').val('');
          $('#avaluo').val('');
          $('#ultimaRTV').val('');

          $('#clase_vehiculo_tipo').val(response.vehiculo.clase_vehiculo_tipo);
          $('#clase_transporte').val(response.vehiculo.clase_transporte);
          $('#tipo_peso').val(response.vehiculo.tipo_peso);

        } else {

          $('#clase_vehiculo_tipo').val('');
          $('#clase_transporte').val('');
          $('#tipo_peso').val('');
          $('#avaluo').val('');
          $('#ultimaRTV').val('');

          mostrarAlerta('Vehiculo no encontrado', 'warning');
          $('#info-vehiculo').removeClass('d-none');
        }
      },
      error: function (error) {
        console.error('Error al buscar vehículo en la antigua js:', error);
        alert('Error al buscar vehículo. Por favor, inténtelo de nuevo.');
      }
    });


  });


});

//buscar personas para el web services
$(document).ready(function () {


  $('#buscarUsuario_ServiciosWeb').click(function () {

    const id_usuario = $('input[name="identificación"]').val();

    $.ajax({
      type: 'POST',
      url: '/buscar-usuario',
      data: { id_usuario },
      success: function (response) {

        if (response.success) {

          mostrarAlerta('Usuario encontrado', 'success');
          $('#info-propietario').removeClass('d-none');
          $('#nombre_usuario').val('');
          $('#nombre_usuario').val(response.usuario.nombre_usuario);

        } else {

          $('#info-propietario').removeClass('d-none');
          $('#nombre_usuario').val('');
          mostrarAlerta('Usuario no encontrado.', 'warning');
        }
      },
      error: function (error) {
        console.error('Error al buscar usuario:', error);
        alert('Error al buscar usuario. Por favor, inténtelo de nuevo.');
      }
    });


  });


});