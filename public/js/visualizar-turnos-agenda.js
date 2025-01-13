$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: '/visualizar-turnos-agenda',
        success: function (response) {
            const tbody = $('#tbody-tramites'); tbody.empty();

            const tbodyG = $('#tbody-tramitesGeneral'); tbodyG.empty();

            const tbodyEmpresa = $('#tbody-tramitesEmpresa'); tbodyEmpresa.empty();

            if (response.success) {


                let numeroFila = 1;
                response.tramitesHoy.forEach(tramite => {
                    
                    const fechaIngresoOriginal = tramite.fecha_ingreso_INFORMACION;
                    const fechaIngreso = new Date(fechaIngresoOriginal);
                    fechaIngreso.setHours(fechaIngreso.getHours() + 5);

                    
                    const diaIngreso = fechaIngreso.getDate().toString().padStart(2, '0');
                    const mesIngreso = (fechaIngreso.getMonth() + 1).toString().padStart(2, '0');
                    const añoIngreso = fechaIngreso.getFullYear();
                    const horaIngreso = fechaIngreso.getHours().toString().padStart(2, '0');
                    const minutosIngreso = fechaIngreso.getMinutes().toString().padStart(2, '0');
                    const fechaIngresoFormateada = `${diaIngreso}-${mesIngreso}-${añoIngreso} ${horaIngreso}:${minutosIngreso}`;

                    let tiempoEspera = '';
                    if (tramite.fecha_finalizacion) {
                        const fechaFinalizacionOriginal = tramite.fecha_finalizacion;
                        const fechaFinalizacion = new Date(fechaFinalizacionOriginal);
                        fechaFinalizacion.setHours(fechaFinalizacion.getHours() + 5);

                        const fechaIngresoOriginal = tramite.fecha_ingreso_INFORMACION;
                        const fechaIngreso = new Date(fechaIngresoOriginal);
                        fechaIngreso.setHours(fechaIngreso.getHours() + 5);

                        const diffMs = fechaFinalizacion - fechaIngreso;

                        const diferenciaHorass = Math.floor(diffMs / (1000 * 60 * 60));
                        const diferenciaMinutoss = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

                        tiempoEspera = `${diferenciaHorass} horas ${diferenciaMinutoss} min.`;

                    } else {
                        
                        const fechaActual = new Date();
                        const diferenciaMs = fechaActual - fechaIngreso;
                        const diferenciaHoras = Math.floor(diferenciaMs / (1000 * 60 * 60));
                        const diferenciaMinutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));

                        tiempoEspera = `${diferenciaHoras} horas ${diferenciaMinutos} min.`;
                    }

                    let estadoClass = '';
                    let estadoFont = '';
                    let opcionesHabilitadas = [];

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
                                <a class="dropdown-item atenderTramite text-black px-4" href="#" 
                                   id="editar-${tramite.id_tramite}" 
                                   data-id-tramite="${tramite.id_tramite}">
                                   Atender
                               </a>
                            </li>







                            <li>
                                <a class="dropdown-item reasignarTramite text-black px-4" href="#" 
                                   data-bs-toggle="modal" data-bs-target="#modalReasignarTramite" 
                                   id="reasignar-${tramite.id_tramite}" 
                                   data-id-tramite="${tramite.id_tramite}" 
                                   data-username="${tramite.username}">
                                   Reasignar
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item eliminarTramite text-black px-4" href="#" 
                                   data-bs-toggle="modal" data-bs-target="#modalEliminarTramite" 
                                   id="eliminar-${tramite.id_tramite}" 
                                   data-id-tramite="${tramite.id_tramite}" 
                                   data-username="${tramite.username}">
                                   Eliminar
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
                            <td class="text-center fw-semibold text-blue">
                                <a href="#" class="text-blue atenderTramite"
                                    id="editar-${tramite.id_tramite}"
                                    data-id-tramite="${tramite.id_tramite}">
                                    ${tramite.placa}
                                </a>
                            </td>
                            <td class="text-overflow-13">${tramite.tipo_tramite}</td>
                            <td class="text-center">${fechaIngresoFormateada}</td>
                            <td class="text-center text-overflow-4 ${estadoFont}">${tiempoEspera}</td>
                            <td class="text-center text-overflow-1">${tramite.numero_turno_INFORMACION}</td>
                            <td class="align-items-center justify-content-start text-overflow-4">
                                <span class="round-8 ${estadoClass} rounded-circle d-inline-block ms-2"></span>
                                <span class="badge text-dark rounded-pill fw-normal">${tramite.estado_tramite}</span>
                            </td>
                            <td class="text-center text-overflow-4">${tramite.username_funcionario_INFORMACION}</td>
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
                        </tr>`;
                    tbody.append(newRow);
                    numeroFila++;


                    $('#tbody-tramites').on('click', '.atenderTramite', function () {
                        const idTramite = $(this).data('id-tramite');
                        console.info(idTramite);

                        $.ajax({
                            type: 'GET',
                            url: `/buscar-tramite-id`,
                            data: { idTramite },
                            success: function (response) {
                                if (response.success) {

                                    window.location.href = `/matriculacion/registro-por-turno?id_tramite=${idTramite}`;
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

                    $('#tbody-tramites').on('click', '.reasignarTramite', function () {
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
                     /*
                    $('#tbody-tramites').on('click', '.editarTramite', function () {
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
                
                      */

                    $('#tbody-tramites').on('click', '.visualizarTramite', function () {
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

                    $('#tbody-tramites').on('click', '.eliminarTramite', function () {
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

                    $('#tbody-tramites').on('click', '.imprimirTramite', function () {
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


                let numeroFilaG = 1;
                response.tramitesPendientes.forEach(tramite => {
                    
                    const fechaIngresoOriginal = tramite.fecha_ingreso_INFORMACION;
                    const fechaIngreso = new Date(fechaIngresoOriginal);
                    fechaIngreso.setHours(fechaIngreso.getHours() + 5);

                    
                    const diaIngreso = fechaIngreso.getDate().toString().padStart(2, '0');
                    const mesIngreso = (fechaIngreso.getMonth() + 1).toString().padStart(2, '0');
                    const añoIngreso = fechaIngreso.getFullYear();
                    const horaIngreso = fechaIngreso.getHours().toString().padStart(2, '0');
                    const minutosIngreso = fechaIngreso.getMinutes().toString().padStart(2, '0');
                    const fechaIngresoFormateada = `${diaIngreso}-${mesIngreso}-${añoIngreso} ${horaIngreso}:${minutosIngreso}`;

                    let tiempoEspera = '';
                    if (tramite.fecha_finalizacion) {
                        const fechaFinalizacionOriginal = tramite.fecha_finalizacion;
                        const fechaFinalizacion = new Date(fechaFinalizacionOriginal);
                        fechaFinalizacion.setHours(fechaFinalizacion.getHours() + 5);

                        const fechaIngresoOriginal = tramite.fecha_ingreso_INFORMACION;
                        const fechaIngreso = new Date(fechaIngresoOriginal);
                        fechaIngreso.setHours(fechaIngreso.getHours() + 5);

                        const diffMs = fechaFinalizacion - fechaIngreso;

                        const diferenciaHorass = Math.floor(diffMs / (1000 * 60 * 60));
                        const diferenciaMinutoss = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

                        tiempoEspera = `${diferenciaHorass} horas ${diferenciaMinutoss} min.`;

                    } else {
                        
                        const fechaActual = new Date();
                        const diferenciaMs = fechaActual - fechaIngreso;
                        const diferenciaHoras = Math.floor(diferenciaMs / (1000 * 60 * 60));
                        const diferenciaMinutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));

                        tiempoEspera = `${diferenciaHoras} horas ${diferenciaMinutos} min.`;
                    }



                    let estadoClass = '';
                    let estadoFont = '';
                    let opcionesHabilitadas = [];

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
                                <a class="dropdown-item atenderTramite text-black px-4" href="#" 
                                   id="editar-${tramite.id_tramite}" 
                                   data-id-tramite="${tramite.id_tramite}">
                                   Atender
                               </a>
                            </li>






                            
                            <li>
                                <a class="dropdown-item reasignarTramite text-black px-4" href="#" 
                                   data-bs-toggle="modal" data-bs-target="#modalReasignarTramite" 
                                   id="reasignar-${tramite.id_tramite}" 
                                   data-id-tramite="${tramite.id_tramite}" 
                                   data-username="${tramite.username}">
                                   Reasignar
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item eliminarTramite text-black px-4" href="#" 
                                   data-bs-toggle="modal" data-bs-target="#modalEliminarTramite" 
                                   id="eliminar-${tramite.id_tramite}" 
                                   data-id-tramite="${tramite.id_tramite}" 
                                   data-username="${tramite.username}">
                                   Eliminar
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

                    const newRow2 = `
                        <tr style="border-style: none; border-bottom: 1px solid #dddee4;">
                            <td class="text-center">${numeroFilaG}</td>
                            <td class="text-center">${tramite.id_tramite}</td>
                            <td class="text-center fw-semibold text-blue">
                                <a href="#" class="text-blue atenderTramite"
                                    id="editar-${tramite.id_tramite}"
                                    data-id-tramite="${tramite.id_tramite}">
                                    ${tramite.placa}
                                </a>
                            </td>
                            <td class="text-overflow-13">${tramite.tipo_tramite}</td>
                            <td class="text-center">${fechaIngresoFormateada}</td>
                            <td class="text-center text-overflow-4 ${estadoFont}">${tiempoEspera}</td>
                            <td class="text-center text-overflow-1">${tramite.numero_turno_INFORMACION}</td>
                            <td class="align-items-center justify-content-start text-overflow-4">
                                <span class="round-8 ${estadoClass} rounded-circle d-inline-block ms-2"></span>
                                <span class="badge text-dark rounded-pill fw-normal">${tramite.estado_tramite}</span>
                            </td>
                            <td class="text-center text-overflow-4">${tramite.username_funcionario_INFORMACION}</td>
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
                        </tr>`;
                    tbodyG.append(newRow2);
                    numeroFilaG++;

                    $('#tbody-tramitesGeneral').on('click', '.atenderTramite', function () {
                        const idTramite = $(this).data('id-tramite');

                        $.ajax({
                            type: 'GET',
                            url: `/buscar-tramite-id`,
                            data: { idTramite },
                            success: function (response) {
                                if (response.success) {

                                    window.location.href = `/matriculacion/registro-por-turno?id_tramite=${idTramite}`;
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

                    $('#tbody-tramitesGeneral').on('click', '.reasignarTramite', function () {
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

                    $('#tbody-tramitesGeneral').on('click', '.editarTramite', function () {
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

                    $('#tbody-tramitesGeneral').on('click', '.visualizarTramite', function () {
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

                    $('#tbody-tramitesGeneral').on('click', '.eliminarTramite', function () {
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

                    $('#tbody-tramitesGeneral').on('click', '.imprimirTramite', function () {
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

                let numeroFilaE = 1;
                response.tramitesPendientesEmpresa.forEach(tramite => {
                    
                    const fechaIngresoOriginal = tramite.fecha_ingreso_INFORMACION;
                    const fechaIngreso = new Date(fechaIngresoOriginal);
                    fechaIngreso.setHours(fechaIngreso.getHours() + 5);

                    
                    const diaIngreso = fechaIngreso.getDate().toString().padStart(2, '0');
                    const mesIngreso = (fechaIngreso.getMonth() + 1).toString().padStart(2, '0');
                    const añoIngreso = fechaIngreso.getFullYear();
                    const horaIngreso = fechaIngreso.getHours().toString().padStart(2, '0');
                    const minutosIngreso = fechaIngreso.getMinutes().toString().padStart(2, '0');
                    const fechaIngresoFormateada = `${diaIngreso}-${mesIngreso}-${añoIngreso} ${horaIngreso}:${minutosIngreso}`;

                    let tiempoEspera = '';
                    if (tramite.fecha_finalizacion) {
                        
                        const fechaFinalizacionOriginal = tramite.fecha_finalizacion;
                        const fechaFinalizacion = new Date(fechaFinalizacionOriginal);
                        fechaFinalizacion.setHours(fechaFinalizacion.getHours() + 5);

                        const diaFinalizacion = fechaFinalizacion.getDate().toString().padStart(2, '0');
                        const mesFinalizacion = (fechaFinalizacion.getMonth() + 1).toString().padStart(2, '0');
                        const añoFinalizacion = fechaFinalizacion.getFullYear();
                        const horaFinalizacion = fechaFinalizacion.getHours().toString().padStart(2, '0');
                        const minutosFinalizacion = fechaFinalizacion.getMinutes().toString().padStart(2, '0');

                        tiempoEspera = `Finalizado el ${diaFinalizacion}-${mesFinalizacion}-${añoFinalizacion} ${horaFinalizacion}:${minutosFinalizacion}`;
                    } else {
                        
                        const fechaActual = new Date();
                        const diferenciaMs = fechaActual - fechaIngreso;
                        const diferenciaHoras = Math.floor(diferenciaMs / (1000 * 60 * 60));
                        const diferenciaMinutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));

                        tiempoEspera = `${diferenciaHoras} horas ${diferenciaMinutos} min.`;
                    }

                    let estadoClass = '';
                    let estadoFont = '';
                    let opcionesHabilitadas = [];

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
                                   Reasignar
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

                    const newRow3 = `
                        <tr style="border-style: none; border-bottom: 1px solid #dddee4;">
                            <td class="text-center">${numeroFilaE}</td>
                            <td class="text-center">${tramite.id_tramite}</td>
                            <td class="text-center">${tramite.placa}</td>
                            <td class="text-overflow-13">${tramite.tipo_tramite}</td>
                            <td class="text-center">${fechaIngresoFormateada}</td>
                            <td class="text-center text-overflow-4 fw-semibold">${tiempoEspera}</td>
                            <td class="text-center text-overflow-1">${tramite.numero_turno_INFORMACION}</td>
                            <td class="align-items-center justify-content-start text-overflow-4">
                                <span class="round-8 bg-wait rounded-circle d-inline-block ms-2"></span>
                                <span class="badge text-dark rounded-pill fw-normal">${tramite.estado_tramite}</span>
                            </td>
                            <td class="text-center text-overflow-4">${tramite.username_funcionario_INFORMACION}</td>
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
                        </tr>`;
                    tbodyEmpresa.append(newRow3);
                    numeroFilaE++;


                    $('#tbody-tramitesEmpresa').on('click', '.atenderTramite', function () {
                        const idTramite = $(this).data('id-tramite');

                        $.ajax({
                            type: 'GET',
                            url: `/buscar-tramite-id`,
                            data: { idTramite },
                            success: function (response) {
                                if (response.success) {

                                    window.location.href = `/matriculacion/registro-por-turno?id_tramite=${idTramite}`;
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

                    $('#tbody-tramitesEmpresa').on('click', '.reasignarTramite', function () {
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

                    $('#tbody-tramitesEmpresa').on('click', '.visualizarTramite', function () {
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

                    $('#tbody-tramitesEmpresa').on('click', '.eliminarTramite', function () {
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

                    $('#tbody-tramitesEmpresa').on('click', '.imprimirTramite', function () {
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

