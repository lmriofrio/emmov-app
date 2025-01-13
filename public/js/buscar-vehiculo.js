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
