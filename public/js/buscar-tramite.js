$(document).ready(function () {
    $('#buscarTramite').click(function () {
        const placa = $('input[name="placa"]').val();
        const usernameSesion = $('#usernameSesion').data('username');


        $.ajax({
            type: 'GET',
            url: '/buscar-tramite',
            data: { placa },
            success: function (response) {
                const tbody = $('#tbody-tramites');
                tbody.empty();

                if (response.success) {
                    response.tramites.forEach(tramite => {
                        console.log('SE GENERO LA TABLA       :');
                        const newRow = `
                          <tr>
                              <td class="text-center">${tramite.id_tramite}</td>
                              <td class="text-center">${tramite.placa}</td>
                              <td>${tramite.tipo_tramite}</td>
                              <td>${tramite.nombre_usuario}</td>
                              <td class="text-center">${tramite.fecha_ingreso}</td>
                              <td class="text-center">${tramite.nombre_centro_matriculacion}</td>
                              <td class="text-center">${tramite.username}</td>
                              <td>
                                  <button class="btn bg-warning-subtle text-warning btn-editar" id="editar-${tramite.id_tramite}" data-id-tramite="${tramite.id_tramite}" data-username="${tramite.username}">
                                      <i class="ti ti-pencil fs-4 me-2"></i>Editar
                                  </button>
                              </td>
                          </tr>`;
                        tbody.append(newRow);
                    });


                    response.tramites.forEach(tramite => {
                       
                        $(`#editar-${tramite.id_tramite}`).click(function () {
                           
                            const idTramite = $(this).data('id-tramite');
                            const username = $(this).data('username');

                   
                           
    

                            console.log('Nombre de usuario de la sesión:', usernameSesion);
                            console.log('Nombre de usuario del trámite:', username);

                            if (username === usernameSesion) {
                                // Redirigir a la página de edición si los nombres de usuario coinciden
                                window.location.href = `/edicion-tramites?id_tramite=${idTramite}`;
                                
                            } else {
                                // Mostrar el modal de permisos insuficientes si los nombres de usuario no coinciden
                                $('#permisosModal').modal('show');
                            }
                        });
                    });
                } else {
                    alert('TRAMITES NO ENCONTRADOS');
                }
            },
            error: function (error) {
                console.error('Error al buscar Tramite:', error);
                alert('Error al buscar Tramite. Por favor, inténtelo de nuevo.');
            }
        });
    });
});
