$(document).ready(function() {
  $('#buscarUsuario').click(function() {
      const id_usuario = $('input[name="id_usuario"]').val();



      if (id_usuario.length >= 15) {
        // Mostrar un cuadro modal con el mensaje
        $('#modalIDExtensa').modal('show');
        return; // Salir de la función para evitar la solicitud AJAX
      }
  
      $.ajax({
          type: 'POST',
          url: '/buscar-usuario',
          data: { id_usuario },
          success: function(response) {
              if (response.success) {
                  $('#nombre_usuario').val(response.usuario.nombre_usuario);
                  $('#canton_usuario').val(response.usuario.canton_usuario);
                  $('#celular_usuario').val(response.usuario.celular_usuario);
                  $('#email_usuario').val(response.usuario.email_usuario);
                  // Actualizar otros campos según sea necesario
              } else {
                  alert('Usuario no encontrado');
              }
          },
          error: function(error) {
              console.error('Error al buscar usuario:', error);
              alert('Error al buscar usuario. Por favor, inténtelo de nuevo.');
          }
      });
  });
});
