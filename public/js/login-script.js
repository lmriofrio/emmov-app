// login-script.js

$(document).ready(function () {
    $('#loginForms').submit(function (event) {
      event.preventDefault(); // Evita el envío del formulario por defecto
      const formData = $(this).serialize();
      $.ajax({
        type: 'POST',
        url: '/login',
        data: formData,
        success: function (response) {
          if (response.success) {
            // Redirige a la página de inicio si la autenticación es exitosa
            window.location.href = '/home';
          } else {
            // Muestra el mensaje de error debajo del formulario
            $('#errorMessage').text(response.message);
          }
        },
        error: function (error) {
          console.error('Error en la solicitud AJAX:', error.statusText);
        }
      });
    });
  });
  