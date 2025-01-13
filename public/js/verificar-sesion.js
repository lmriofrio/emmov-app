


$(document).ready(function () {

  verificarSesion();

  function verificarSesion() {

    $.ajax({
      type: 'GET',
      url: '/',
      dataType: 'json',
      success: function (response) {
        if (response.success) {
          
          window.location.href = response.redirect;
        } else {
          
        }
      },
      error: function (error) {
        console.error('Error en la solicitud AJAX:', error.statusText);
      }
    });
  }
});

  