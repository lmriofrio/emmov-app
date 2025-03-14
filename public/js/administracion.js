$(document).ready(function () {
    $('#encriptarPassword').click(function (event) {
        event.preventDefault();

        const password_empresa_tthh = $('input[name="password_empresa_tthh"]').val();
        const id_empresa = $('input[name="id_empresa"]').val();

        if (!password_empresa_tthh) {
            alert('Por favor, ingrese una contraseña');
            return;
        }


        $.ajax({
            type: 'POST',
            url: '/encriptar-empresa',
            contentType: 'application/json',
            data: JSON.stringify({ password_empresa_tthh, id_empresa }),
            success: function (response) {
                if (response.encryptedPassword) {
                    $('input[name="password_empresa_tthh"]').val(response.encryptedPassword);
                    $('input[name="act_id_empresa"]').val(id_empresa);
                    $('input[name="act_password"]').val(response.encryptedPassword);
                } else {
                    alert('Error al encriptar la contraseña.');
                }
            },
            error: function () {
                alert('Hubo un error. Inténtelo de nuevo.');
            }
        });
    });
});
