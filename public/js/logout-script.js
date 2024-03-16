// logout-script.js

$(document).ready(function () {
    $('#logoutButton').click(function () {
      $.ajax({
        type: 'POST',
        url: '/logout',
        success: function (response) {
          if (response.success) {
            // Redirige a la página de inicio de sesión después de cerrar sesión
            window.location.href = response.redirect;
          } else {
            console.error('Error al cerrar sesión:', response.message);
          }
        },
        error: function (error) {
          console.error('Error en la solicitud AJAX:', error.statusText);
        }
      });
    });
  });
  