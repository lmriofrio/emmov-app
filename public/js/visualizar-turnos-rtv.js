$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: '/visualizar-turnos-rtv',
        success: function (response) {
            const tbody = $('#tbody-tramites'); tbody.empty();

            if (response.success) {

                let numeroFila = 1;
                response.tramitesUsuario.forEach(tramite => {

                    const fechaIngresoOriginal = tramite.fecha_turno_RTV;
                    const fechaIngreso = new Date(fechaIngresoOriginal);
                    fechaIngreso.setHours(fechaIngreso.getHours() + 5);

                    const diaIngreso = fechaIngreso.getDate().toString().padStart(2, '0');
                    const mesIngreso = (fechaIngreso.getMonth() + 1).toString().padStart(2, '0');
                    const añoIngreso = fechaIngreso.getFullYear();
                    const horaIngreso = fechaIngreso.getHours().toString().padStart(2, '0');
                    const minutosIngreso = fechaIngreso.getMinutes().toString().padStart(2, '0');
                    const fechaIngresoFormateada = `${diaIngreso}-${mesIngreso}-${añoIngreso} ${horaIngreso}:${minutosIngreso}`;

                    let estadoClass = '';
                    let estadoColor = '';
                    let estadoFont = '';
                    let opcionesHabilitadas = [];

                    estadoColor = 'bg-primary-green';

                    opcionesHabilitadas.push(`
                        <li>
                            <a class="dropdown-item visualizarTramite text-black px-4" href="#" 
                               id="visualizar-${tramite.id_tramite}" 
                               data-id-tramite="${tramite.id_tramite}">
                               Visualizar
                            </a>
                        </li>
                    `);

                    if (tramite.estado_tramite === 'Finalizado') {
                        estadoClass = 'bg-info';
                        estadoFont = 'fw-normal';

                    } else if (tramite.estado_tramite === 'En proceso') {
                        estadoClass = 'bg-wait';
                        estadoFont = 'fw-semibold';
                        opcionesHabilitadas.push(`
                            <li>
                                <a class="dropdown-item reasignarTramite text-black px-4" href="#" 
                                   data-bs-toggle="modal" data-bs-target="#modalReasignarTramite" 
                                   id="reasignar-${tramite.id_tramite}" 
                                   data-id-tramite="${tramite.id_tramite}" 
                                   data-username="${tramite.username}">
                                   Aprobar inspección
                                </a>
                            </li>
                        `);
                    }

                    opcionesHabilitadas.push(`
                        <li>
                            <a class="dropdown-item imprimirTramite text-black px-4" href="#" 
                               id="imprimir-${tramite.id_tramite}" 
                               data-id-tramite="${tramite.id_tramite}" 
                               data-username="${tramite.username}">
                               Imprimir
                            </a>
                        </li>
                    `);

                    const opcionesMenu = opcionesHabilitadas.join('');

                    const newRow = `
                        <tr style="border-style: none; border-bottom: 1px solid #dddee4;">
                            <td class="text-center">${numeroFila}</td>
                            <td class="text-center">${tramite.id_tramite}</td>
                            <td class="text-center fw-semibold">${tramite.placa}</td>
                            <td class="text-overflow-12">${tramite.tipo_tramite}</td>
                            <td class="text-center">${fechaIngresoFormateada}</td>
                            <td class="text-center text-overflow-3 fw-semibold">TURNO ${tramite.numero_turno_rtv_INFORMACION}</td>
                            <td class="text-center text-overflow-3 bg-four-card">
                                <span class="${estadoColor} badge bg-primary-red rounded fw-semibold
                                 mb-0 px-3"">${tramite.revision_tecnica_vehicular_TURNO}</span>
                            </td>
                            <td class="text-center text-overflow-3 bg-four-card">
                                <span class="${estadoColor} badge bg-primary-red rounded fw-semibold
                                 mb-0 px-3"">${tramite.verificacion_improntas_TURNO}</span>
                            </td>
                            <td class="text-center text-overflow-3 bg-four-card">
                                <span class="${estadoColor} badge bg-primary-red rounded fw-semibold
                                 mb-0 px-3"">${tramite.cambio_servicio_TURNO}</span>
                            </td>
                            <td class="text-center text-overflow-3 bg-four-card">
                                <span class="${estadoColor} badge bg-primary-red rounded fw-semibold
                                 mb-0 px-3"">${tramite.cambio_color_TURNO}</span>
                            </td>
                            <td class="align-items-center justify-content-start text-overflow-4">
                                <span class="round-8 ${estadoClass} rounded-circle d-inline-block ms-2"></span>
                                <span class="badge text-dark rounded-pill fw-normal">${tramite.estado_tramite}</span>
                            </td>
                            <td class="text-center text-overflow-4">${tramite.username_funcionario_asignado_INFORMACION}</td>
                                                        <td class="text-center align-items-center justify-content-center p-2">
                                <div class="btn-group">
                                    <button class="btn btn-light-primary text-primary dropdown-toggle px-2 py-1" type="button" 
                                            id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                        Acción
                                    </button>
                                    <ul class="dropdown-menu border" aria-labelledby="dropdownMenuButton">
                                        ${opcionesMenu}
                                    </ul>
                                </div>
                            </td>
                        </tr>
                    `;
                    tbody.append(newRow);
                    numeroFila++;




                    $('#tbody-tramites').off('click', '.reasignarTramite').on('click', '.reasignarTramite', function () {
                        const idTramite = $(this).data('id-tramite');
                        $.ajax({
                            type: 'GET',
                            url: `/buscar-tramite-id`,
                            data: { idTramite },
                            success: function (response) {
                                if (response.success) {
                                    $('#placa').val(response.tramite.placa);
                                    $('#id_usuario').val(response.tramite.id_usuario);
                                    $('#nombre_usuario').val(response.tramite.nombre_usuario);
                                    $('#nombre_funcionario').val(response.tramite.nombre_funcionario);
                                    $('#tipo_tramite').val(response.tramite.tipo_tramite);
                                    $('#reasignar_id_tramite').val(response.tramite.id_tramite);
                                    $('#nombre_funcionario_asignado_INFORMACION').val(response.tramite.id_funcionario_asignado_INFORMACION);
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

                    $('#tbody-tramites').off('click', '.editarTramite').on('click', '.editarTramite', function () {
                        const idTramite = $(this).data('id-tramite');

                        $.ajax({
                            type: 'GET',
                            url: `/buscar-tramite-id`,
                            data: { idTramite },
                            success: function (response) {
                                if (response.success) {
                                    window.location.href = `/matriculacion/informacion/editar-turno?id_tramite=${idTramite}`;
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

                    $('#tbody-tramites').off('click', '.visualizarTramite').on('click', '.visualizarTramite', function () {
                        const idTramite = $(this).data('id-tramite');

                        $.ajax({
                            type: 'GET',
                            url: `/buscar-tramite-id`,
                            data: { idTramite },
                            success: function (response) {
                                if (response.success) {

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

                    $('#tbody-tramites').off('click', '.eliminarTramite').on('click', '.eliminarTramite', function () {
                        const idTramite = $(this).data('id-tramite');
                        $.ajax({
                            type: 'GET',
                            url: `/buscar-tramite-id`,
                            data: { idTramite },
                            success: function (response) {
                                if (response.success) {
                                    $('#eliminar_placa').val(response.tramite.placa);
                                    $('#eliminar_nombre_usuario').val(response.tramite.nombre_usuario);
                                    $('#eliminar_nombre_funcionario').val(response.tramite.nombre_funcionario);
                                    $('#eliminar_tipo_tramite').val(response.tramite.tipo_tramite);
                                    $('#eliminar_id_tramite').val(response.tramite.id_tramite);
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

                    $('#tbody-tramites').off('click', '.imprimirTramite').on('click', '.imprimirTramite', function () {
                        const idTramite = $(this).data('id-tramite');
                        $.ajax({
                            type: 'GET',
                            url: `/buscar-tramite-id`,
                            data: { idTramite },
                            success: function (response) {
                                if (response.success) {
                                    window.location.href = `/matriculacion/informacion/turno-agregado?id_tramite=${idTramite}`;
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


                $('#TraPersonal').text(`${response.tramitesUsuario.length}`);


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

$(document).ready(function () {
    $('#consultarProcesoRTV').click(function () {
        const placa = $('input[name="placa"]').val();

        $.ajax({
            type: 'GET',
            url: '/visualizar-turnos-rtv-filtro',
            data: { placa },
            success: function (response) {
                const tbody = $('#tbody-tramites'); tbody.empty();
               
                if (response.success) {

                    let numeroFila = 1;
                    response.tramitesUsuario.forEach(tramite => {
    
                        const fechaIngresoOriginal = tramite.fecha_turno_RTV;
                        const fechaIngreso = new Date(fechaIngresoOriginal);
                        fechaIngreso.setHours(fechaIngreso.getHours() + 5);
    
                        const diaIngreso = fechaIngreso.getDate().toString().padStart(2, '0');
                        const mesIngreso = (fechaIngreso.getMonth() + 1).toString().padStart(2, '0');
                        const añoIngreso = fechaIngreso.getFullYear();
                        const horaIngreso = fechaIngreso.getHours().toString().padStart(2, '0');
                        const minutosIngreso = fechaIngreso.getMinutes().toString().padStart(2, '0');
                        const fechaIngresoFormateada = `${diaIngreso}-${mesIngreso}-${añoIngreso} ${horaIngreso}:${minutosIngreso}`;
    
                        let estadoClass = '';
                        let estadoColor = '';
                        let estadoFont = '';
                        let opcionesHabilitadas = [];
    
                        estadoColor = 'bg-primary-green';
    
                        opcionesHabilitadas.push(`
                            <li>
                                <a class="dropdown-item visualizarTramite text-black px-4" href="#" 
                                   id="visualizar-${tramite.id_tramite}" 
                                   data-id-tramite="${tramite.id_tramite}">
                                   Visualizar
                                </a>
                            </li>
                        `);
    
                        if (tramite.estado_tramite === 'Finalizado') {
                            estadoClass = 'bg-info';
                            estadoFont = 'fw-normal';
    
                        } else if (tramite.estado_tramite === 'En proceso') {
                            estadoClass = 'bg-wait';
                            estadoFont = 'fw-semibold';
                            opcionesHabilitadas.push(`
                                <li>
                                    <a class="dropdown-item reasignarTramite text-black px-4" href="#" 
                                       data-bs-toggle="modal" data-bs-target="#modalReasignarTramite" 
                                       id="reasignar-${tramite.id_tramite}" 
                                       data-id-tramite="${tramite.id_tramite}" 
                                       data-username="${tramite.username}">
                                       Aprobar inspección
                                    </a>
                                </li>
                            `);
                        }
    
                        opcionesHabilitadas.push(`
                            <li>
                                <a class="dropdown-item imprimirTramite text-black px-4" href="#" 
                                   id="imprimir-${tramite.id_tramite}" 
                                   data-id-tramite="${tramite.id_tramite}" 
                                   data-username="${tramite.username}">
                                   Imprimir
                                </a>
                            </li>
                        `);
    
                        const opcionesMenu = opcionesHabilitadas.join('');
    
                        const newRow = `
                            <tr style="border-style: none; border-bottom: 1px solid #dddee4;">
                                <td class="text-center">${numeroFila}</td>
                                <td class="text-center">${tramite.id_tramite}</td>
                                <td class="text-center fw-semibold">${tramite.placa}</td>
                                <td class="text-overflow-12">${tramite.tipo_tramite}</td>
                                <td class="text-center">${fechaIngresoFormateada}</td>
                                <td class="text-center text-overflow-3 fw-semibold">TURNO ${tramite.numero_turno_rtv_INFORMACION}</td>
                                <td class="text-center text-overflow-3 bg-four-card">
                                    <span class="${estadoColor} badge bg-primary-red rounded fw-semibold
                                     mb-0 px-3"">${tramite.revision_tecnica_vehicular_TURNO}</span>
                                </td>
                                <td class="text-center text-overflow-3 bg-four-card">
                                    <span class="${estadoColor} badge bg-primary-red rounded fw-semibold
                                     mb-0 px-3"">${tramite.verificacion_improntas_TURNO}</span>
                                </td>
                                <td class="text-center text-overflow-3 bg-four-card">
                                    <span class="${estadoColor} badge bg-primary-red rounded fw-semibold
                                     mb-0 px-3"">${tramite.cambio_servicio_TURNO}</span>
                                </td>
                                <td class="text-center text-overflow-3 bg-four-card">
                                    <span class="${estadoColor} badge bg-primary-red rounded fw-semibold
                                     mb-0 px-3"">${tramite.cambio_color_TURNO}</span>
                                </td>
                                <td class="align-items-center justify-content-start text-overflow-4">
                                    <span class="round-8 ${estadoClass} rounded-circle d-inline-block ms-2"></span>
                                    <span class="badge text-dark rounded-pill fw-normal">${tramite.estado_tramite}</span>
                                </td>
                                <td class="text-center text-overflow-4">${tramite.username_funcionario_asignado_INFORMACION}</td>
                                                            <td class="text-center align-items-center justify-content-center p-2">
                                    <div class="btn-group">
                                        <button class="btn btn-light-primary text-primary dropdown-toggle px-2 py-1" type="button" 
                                                id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                            Acción
                                        </button>
                                        <ul class="dropdown-menu border" aria-labelledby="dropdownMenuButton">
                                            ${opcionesMenu}
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        `;
                        tbody.append(newRow);
                        numeroFila++;
    

    
                        $('#tbody-tramites').off('click', '.reasignarTramite').on('click', '.reasignarTramite', function () {
                            const idTramite = $(this).data('id-tramite');
                            $.ajax({
                                type: 'GET',
                                url: `/buscar-tramite-id`,
                                data: { idTramite },
                                success: function (response) {
                                    if (response.success) {
                                        $('#placa').val(response.tramite.placa);
                                        $('#id_usuario').val(response.tramite.id_usuario);
                                        $('#nombre_usuario').val(response.tramite.nombre_usuario);
                                        $('#nombre_funcionario').val(response.tramite.nombre_funcionario);
                                        $('#tipo_tramite').val(response.tramite.tipo_tramite);
                                        $('#reasignar_id_tramite').val(response.tramite.id_tramite);
                                        $('#nombre_funcionario_asignado_INFORMACION').val(response.tramite.id_funcionario_asignado_INFORMACION);
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
    
                        $('#tbody-tramites').off('click', '.editarTramite').on('click', '.editarTramite', function () {
                            const idTramite = $(this).data('id-tramite');
    
                            $.ajax({
                                type: 'GET',
                                url: `/buscar-tramite-id`,
                                data: { idTramite },
                                success: function (response) {
                                    if (response.success) {
                                        window.location.href = `/matriculacion/informacion/editar-turno?id_tramite=${idTramite}`;
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
    
                        $('#tbody-tramites').off('click', '.visualizarTramite').on('click', '.visualizarTramite', function () {
                            const idTramite = $(this).data('id-tramite');
    
                            $.ajax({
                                type: 'GET',
                                url: `/buscar-tramite-id`,
                                data: { idTramite },
                                success: function (response) {
                                    if (response.success) {
    
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
    
                        $('#tbody-tramites').off('click', '.eliminarTramite').on('click', '.eliminarTramite', function () {
                            const idTramite = $(this).data('id-tramite');
                            $.ajax({
                                type: 'GET',
                                url: `/buscar-tramite-id`,
                                data: { idTramite },
                                success: function (response) {
                                    if (response.success) {
                                        $('#eliminar_placa').val(response.tramite.placa);
                                        $('#eliminar_nombre_usuario').val(response.tramite.nombre_usuario);
                                        $('#eliminar_nombre_funcionario').val(response.tramite.nombre_funcionario);
                                        $('#eliminar_tipo_tramite').val(response.tramite.tipo_tramite);
                                        $('#eliminar_id_tramite').val(response.tramite.id_tramite);
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
    
                        $('#tbody-tramites').off('click', '.imprimirTramite').on('click', '.imprimirTramite', function () {
                            const idTramite = $(this).data('id-tramite');
                            $.ajax({
                                type: 'GET',
                                url: `/buscar-tramite-id`,
                                data: { idTramite },
                                success: function (response) {
                                    if (response.success) {
                                        window.location.href = `/matriculacion/informacion/turno-agregado?id_tramite=${idTramite}`;
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
    
    
                    $('#TraPersonal').text(`${response.tramitesUsuario.length}`);
    
    
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


