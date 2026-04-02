
$(document).ready(function () {
    $('#consultarProcesoRTV').click(function () {
        const placa = $('input[name="placa"]').val();

        $.ajax({
            type: 'GET',
            url: '/buscar-tramite-agregar-archivo-general',
            data: { placa },
            success: function (response) {
                const tbody = $('#tbody-tramites'); tbody.empty();

                if (response.success) {

                    let numeroFila = 1;
                    response.tramites.forEach(tramite => {

                        const fechaOriginal = tramite.fecha_final_PRESENTACION;
                        const fechaIngreso = new Date(fechaOriginal);
                        fechaIngreso.setHours(fechaIngreso.getHours() + 5);

                        const diaIngreso = fechaIngreso.getDate().toString().padStart(2, '0');
                        const mesIngreso = (fechaIngreso.getMonth() + 1).toString().padStart(2, '0');
                        const añoIngreso = fechaIngreso.getFullYear();
                        const horaIngreso = fechaIngreso.getHours().toString().padStart(2, '0');
                        const minutosIngreso = fechaIngreso.getMinutes().toString().padStart(2, '0');
                        const fechaFormateada = `${diaIngreso}-${mesIngreso}-${añoIngreso} ${horaIngreso}:${minutosIngreso}`;

                        let estadoClass = '';
                        let opcionesHabilitadas = [];

                        if (tramite.estado_tramite === 'Finalizado') {
                            estadoClass = 'bg-info';
                        } else if (tramite.estado_tramite === 'En proceso') {
                            estadoClass = 'bg-wait';
                        } else if (tramite.estado_tramite === 'En devolución') {
                            estadoClass = 'bg-danger';
                        }

                        opcionesHabilitadas.push(`
                            <li>
                                <a class="dropdown-item visualizarTramite text-black px-4" href="#" 
                                   id="visualizar-${tramite.id_tramite}" 
                                   data-id-tramite="${tramite.id_tramite}"
                                   data-username="${tramite.username}">
                                   Visualizar
                                </a>
                            </li>
                        `);

                        const opcionesMenu = opcionesHabilitadas.join('');

                        const newRow = `
                                <tr class="border-bottom-light">
                                <td class="text-center">${numeroFila}</td>
                                <td class="text-center text-overflow-3">${tramite.id_tramite}</td>
                                <td class="text-start text-overflow-4">${fechaFormateada}</td>
                                <td class="text-center">${tramite.placa}</td>
                                <td class="text-overflow-9 text-nowrap" >${tramite.tipo_tramite}</td>
                                <td class="text-center">${tramite.id_usuario}</td>
                                <td class="text-overflow-5 text-nowrap">${tramite.nombre_usuario}</td>
                                <td class="align-items-center justify-content-start text-overflow-4">
                                    <span class="round-8 ${estadoClass} rounded-circle d-inline-block ms-2"></span>
                                    <span class="badge text-dark rounded-pill fw-normal">${tramite.estado_tramite}</span>
                                </td>
                                <td class="text-center">${tramite.username || tramite.username_funcionario_asignado_INFORMACION}</td>
                                <td class="text-center align-items-center justify-content-center p-2">
                                    <div class="btn-group">
                                        <button class="btn btn-light-primary text-primary dropdown-toggle px-2 py-1 border-0" type="button" 
                                            id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                             Acción
                                        </button>
                                        <ul class="dropdown-menu border" aria-labelledby="dropdownMenuButton">
                                            ${opcionesMenu}
                                        </ul>
                                    </div>
                                </td>
                            </tr>`;
                        tbody.append(newRow);
                        numeroFila++;


                        $('#tbody-tramites').off('click', '.visualizarTramite').on('click', '.visualizarTramite', function () {
                            const idTramite = $(this).data('id-tramite');

                            $.ajax({
                                type: 'GET',
                                url: `/buscar-tramite-id`,
                                data: { idTramite },
                                success: function (response) {
                                    if (response.success) {


                                        const fechaOriginal = response.tramite.fecha_finalización_RTV;
                                        const fecha = new Date(fechaOriginal);
                                        fecha.setHours(fecha.getHours() + 5);
                                        const dia = fecha.getDate().toString().padStart(2, '0');
                                        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                                        const año = fecha.getFullYear();
                                        const hora = fecha.getHours().toString().padStart(2, '0');
                                        const minutos = fecha.getMinutes().toString().padStart(2, '0');
                                        const fechaFormateada = `${dia}-${mes}-${año} ${hora}:${minutos}`;

                                        $('#visualizar_id_tramite').val(response.tramite.id_tramite);
                                        $('#placaVisualizar').val(response.tramite.placa);
                                        $('#tipo_tramiteVisualizar').val(response.tramite.tipo_tramite);

                                        $('#clase_vehiculoVisualizar').val(response.tramite.clase_vehiculo);
                                        $('#tipo_vehiculoVisualizar').val(response.tramite.tipo_vehiculo);
                                        $('#clase_transporteVisualizar').val(response.tramite.clase_transporte);
                                        $('#tipo_pesoVisualizar').val(response.tramite.tipo_peso);

                                        $('#tipo_id_usuarioVisualizar').val(response.tramite.tipo_id_usuario);
                                        $('#id_usuarioVisualizar').val(response.tramite.id_usuario);
                                        $('#nombre_usuarioVisualizar').val(response.tramite.nombre_usuario);
                                        $('#provincia_usuarioVisualizar').val(response.tramite.provincia_usuario);
                                        $('#canton_usuarioVisualizar').val(response.tramite.canton_usuario);
                                        $('#parroquia_usuarioVisualizar').val(response.tramite.parroquia_usuario);
                                        $('#direccion_usuarioVisualizar').val(response.tramite.direccion_usuario);
                                        $('#email_usuarioVisualizar').val(response.tramite.email_usuario);
                                        $('#celular_usuarioVisualizar').val(response.tramite.celular_usuario);

                                        $('#nombre_funcionarioVisualizar').val(response.tramite.nombre_funcionario);
                                        $('#usernameVisualizar').val(response.tramite.username);

                                        $('#visualizar_fecha_ingreso').text(response.tramite.fecha_ingreso_INFORMACION);
                                        $('#id_tramiteVisualizar').text(response.tramite.id_tramite);

                                        $('#id_date_registratonVisualizar').text(response.tramite.date_registraton);

                                        $('#resultado_final_Visualizar').val(response.tramite.resultado_final_RTV);
                                        $('#fecha_finalización_RTV').val(fechaFormateada);
                                        $('#nombre_funcionario_RTV').val(response.tramite.nombre_funcionario_RTV);

                                        $('#modalVisualizarTramite').modal('show');
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


                    });


                    $('#TraPersonal').text(`${response.tramites.length}`);


                } else {
                    console.log('TRÁMITES NO ENCONTRADOS');
                }
            },
            error: function (error) {
                console.error('Error al buscar Tramite:', error);
                alert('Error al buscar Tramite. Por favor, inténtelo de nuevo.');
            }
        });

    });
});


