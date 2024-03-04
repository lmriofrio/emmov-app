$(document).ready(function () {
  // Verificar la sesión de usuario al cargar la página


  $('#buscarVehiculo').click(function () {
    // Obtener el valor del campo de placa
    const placa = $('input[name="placa"]').val();

    if (placa.length >= 8) {
      // Mostrar un cuadro modal con el mensaje
      $('#modalPlacaExtensa').modal('show');
      return; // Salir de la función para evitar la solicitud AJAX
    }

    // Realizar la solicitud AJAX solo si la longitud de la placa es menor o igual a 7
    $.ajax({
      type: 'POST',
      url: '/buscar-vehiculo',
      data: { placa },
      success: function (response) {
        if (response.success) {
          // Actualizar los campos de acuerdo a la respuesta
          $('#clase_vehiculo').val(response.vehiculo.clase_vehiculo);
          $('#clase_transporte').val(response.vehiculo.clase_transporte);
          $('#id_usuario').val(response.vehiculo.id_usuario);
          $('#nombre_usuario').val(response.vehiculo.nombre_usuario);
          $('#canton_usuario').val(response.vehiculo.canton_usuario);
          $('#celular_usuario').val(response.vehiculo.celular_usuario);
          $('#email_usuario').val(response.vehiculo.email_usuario);
          // Actualizar otros campos según sea necesario
        } else {
          alert('Vehículo no encontrado');
        }
      },
      error: function (error) {
        console.error('Error al buscar vehículo:', error);
        alert('Error al buscar vehículo. Por favor, inténtelo de nuevo.');
      }
    });
  });
});
