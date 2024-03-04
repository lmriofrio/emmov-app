$(document).ready(function () {
    $('#buscarTramite').click(function () {
        const placa = $('input[name="placa"]').val();

        $.ajax({
            type: 'GET',
            url: '/buscar-tramite',
            data: { placa },
            success: function (response) {
                const tbody = $('#tbody-tramites');
                tbody.empty();

                if (response.success) {
                    response.tramites.forEach(tramite => {
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
                                  <button class="btn bg-warning-subtle text-warning btn-editar" data-id-tramite="${tramite.id_tramite}">
                                      <i class="ti ti-pencil fs-4 me-2"></i>Editar
                                  </button>
                              </td>
                          </tr>`;
                        tbody.append(newRow);
                    });

                    // Agregar el evento clic a los botones de editar
                    $('.btn-editar').click(function () {
                        const idTramite = $(this).data('id-tramite');
                        window.location.href = `/edicion-tramites?id_tramite=${idTramite}`;
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
