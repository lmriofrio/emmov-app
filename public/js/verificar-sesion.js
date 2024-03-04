

  // scripts.js

$(document).ready(function () {
  // Verificar sesión al cargar cualquier página
  verificarSesion();

  function verificarSesion() {
    // Realizar una solicitud para verificar si hay una sesión activa
    $.ajax({
      type: 'GET',
      url: '/',
      dataType: 'json',
      success: function (response) {
        if (response.success) {
          // Si hay una sesión activa, redirigir al usuario a la página de inicio
          window.location.href = response.redirect;
        } else {
          // Si no hay una sesión activa, el usuario permanece en la página actual
        }
      },
      error: function (error) {
        console.error('Error en la solicitud AJAX:', error.statusText);
      }
    });
  }
});

  