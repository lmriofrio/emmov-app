$(document).ready(function () {
    $('#buscarTramite').click(function () {
        const placa = $('input[name="placa"]').val();
        const usernameSesion = $('#usernameSesion').data('username');

        $.ajax({
            type: 'GET',
            url: '/buscar-tramite',
            data: { placa },
            success: function (response) {
                const thead = $('#thead-tramites');
                const tbody = $('#tbody-tramites');
                tbody.empty();

                if (response.success) {

                    if (thead.children().length === 0) {

                        const headerRow = `
                          <tr class="" style="border-style: none; border-bottom: 1px solid #dddee4;">
                            <th class="py-3 col-1 text-center" style="border-style: none;">N°</th>
                            <th class="py-3 col-1" style="border-style: none;">Fecha</th>
                            <th class="py-3 col-1 text-center" style="border-style: none;">Placa</th>
                            <th class="py-3 col-2" style="border-style: none;">Tipo de Trámite</th>
                            <th class="py-3 col-1 text-center" style="border-style: none;">ID Usuario</th>
                            <th class="py-3 col-2" style="border-style: none;">Nombre</th>
                            <th class="py-3 col-1 text-center" style="border-style: none;">Estado</th>
                            <th class="py-3 col-1 text-center" style="border-style: none;">Usuario</th>
                            <th class="py-3 col text-center" style="border-style: none;">Acciones</th>
                          </tr>`;







                        thead.append(headerRow);
                    }

                    let numeroFila = 1;
                    response.tramites.forEach(tramite => {


                        const fechaParts = tramite.fecha_ingreso.split('-');
                        const dia = fechaParts[2];
                        const mes = fechaParts[1];
                        const año = fechaParts[0];

                        const fechaFormateada = `${dia}-${mes}-${año}`;

                        const newRow = `
                            <tr  style="border-style: none; border-bottom: 1px solid #dddee4;">

                                <td class="col-1 text-center" style="border-style: none;">${numeroFila}</td>
                                <td class="col-1 " style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-style: none; max-width: 115px;" >${fechaFormateada}</td>
                                <td class="col-1 text-center" style="border-style: none;  " >${tramite.placa}</td>
                                <td class="col-2" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-style: none; 
                                max-width: 250px;">${tramite.tipo_tramite}</td>
                                <td class="col-1 text-center" style="border-style: none;  " >${tramite.id_usuario}</td>
                                <td class="col-2" style="white-space: nowrap; word-wrap: break-word; overflow: hidden;border-style: none; 
                                max-width: 250px;">${tramite.nombre_usuario}</td>
                                <td class="col-1 text-center" style="border-style: none;">
                                               <span class="badge text-dark rounded-pill">
                                               <span class="round-8 bg-info rounded-circle d-inline-block me-2"></span>Finalizado</span>
                                <td class="col-1 text-center" style="border-style: none;">${tramite.username}</td>
                                <td class="col text-center d-flex align-items-center justify-content-center" style="border-style: none;">
                                    <button class="btn bg-info-subtle text-warning me-1 visualizarTramite px-2 py-2" id="visualizar-${tramite.id_tramite}" data-id-tramite="${tramite.id_tramite}" data-username="${tramite.username}">
                                        <i class="ti ti-file-description fs-4"></i>
                                    </button>
                                    <button class="editar btn bg-info-subtle text-dark btn-editar px-2 py-2" id="editar-${tramite.id_tramite}" data-id-tramite="${tramite.id_tramite}" data-username="${tramite.username}">
                                        <i class="ti ti-pencil fs-4"></i>
                                    </button>
                                </td>
                            </tr>`;
                        tbody.append(newRow);
                        numeroFila++;
                    });


                    $('#tbody-tramites').on('click', '.visualizarTramite', function () {
                        const idTramite = $(this).data('id-tramite');

                        $.ajax({
                            type: 'GET',
                            url: `/buscar-tramite-id`,
                            data: { idTramite },
                            success: function (response) {
                                if (response.success) {

                                    $('#placa').val(response.tramite.placa);
                                    $('#tipo_tramite').val(response.tramite.tipo_tramite);
                                    $('#clase_vehiculo').val(response.tramite.clase_vehiculo);
                                    $('#id_usuario').val(response.tramite.id_usuario);
                                    $('#canton_usuario').val(response.tramite.canton_usuario);
                                    $('#email_usuario').val(response.tramite.email_usuario);
                                    $('#nombre_usuario').val(response.tramite.nombre_usuario);
                                    $('#celular_usuario').val(response.tramite.celular_usuario);

                                    $('#clase_transporte').val(response.tramite.clase_transporte);
                                    $('#numero_adhesivo').val(response.tramite.numero_adhesivo);
                                    $('#numero_matricula').val(response.tramite.numero_matricula);
                                    $('#numero_fojas').val(response.tramite.numero_fojas);

                                    $('#pago_placas_entidad_bancaria').val(response.tramite.pago_placas_entidad_bancaria);
                                    $('#pago_placas_fecha').val(response.tramite.pago_placas_fecha);
                                    $('#pago_placas_newservicio').val(response.tramite.pago_placas_newservicio);
                                    $('#pago_placas_valor').val(response.tramite.pago_placas_valor);
                                    $('#pago_placas_comprobante').val(response.tramite.pago_placas_comprobante);
                                    $('#id_tramite_axis').val(response.tramite.id_tramite_axis);

                                    $('#nombre_funcionario').val(response.tramite.nombre_funcionario);
                                    $('#username').val(response.tramite.username);

                                    $('#fecha_ingreso').text(response.tramite.fecha_ingreso);
                                    $('#id_tramite').text(response.tramite.id_tramite);

                                    $('#permisosModal2').modal('show');
                                } else {
                                    alert('Error: no se pudo obtener la información del trámite.');
                                }
                            },
                            error: function (error) {
                                console.error('Error al obtener detalles del trámite:', error);
                                alert('Error al obtener detalles del trámite. Por favor, inténtelo de nuevo.');
                            }
                        });
                    });


                    response.tramites.forEach(tramite => {
                        $(`#editar-${tramite.id_tramite}`).click(function () {
                            const idTramite = $(this).data('id-tramite');
                            const username = $(this).data('username');

                            console.log('Nombre de usuario de la sesión:', usernameSesion);
                            console.log('Nombre de usuario del trámite:', username);

                            if (username === usernameSesion) {
                                window.location.href = `/edicion-tramites?id_tramite=${idTramite}`;
                            } else {
                                $('#permisosModal').modal('show');
                            }
                        });
                    });
                } else {
                    alert('TRÁMITES NO ENCONTRADOS');
                }
            },
            error: function (error) {
                console.error('Error al buscar Tramite:', error);
                alert('Error al buscar Tramite. Por favor, inténtelo de nuevo.');
            }
        });
    });
});
