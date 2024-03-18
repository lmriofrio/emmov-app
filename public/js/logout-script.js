// logout-script.js

$(document).ready(function () {
    $('#logoutButton').click(function () {
      $.ajax({
        type: 'POST',
        url: '/logout',
        success: function (response) {
          if (response.success) {
            
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
  