function mostrarAlerta(mensaje, tipo = 'success') {

    $('#alert-container').find('.alert').remove();

    const estadoTexto =
        tipo === 'success' ? 'ÉXITO' :
            tipo === 'warning' ? 'ATENCIÓN' :
                tipo === 'danger' ? 'ERROR' :
                    'INFORMACIÓN';

    $('#alert-container').html(`
      <div class="alert alert-${tipo} alert-dismissible p-2 fade show d-flex col-12 align-items-center shadow-alert">
        <div class="col-11 pe-2">
          <div class="row">
            <strong class="col-12">¡${estadoTexto}!</strong>
          </div>
          <div class="row">
            <span class="col text-nowrap">
              ${mensaje}
            </span>
          </div>
        </div>
        <div class="col-auto">
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
      </div>
    `);

    const $alert = $('#alert-container').find('.alert');
    setTimeout(function () {
        $alert.addClass('fade-out');
        setTimeout(() => $alert.alert('close'), 1000);
    }, 3000);
}

$(document).ready(function () {
    $('#buscarTramite').click(function () {
        const placa = $('input[name="placa"]').val();
        const usernameSesion = $('#usernameSesion').data('username');

        $.ajax({
            type: 'GET',
            url: '/buscar-tramite-filtro',
            data: { placa },
            success: function (response) {
                const thead = $('#thead-tramites');
                const tbody = $('#tbody-tramites');
                tbody.empty();

                if (response.success) {
                    const usernameSesion = response.usernameSesion;

                    if (thead.children().length === 0) {

                        const headerRow = `
                          <tr class="text-dark">
                            <th class="text-center align-middle px-2 py-2 text-overflow-2">N°</th>
                            <th class="text-center align-middle px-2 py-2 text-overflow-4">FECHA</th>
                            <th class="text-center align-middle px-2 py-2 text-overflow-3">PLACA</th>
                            <th class="text-center align-middle px-2 py-2 text-overflow-9">TIPO DE TRAMITE</th>
                            <th class="text-center align-middle px-2 py-2 text-overflow-3">C.I / RUC / PASAPORTE</th>
                            <th class="text-center align-middle px-2 py-2 text-overflow-5 text-wrap">NOMBRE DEL PROPIETARIO</th>
                            <th class="text-center align-middle px-2 py-2 text-overflow-3">ESTADO</th>
                            <th class="text-center align-middle px-2 py-2 text-overflow-3">USUARIO</th>
                            <th class="text-center align-middle px-2 py-2 text-overflow-3">ACCIONES</th>
                          </tr>`;

                        thead.append(headerRow);
                    }

                    let numeroFila = 1;
                    response.tramites.forEach(tramite => {

                        const fechaOriginal = tramite.fecha_final_PRESENTACION;
                        const fecha = new Date(fechaOriginal);
                        fecha.setHours(fecha.getHours() + 5);
                        const dia = fecha.getDate().toString().padStart(2, '0');
                        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                        const año = fecha.getFullYear();
                        const hora = fecha.getHours().toString().padStart(2, '0');
                        const minutos = fecha.getMinutes().toString().padStart(2, '0');
                        const fechaFormateada = `${dia}-${mes}-${año} ${hora}:${minutos}`;

                        let estadoClass = '';
                        let opcionesHabilitadas = [];

                        if (tramite.estado_tramite === 'Finalizado') {
                            estadoClass = 'bg-info';

                        } else if (tramite.estado_tramite === 'En proceso') {
                            estadoClass = 'bg-wait';
                        }


                        opcionesHabilitadas.push(`
                            <li>
                                <a class="dropdown-item visualizarTramite text-black" href="#" 
                                   id="visualizar-${tramite.id_tramite}" 
                                   data-id-tramite="${tramite.id_tramite}"
                                   data-username="${tramite.username}">
                                   Visualizar
                                </a>
                            </li>
                                                            <li>
                                    <a class="dropdown-item editarTramite text-black" href="#" 
                                       id="editar-${tramite.id_tramite}" 
                                       data-id-tramite="${tramite.id_tramite}" 
                                       data-username="${tramite.username}">
                                       Editar
                                    </a>
                                </li>
                        `);

                        const opcionesMenu = opcionesHabilitadas.join('');

                        const newRow = `
                            <tr>
                                <td class="text-center">${numeroFila}</td>
                                <td class="text-center text-overflow-4">${fechaFormateada}</td>
                                <td class="text-center">${tramite.placa}</td>
                                <td class="text-overflow-9 text-nowrap" >${tramite.tipo_tramite}</td>
                                <td class="text-center">${tramite.id_usuario}</td>
                                <td class="text-overflow-5 text-nowrap">${tramite.nombre_usuario}</td>
                                <td class="text-center align-items-center justify-content-center text-overflow-4">
                                    <span class="round-8 ${estadoClass} rounded-circle d-inline-block ms-2"></span>
                                    <span class="badge text-dark rounded-pill fw-normal">${tramite.estado_tramite}</span>
                                </td>
                                <td class="text-center">${tramite.username}</td>


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

                                    $('#username_funcionario_INFORMACION').val(response.tramite.username_funcionario_INFORMACION);
                                    $('#nombre_funcionario_INFORMACION').val(response.tramite.nombre_funcionario_INFORMACION);

                                    $('#fecha_ingreso').text(response.tramite.fecha_ingreso);
                                    $('#id_tramite').text(response.tramite.id_tramite);

                                    $('#id_date_registraton').text(response.tramite.date_registraton);

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

                            console.info('Nombre de usuario de la sesión:', usernameSesion);
                            console.info('Nombre de usuario del trámite:', username);

                            if (username === usernameSesion) {
                                window.location.href = `/matriculacion/gestion-tramite/edicion-tramite?id_tramite=${idTramite}`;
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

        $.ajax({
            type: 'POST',
            url: '/buscar-vehiculo',
            data: { placa },
            success: function (response) {
                if (response.success) {


                    $('#ConsultaVehiculo_tipo_id_usuario').text(response.vehiculo.tipo_id_usuario.toUpperCase());
                    $('#ConsultaVehiculo_id_usuario').text(response.vehiculo.id_usuario);
                    $('#ConsultaVehiculo_nombre_usuario').text(response.vehiculo.nombre_usuario);

                } else {
                    alert('Vehículo no encontrado');
                }
            },
            error: function (error) {
                console.error('Error al buscar vehículo en la antigua js:', error);
                alert('Error al buscar vehículo. Por favor, inténtelo de nuevo.');
            }
        });
    });
});


//Para la vista de consulta de vehiculos
$(document).ready(function () {

    function buscarPorPlaca() {
        const placa = $('input[name="placa"]').val().trim();
        if (!placa) return;

        $('#overlay').addClass('active');

        $.ajax({
            type: 'GET',
            url: '/buscar-tramite-filtro-opt',
            data: { placa },
            success: function (response) {
                const tbody = $('#tbody-tramites');
                tbody.empty();

                if (response.success) {
                    let usernameSesion = response.usernameSesion;

                    $('#content').removeClass('d-none');
                    let numeroFila = 1;
                    response.tramites.forEach(tramite => {

                        const fechaOriginal = tramite.fecha_final_PRESENTACION;
                        const fecha = new Date(fechaOriginal);
                        fecha.setHours(fecha.getHours() + 5);
                        const dia = fecha.getDate().toString().padStart(2, '0');
                        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                        const año = fecha.getFullYear();
                        const hora = fecha.getHours().toString().padStart(2, '0');
                        const minutos = fecha.getMinutes().toString().padStart(2, '0');
                        const fechaFormateada = `${dia}-${mes}-${año} ${hora}:${minutos}`;

                        let estadoClass = '';
                        let opcionesHabilitadas = [];

                        if (tramite.estado_tramite === 'Finalizado') {
                            estadoClass = 'bg-info';
                        } else if (tramite.estado_tramite === 'En proceso') {
                            estadoClass = 'bg-wait';
                            opcionesHabilitadas.push(`
                                <li>
                                    <a class="dropdown-item reasignarTramite text-black px-4" href="#" data-bs-toggle="modal"
                                        data-bs-target="#modalReasignarTramite" id="reasignar-${tramite.id_tramite}"
                                        data-id-tramite="${tramite.id_tramite}" data-username="${tramite.username}">
                                        Reasignar
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item imprimirTramite text-black px-4" href="#" id="imprimir-${tramite.id_tramite}"
                                        data-id-tramite="${tramite.id_tramite}" data-username="${tramite.username}">
                                        Imprimir
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item reasignarTurno text-black px-4" href="#" data-bs-toggle="modal"
                                        data-bs-target="#modalreasignarTurno" id="reasignar-${tramite.id_tramite}"
                                        data-id-tramite="${tramite.id_tramite}" data-username="${tramite.username}">
                                        Reasignar turnos a la fecha actual
                                    </a>
                                </li>
                            `);
                            if ((tramite.username === usernameSesion) || (tramite.username_funcionario_asignado_INFORMACION === usernameSesion)) {
                                opcionesHabilitadas.push(`
                                    <li>
                                       <a class="dropdown-item atenderTramite text-black px-4" href="#" 
                                           id="editar-${tramite.id_tramite}" 
                                           data-id-tramite="${tramite.id_tramite}" data-placa="${tramite.placa}">
                                           Atender
                                       </a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item devolverTramite text-black px-4" href="#" data-bs-toggle="modal"
                                           data-bs-target="#modalDevolverTramite" id="reasignar-${tramite.id_tramite}"
                                           data-id-tramite="${tramite.id_tramite}" data-username="${tramite.username}">
                                           Devolver proceso
                                        </a>
                                    </li>
                               `);
                            }
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
                            <li>
                                <a class="dropdown-item visualizarDocumentoInformacion text-black px-4" href="#" 
                                   id="visualizar-${tramite.id_tramite}" 
                                   data-id-tramite="${tramite.id_tramite}"
                                   data-username="${tramite.username}"
                                   data-id-documento-informacion="${tramite.id_documento_informacion}">
                                   Visualizar documento (Información)
                                </a>
                            </li>
                        `);
                        if (tramite.username === usernameSesion) {
                            opcionesHabilitadas.push(`
                                 <li>
                                    <a class="dropdown-item editarTramite text-black px-4" href="#" 
                                        id="editar-${tramite.id_tramite}" 
                                        data-id-tramite="${tramite.id_tramite}" 
                                        data-username="${tramite.username}">
                                        Editar
                                    </a>
                                </li>
                            `);
                        }

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
                    });


                    $('#tbody-tramites').off('click', '.atenderTramite').on('click', '.atenderTramite', function () {
                        const idTramite = $(this).data('id-tramite');
                        const placa = $(this).data('placa');

                        $.ajax({
                            type: 'GET',
                            url: `/buscar-tramite-id`,
                            data: { idTramite },
                            success: function (response) {

                                if (!response.success) {
                                    alert('Error: no se pudo obtener la información del trámite.');
                                    return;
                                }

                                $.ajax({
                                    type: 'POST',
                                    url: '/registrar-tramite-en-atencion',
                                    data: {
                                        id_tramite: idTramite,
                                        placa: placa
                                    },
                                    success: function (res) {

                                        if (!res.success) {
                                            alert(res.message || 'No se pudo registrar el trámite en atención.');
                                            return;
                                        }

                                        window.location.href =
                                            `/matriculacion/registro-por-turno?id_tramite=${idTramite}`;
                                    },
                                    error: function () {
                                        alert('Error al registrar el trámite en atención.');
                                    }
                                });

                            },
                            error: function () {
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
                                    const fechaOriginal2 = response.tramite.fecha_final_PRESENTACION;
                                    const fecha = new Date(fechaOriginal2);
                                    fecha.setHours(fecha.getHours() + 5);
                                    const dia = fecha.getDate().toString().padStart(2, '0');
                                    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                                    const año = fecha.getFullYear();
                                    const hora = fecha.getHours().toString().padStart(2, '0');
                                    const minutos = fecha.getMinutes().toString().padStart(2, '0');
                                    const fechaFormateada = `${dia}-${mes}-${año} ${hora}:${minutos}`;

                                    $('#estado_tramite').text(response.tramite.estado_tramite);
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
                                    $('#username_funcionario_INFORMACION').val(response.tramite.username_funcionario_INFORMACION);
                                    $('#nombre_funcionario_INFORMACION').val(response.tramite.nombre_funcionario_INFORMACION);
                                    $('#fecha_ingreso').text(fechaFormateada);
                                    $('#id_tramite').text(response.tramite.id_tramite);
                                    $('#id_date_registraton').text(response.tramite.date_registraton);

                                    $('#permisosModal2').modal('show');
                                } else {
                                    alert('Error: no se pudo obtener la información del trámite.');
                                }
                            },
                            error: function () {
                                alert('Error al obtener detalles del trámite. Por favor, inténtelo de nuevo.');
                            }
                        });
                    });

                    $('#tbody-tramites').off('click', '.reasignarTramite').on('click', '.reasignarTramite', function () {
                        const idTramite = $(this).data('id-tramite');
                        $.ajax({
                            type: 'GET',
                            url: `/buscar-tramite-id`,
                            data: { idTramite },
                            success: function (response) {
                                if (response.success) {
                                    $('#reasignar_placa').val(response.tramite.placa);
                                    $('#reasignar_id_usuario').val(response.tramite.id_usuario);
                                    $('#reasignar_nombre_usuario').val(response.tramite.nombre_usuario);
                                    $('#reasignar_nombre_funcionario').val(response.tramite.nombre_funcionario);
                                    $('#reasignar_tipo_tramite').val(response.tramite.tipo_tramite);
                                    $('#reasignar_id_tramite').val(response.tramite.id_tramite);
                                    $('#nombre_funcionario_asignado_INFORMACION').val(response.tramite.id_funcionario_asignado_INFORMACION);
                                } else {
                                    alert('Error: no se pudo obtener la información del trámite.');
                                }
                            },
                            error: function () {
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
                            error: function () {
                                alert('Error al obtener detalles del trámite. Por favor, inténtelo de nuevo.');
                            }
                        });
                    });

                    $('#tbody-tramites').off('click', '.reasignarTurno').on('click', '.reasignarTurno', function () {
                        const idTramite = $(this).data('id-tramite');
                        $.ajax({
                            type: 'GET',
                            url: `/buscar-tramite-id`,
                            data: { idTramite },
                            success: function (response) {
                                if (response.success) {
                                    $('#reasignarTurnoFechaActual_placa').val(response.tramite.placa);
                                    $('#reasignarTurnoFechaActual_id_usuario').val(response.tramite.id_usuario);
                                    $('#reasignarTurnoFechaActual_nombre_usuario').val(response.tramite.nombre_usuario);
                                    $('#reasignarTurnoFechaActual_nombre_funcionario').val(response.tramite.nombre_funcionario);
                                    $('#reasignarTurnoFechaActual_tipo_tramite').val(response.tramite.tipo_tramite);
                                    $('#reasignarTurnoFechaActual_id_tramite').val(response.tramite.id_tramite);
                                } else {
                                    alert('Error: no se pudo obtener la información del trámite.');
                                }
                            },
                            error: function () {
                                alert('Error al obtener detalles del trámite. Por favor, inténtelo de nuevo.');
                            }
                        });
                    });

                    $('#tbody-tramites').off('click', '.devolverTramite').on('click', '.devolverTramite', function () {
                        const idTramite = $(this).data('id-tramite');
                        $.ajax({
                            type: 'GET',
                            url: `/buscar-tramite-id`,
                            data: { idTramite },
                            success: function (response) {
                                if (response.success) {
                                    $('#devolución_placa').val(response.tramite.placa);
                                    $('#devoluciór_id_usuario').val(response.tramite.id_usuario);
                                    $('#devolución_nombre_usuario').val(response.tramite.nombre_usuario);
                                    $('#devolución_nombre_funcionario').val(response.tramite.nombre_funcionario);
                                    $('#devolución_tipo_tramite').val(response.tramite.tipo_tramite);
                                    $('#devolución_id_tramite').val(response.tramite.id_tramite);
                                } else {
                                    alert('Error: no se pudo obtener la información del trámite.');
                                }
                            },
                            error: function () {
                                alert('Error al obtener detalles del trámite. Por favor, inténtelo de nuevo.');
                            }
                        });
                    });

                    $('#tbody-tramites').on('click', '.visualizarDocumentoInformacion', function () {
                        const idDocumento = $(this).data('id-documento-informacion');
                        $('#iframeDocumento').attr('src', `/documento/${idDocumento}`);
                        $('#documentoModal').modal('show');
                    });



                    response.tramites.forEach(tramite => {
                        $(`#editar-${tramite.id_tramite}`).click(function () {
                            const idTramite = $(this).data('id-tramite');
                            const username = $(this).data('username');

                            if (username === usernameSesion) {
                                window.location.href = `/matriculacion/gestion-tramite/edicion-tramite?id_tramite=${idTramite}`;
                            } else {
                                $('#permisosModal').modal('show');
                            }
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

        $.ajax({
            type: 'POST',
            url: '/buscar-vehiculo',
            data: { placa },
            success: function (response) {
                // Limpiar campos
                $('#ConsultaVehiculo_tipo_id_usuario').text('');
                $('#ConsultaVehiculo_id_usuario').text('');
                $('#ConsultaVehiculo_nombre_usuario').text('');
                $('#placaConsultada').text('');
                $('#ramw').text('');
                $('#chasis').text('');
                $('#motor').text('');
                $('#pais_origen').text('');
                $('#marca').text('');
                $('#modelo').text('');
                $('#año_modelo').text('');
                $('#combustible').text('');
                $('#cilindraje').text('');
                $('#tipo_peso').text('');
                $('#clase_transporte').text('');
                $('#clase_vehiculo').text('');
                $('#tipo_vehiculo').text('');

                if (response.success) {
                    $('#sinResultados').addClass('d-none');
                    $('#content').removeClass('d-none');
                    $('#ConsultaVehiculo_tipo_id_usuario').text((response.vehiculo.tipo_id_usuario || '').toUpperCase());
                    $('#ConsultaVehiculo_id_usuario').text(response.vehiculo.id_usuario);
                    $('#ConsultaVehiculo_nombre_usuario').text(response.vehiculo.nombre_usuario);
                    $('#placaConsultada').text(response.vehiculo.placa);
                    $('#ramw').text(response.vehiculo.ramw);
                    $('#chasis').text(response.vehiculo.chasis);
                    $('#motor').text(response.vehiculo.motor);
                    $('#pais_origen').text(response.vehiculo.pais_origen);
                    $('#marca').text(response.vehiculo.marca);
                    $('#modelo').text(response.vehiculo.modelo);
                    $('#año_modelo').text(response.vehiculo.año_modelo);
                    $('#combustible').text(response.vehiculo.combustible);
                    $('#cilindraje').text(response.vehiculo.cilindraje);
                    $('#tipo_peso').text(response.vehiculo.tipo_peso);
                    $('#clase_transporte').text(response.vehiculo.clase_transporte);
                    $('#clase_vehiculo').text(response.vehiculo.clase_vehiculo);
                    $('#tipo_vehiculo').text(response.vehiculo.tipo_vehiculo);
                    $('#overlay').removeClass('active');
                } else {
                    $('#sinResultados').removeClass('d-none');
                    $('#content').addClass('d-none');
                    $('#overlay').removeClass('active');
                    mostrarAlerta('Vehículo no encontrado', 'danger');
                }
            },
            error: function (error) {
                console.error('Error al buscar vehículo:', error);
                alert('Error al buscar vehículo. Por favor, inténtelo de nuevo.');
            }
        });
    }


    $('#consultarVehiculo').click(buscarPorPlaca);

    $(document).on('keyup', 'input[name="placa"]', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            buscarPorPlaca();
        }
    });

});

$(document).ready(function () {
    $('#consultarTramite').click(function () {
        const tipoIdBusqueda = $('select[name="tipoIdBusqueda"]').val();
        const placa = $('input[name="filtro"]').val();
        const usuario = $('select[name="usuarioBusqueda"]').val();
        const cédula = $('input[name="cédulaBusqueda"]').val();

        let filtro;

        if (tipoIdBusqueda === 'PLACA') {
            filtro = placa;

        } else if (tipoIdBusqueda === 'USUARIO') {

            filtro = usuario;

        } else if (tipoIdBusqueda === 'CÉDULA') {

            filtro = cédula;

        }

        $('#overlay').addClass('active');

        $.ajax({
            type: 'GET',
            url: '/buscar-tramite-filtro-seleccionado',
            data: { tipoIdBusqueda, filtro },
            success: function (response) {
                const tbody = $('#tbody-tramites');
                tbody.empty();

                if (response.success) {


                    const tramites = response.tramites;

                    if (tramites.length > 0) {

                        $('#contenido').removeClass('d-none');
                        $('#sinResultados').addClass('d-none');

                        let numeroFila = 1;
                        tramites.forEach(tramite => {

                            const fechaOriginal = tramite.fecha_final_PRESENTACION;
                            const fecha = new Date(fechaOriginal);
                            fecha.setHours(fecha.getHours() + 5);
                            const dia = fecha.getDate().toString().padStart(2, '0');
                            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                            const año = fecha.getFullYear();
                            const hora = fecha.getHours().toString().padStart(2, '0');
                            const minutos = fecha.getMinutes().toString().padStart(2, '0');
                            const fechaFormateada = `${dia}-${mes}-${año} ${hora}:${minutos}`;

                            let estadoClass = '';
                            let opcionesHabilitadas = [];

                            if (tramite.estado_tramite === 'Finalizado') {
                                estadoClass = 'bg-info';

                            } else if (tramite.estado_tramite === 'En proceso') {
                                estadoClass = 'bg-wait';
                            } else if (tramite.estado_tramite === 'Eliminado') {
                                estadoClass = 'bg-danger';
                            }

                            opcionesHabilitadas.push(`
                            <li>
                                <a class="dropdown-item visualizarTramite text-black" href="#" 
                                   id="visualizar-${tramite.id_tramite}" 
                                   data-id-tramite="${tramite.id_tramite}"
                                   data-username="${tramite.username}">
                                   Visualizar
                                </a>
                            </li>
                        `);

                            const opcionesMenu = opcionesHabilitadas.join('');

                            const newRow = `
                            <tr>
                                <td class="text-center">${numeroFila}</td>
                                <td class="text-overflow-4">${fechaFormateada}</td>
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
                        });

                        $('#overlay').removeClass('active');

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

                                        $('#username_funcionario_INFORMACION').val(response.tramite.username_funcionario_INFORMACION);
                                        $('#nombre_funcionario_INFORMACION').val(response.tramite.nombre_funcionario_INFORMACION);

                                        $('#fecha_ingreso').text(response.tramite.fecha_ingreso);
                                        $('#id_tramite').text(response.tramite.id_tramite);

                                        $('#id_date_registraton').text(response.tramite.date_registraton);

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

                    } else {

                        $('#sinResultados').removeClass('d-none');
                        $('#contenido').addClass('d-none');
                        $('#overlay').removeClass('active');
                    }


                } else {
                    $('#sinResultados').removeClass('d-none');
                    $('#contenido').addClass('d-none');
                    $('#overlay').removeClass('active');

                }
            },
            error: function (error) {
                console.error('Error al buscar Tramite:', error);
                alert('Error al buscar Tramite. Por favor, inténtelo de nuevo.');
            }
        });

    });
});

$(document).ready(function () {
    $('#buscarTramite').click(function () {
        const placa = $('input[name="placa"]').val();
        const usernameSesion = $('#usernameSesion').data('username');

        $.ajax({
            type: 'GET',
            url: '/buscar-tramite-filtro',
            data: { placa },
            success: function (response) {
                const thead = $('#thead-tramites');
                const tbody = $('#tbody-tramites');
                tbody.empty();

                if (response.success) {
                    const usernameSesion = response.usernameSesion;

                    if (thead.children().length === 0) {

                        const headerRow = `
                          <tr class="text-dark">
                            <th class="text-center align-middle px-2 py-2 text-overflow-2">N°</th>
                            <th class="text-center align-middle px-2 py-2 text-overflow-4">FECHA</th>
                            <th class="text-center align-middle px-2 py-2 text-overflow-3">PLACA</th>
                            <th class="text-center align-middle px-2 py-2 text-overflow-9">TIPO DE TRAMITE</th>
                            <th class="text-center align-middle px-2 py-2 text-overflow-3">C.I / RUC / PASAPORTE</th>
                            <th class="text-center align-middle px-2 py-2 text-overflow-5 text-wrap">NOMBRE DEL PROPIETARIO</th>
                            <th class="text-center align-middle px-2 py-2 text-overflow-3">ESTADO</th>
                            <th class="text-center align-middle px-2 py-2 text-overflow-3">USUARIO</th>
                            <th class="text-center align-middle px-2 py-2 text-overflow-3">ACCIONES</th>
                          </tr>`;

                        thead.append(headerRow);
                    }

                    let numeroFila = 1;
                    response.tramites.forEach(tramite => {

                        const fechaOriginal = tramite.fecha_final_PRESENTACION;
                        const fecha = new Date(fechaOriginal);
                        fecha.setHours(fecha.getHours() + 5);
                        const dia = fecha.getDate().toString().padStart(2, '0');
                        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                        const año = fecha.getFullYear();
                        const hora = fecha.getHours().toString().padStart(2, '0');
                        const minutos = fecha.getMinutes().toString().padStart(2, '0');
                        const fechaFormateada = `${dia}-${mes}-${año} ${hora}:${minutos}`;

                        let estadoClass = '';
                        let opcionesHabilitadas = [];

                        if (tramite.estado_tramite === 'Finalizado') {
                            estadoClass = 'bg-info';

                        } else if (tramite.estado_tramite === 'En proceso') {
                            estadoClass = 'bg-wait';
                        }


                        opcionesHabilitadas.push(`
                            <li>
                                <a class="dropdown-item visualizarTramite text-black" href="#" 
                                   id="visualizar-${tramite.id_tramite}" 
                                   data-id-tramite="${tramite.id_tramite}"
                                   data-username="${tramite.username}">
                                   Visualizar
                                </a>
                            </li>
                                        <li>
                                    <a class="dropdown-item editarTramite text-black" href="#" 
                                       id="editar-${tramite.id_tramite}" 
                                       data-id-tramite="${tramite.id_tramite}" 
                                       data-username="${tramite.username}">
                                       Editar
                                    </a>
                                </li>
                        `);

                        const opcionesMenu = opcionesHabilitadas.join('');

                        const newRow = `
                            <tr>
                                <td class="text-center">${numeroFila}</td>
                                <td class="text-center text-overflow-4">${fechaFormateada}</td>
                                <td class="text-center">${tramite.placa}</td>
                                <td class="text-overflow-9 text-nowrap" >${tramite.tipo_tramite}</td>
                                <td class="text-center">${tramite.id_usuario}</td>
                                <td class="text-overflow-5 text-nowrap">${tramite.nombre_usuario}</td>
                                <td class="text-center align-items-center justify-content-center text-overflow-4">
                                    <span class="round-8 ${estadoClass} rounded-circle d-inline-block ms-2"></span>
                                    <span class="badge text-dark rounded-pill fw-normal">${tramite.estado_tramite}</span>
                                </td>
                                <td class="text-center">${tramite.username}</td>


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

                                    $('#username_funcionario_INFORMACION').val(response.tramite.username_funcionario_INFORMACION);
                                    $('#nombre_funcionario_INFORMACION').val(response.tramite.nombre_funcionario_INFORMACION);

                                    $('#fecha_ingreso').text(response.tramite.fecha_ingreso);
                                    $('#id_tramite').text(response.tramite.id_tramite);

                                    $('#id_date_registraton').text(response.tramite.date_registraton);

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

                            console.info('Nombre de usuario de la sesión:', usernameSesion);
                            console.info('Nombre de usuario del trámite:', username);

                            if (username === usernameSesion) {
                                window.location.href = `/matriculacion/gestion-tramite/edicion-tramite?id_tramite=${idTramite}`;
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

        $.ajax({
            type: 'POST',
            url: '/buscar-vehiculo',
            data: { placa },
            success: function (response) {
                if (response.success) {


                    $('#ConsultaVehiculo_tipo_id_usuario').text(response.vehiculo.tipo_id_usuario.toUpperCase());
                    $('#ConsultaVehiculo_id_usuario').text(response.vehiculo.id_usuario);
                    $('#ConsultaVehiculo_nombre_usuario').text(response.vehiculo.nombre_usuario);

                } else {
                    alert('Vehículo no encontrado');
                }
            },
            error: function (error) {
                console.error('Error al buscar vehículo en la antigua js:', error);
                alert('Error al buscar vehículo. Por favor, inténtelo de nuevo.');
            }
        });
    });
});


//Para la vista de consulta de personas

$(document).ready(function () {

    $('#consultarPersonas').off('click').on('click', function () {
        const tipoIdBusqueda = $('select[name="tipoIdBusqueda"]').val();
        const identificación = $('input[name="identificación"]').val();
        const nombre = $('input[name="cédulaBusqueda"]').val();

        let filtro;

        if (tipoIdBusqueda === 'IDENTIFICACIÓN') {
            filtro = identificación;

        } else if (tipoIdBusqueda === 'NOMBRE') {

            filtro = nombre;

        }

        if (!identificación || identificación.length >= 15) {
            console.log("ID de usuario demasiado largo o vacío");
            $('#modalIDExtensa').modal('show');
            return;
        }

        let id_usuario = identificación;

        $('#overlay').addClass('active');

        $.ajax({
            type: 'POST',
            url: '/buscar-usuario',
            data: { id_usuario },
            success: function (response) {

                $('#nombre_usuario').val('');
                $('#provincia_usuario').val('');
                $('#canton_usuario').val('');
                $('#parroquia_usuario').val('');
                $('#direccion_usuario').val('');
                $('#celular_usuario').val('');
                $('#email_usuario').val('');

                if (response.success) {

                    $('#sinResultados').addClass('d-none');
                    $('#content').removeClass('d-none');

                    $('#ConsultaPersona_tipo_id_usuario').text(response.usuario.tipo_id_usuario);
                    $('#ConsultaPersona_id_usuario').text(response.usuario.id_usuario);
                    $('#ConsultaPersona_nombre_usuario').text(response.usuario.nombre_usuario);

                    $('#ConsultaPersona_canton_usuario').text(response.usuario.canton_usuario);
                    $('#ConsultaPersona_celular_usuario').text(response.usuario.celular_usuario);


                    $('#nombre_usuario').val(response.usuario.nombre_usuario);
                    $('#provincia_usuario').val(response.usuario.provincia_usuario);
                    $('#canton_usuario').val(response.usuario.canton_usuario);
                    $('#parroquia_usuario').val(response.usuario.parroquia_usuario);
                    $('#direccion_usuario').val(response.usuario.direccion_usuario);
                    $('#celular_usuario').val(response.usuario.celular_usuario);
                    $('#email_usuario').val(response.usuario.email_usuario);
                    $('#provincia_usuario').trigger('change');

                    $('#overlay').removeClass('active');

                } else {

                    $('#sinResultados').removeClass('d-none');
                    $('#content').addClass('d-none');
                    $('#overlay').removeClass('active');
                    mostrarAlerta('Usuario no encontrado.', 'warning');
                }
            },
            error: function (error) {
                console.error('Error al buscar usuario:', error);
                alert('Error al buscar usuario. Por favor, inténtelo de nuevo.');
            }
        });
    });
});



