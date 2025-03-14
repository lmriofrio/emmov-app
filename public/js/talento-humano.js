
///// ==      Funcionarios  ==    ////
$(document).ready(function () {
    if ($('body').data('vista') === 'vista-funcionarios') {

        $.ajax({
            type: 'GET',
            url: '/visualizar-FuncionarioTTHH',
            success: function (response) {
                const tbody = $('#tbody-tramites'); tbody.empty();

                if (response.success) {


                    let numeroFila = 1;
                    response.funcionariosTTHH.forEach(funcionario => {

                        let opcionesHabilitadas = [];

                        
                        
                        const opcionesMenu = opcionesHabilitadas.join('');

                        const newRow = `
                        <tr style="border-style: none; border-bottom: 1px solid #dddee4;">
                            <td class="text-center">${numeroFila}</td>
                            <td class="text-start text-overflow-2">${funcionario.id_funcionario}</td>
                            <td class="text-start text-overflow-6">${funcionario.nombre_funcionario}</td>
                            <td class="text-center text-overflow-4">${funcionario.email_funcionario}</td>
                            <td class="text-center text-overflow-3">${funcionario.id_empresa}</td>
                            <td class="text-center text-overflow-3">${funcionario.nombre_corto_empresa}</td>
                            <td class="text-center align-items-center justify-content-center p-2 text-overflow-6">
                                                    <div class="btn-group me-4">
                                                        <button
                                                            class="btn btn-light-one  px-2 py-1 visualizarRegistros"
                                                            data-id-tramite="${funcionario.id_funcionario}">
                                                            <i class="ti ti-file-text"></i>
                                                            Visualizar registros
                                                        </button>
                                                    </div>
                                                    <div class="btn-group">
                                                        <button
                                                            class="btn btn-light-primary text-primary px-2 py-1 crearFaltaRegistro"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#modalcrearFaltaRegistro"
                                                            data-id-funcionario="${funcionario.id_funcionario}">
                                                            <i class="ti ti-square-rounded-plus"></i>
                                                            Crear registro
                                                        </button>

                                                    </div>
                            </td>
                        </tr>
                    `;
                        tbody.append(newRow);
                        numeroFila++;

                        $('#tbody-tramites').off('click', '.visualizarRegistros').on('click', '.visualizarRegistros', function () {
                            const idFuncionario = $(this).data('id-tramite');
                        
                            $.ajax({
                                type: 'GET',
                                url: `/buscar-funcionario-TTHH`,
                                data: { idFuncionario },
                                success: function (response) {
                                    if (response.success) {
                                        window.location.href = `/talento-humano/vista-funcionario?id_funcionario=${idFuncionario}`;
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
                        

                        $('#tbody-tramites').off('click', '.crearFaltaRegistro').on('click', '.crearFaltaRegistro', function () {
                            const idFuncionario = $(this).data('id-funcionario');
                            $.ajax({
                                type: 'GET',
                                url: `/buscar-funcionario-TTHH`,
                                data: { idFuncionario },
                                success: function (response) {
                                    if (response.success) {
                                        $('#agg_id_funcionario').val(response.funcionarioTTHH.id_funcionario);
                                        $('#agg_nombre_funcionario').val(response.funcionarioTTHH.nombre_funcionario);
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

                    $('#TraPersonal').text(`${response.funcionariosTTHH.length}`);

                } else {
                    console.log('TRÁMITES NO ENCONTRADOS');
                }
            },
            error: function (error) {
                console.error('Error al buscar Tramite:', error);
                alert('Error al buscar Tramite. Por favor, inténtelo de nuevo.');
            }
        });

    }

});

///// ==      Funcionario  ==    ////
$(document).ready(function () {
    if ($('body').data('vista') === 'vista-funcionario') {

        const idFuncionario = $('input[name="id_usuario"]').val();

        $.ajax({
            type: 'GET',
            url: '/buscar-funcionario-TTHH',
            data: { idFuncionario },
            success: function (response) {

                if (response.success) {

                    $('#ConsultaFuncionario_id_funcionario').text(`${response.funcionarioTTHH.id_funcionario}`);
                    $('#ConsultaFuncionario_nombre_funcionario').text(`${response.funcionarioTTHH.nombre_funcionario}`);
                    $('#ConsultaFuncionario_email_funcionario').text(`${response.funcionarioTTHH.email_funcionario}`);
                    $('#ConsultaFuncionario_nombre_corto_empresa').text(`${response.funcionarioTTHH.nombre_corto_empresa}`);

                } else {
                    console.log('TRÁMITES NO ENCONTRADOS');
                }
            },
            error: function (error) {
                console.error('Error al buscar Tramite:', error);
                alert('Error al buscar Tramite. Por favor, inténtelo de nuevo.');
            }
        });
    }
});

///// ==      Funcionario   ==    ////
$(document).ready(function () {
    if ($('body').data('vista') === 'vista-funcionario') {

        const idFuncionario = $('input[name="id_usuario"]').val();

        $.ajax({
            type: 'GET',
            url: '/visualizar-fatas-asistencia-act',
            data: { idFuncionario },
            success: function (response) {
                const tbody = $('#tbody-tramites'); tbody.empty();

                if (response.success) {


                    let numeroFila = 1;
                    response.faltaAsistenciasTTHH.forEach(funcionario => {


                        const tiempoDescuento = funcionario.tiempo_descuento;
                        const [horas, minutos] = tiempoDescuento.split(':');
                        const tiempoDescuentoFormateado = `${horas}:${minutos}`;

                        const fechaOriginal = funcionario.fecha;
                        const fechaIngreso = new Date(fechaOriginal);
                        fechaIngreso.setHours(fechaIngreso.getHours() + 5);

                        const diaIngreso = fechaIngreso.getDate().toString().padStart(2, '0');
                        const mesIngreso = (fechaIngreso.getMonth() + 1).toString().padStart(2, '0');
                        const añoIngreso = fechaIngreso.getFullYear();
                        const fechaFormateada = `${diaIngreso}-${mesIngreso}-${añoIngreso}`;

                        let opcionesHabilitadas = [];

                        let estadoColor = '';

                        opcionesHabilitadas.push(`
                            <li>
                                <a class="dropdown-item visualizarRegistro text-black px-4" href="#" 
                                    data-bs-toggle="modal" data-bs-target="#modalVisualizarRegistro" 
                                    id="eliminar-${funcionario.id_registro}" 
                                    data-id-tramite="${funcionario.id_registro}" 
                                    data-username="${funcionario.id_registro}">
                                    Visualizar registro
                                </a>
                            </li>
                        `);

                        if (funcionario.estado === 'NO JUSTIFICADO') {
                            estadoColor = 'bg-primary-red';
                            opcionesHabilitadas.push(`
                                <li>
                                    <a class="dropdown-item justificarRegistro text-black px-4" href="#" 
                                        data-bs-toggle="modal" data-bs-target="#modalJustificarRegistro" 
                                        id="eliminar-${funcionario.id_registro}" 
                                        data-id-tramite="${funcionario.id_registro}" 
                                        data-username="${funcionario.id_registro}">
                                        Justificar
                                    </a>
                                </li>
                            `);

                        } else if (funcionario.estado === 'JUSTIFICADO') {
                            estadoColor = 'bg-primary-green';
                        }

                        opcionesHabilitadas.push(`
                            <li>
                                <a class="dropdown-item editarRegistro text-black px-4" href="#" 
                                    data-bs-toggle="modal" data-bs-target="#modalEditarRegistro" 
                                    id="eliminar-${funcionario.id_registro}" 
                                    data-id-tramite="${funcionario.id_registro}" 
                                    data-username="${funcionario.id_registro}">
                                    Editar registro
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item eliminarRegistro text-black px-4" href="#" 
                                    data-bs-toggle="modal" data-bs-target="#modalEliminarRegistro" 
                                    id="eliminar-${funcionario.id_registro}" 
                                    data-id-tramite="${funcionario.id_registro}" 
                                    data-username="${funcionario.id_registro}">
                                    Eliminar registro
                                </a>
                            </li>
                        `);

                        const opcionesMenu = opcionesHabilitadas.join('');

                        const newRow = `
                            <tr style="border-style: none; border-bottom: 1px solid #dddee4;">
                                <td class="text-center">${numeroFila}</td>
                                <td class="text-center text-overflow-2">${funcionario.id_registro}</td>
                                <td class="text-center text-overflow-3">${funcionario.nombre_funcionario}</td>
                                <td class="text-center text-overflow-2">${fechaFormateada}</td>
                                <td class="text-start text-overflow-5">${funcionario.motivo}</td>
                                <td class="text-center text-overflow-4">${tiempoDescuentoFormateado}</td>
                                <td class="text-center text-overflow-3">
                                    <span class="${estadoColor} badge bg-primary-red rounded fw-semibold
                                     mb-0 me-2"">${funcionario.estado}</span>
                                </td>
                                <td class="text-center text-overflow-3">${funcionario.notificado_email}</td>
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

                        $('#tbody-tramites').off('click', '.visualizarRegistro').on('click', '.visualizarRegistro', function () {
                            const id_registro = $(this).data('id-tramite');
                            $.ajax({
                                type: 'GET',
                                url: `/buscar-falta-asistencia`,
                                data: { id_registro },
                                success: function (response) {
                                    if (response.success) {

                                        $('#vsl_id_registro2').text(response.faltaAsistenciasTTHH.id_registro);
                                        $('#vsl_id_registro').val(response.faltaAsistenciasTTHH.id_registro);
                                        $('#vsl_id_funcionario2').val(response.faltaAsistenciasTTHH.id_funcionario);
                                        $('#vsl_nombre_funcionario2').val(response.faltaAsistenciasTTHH.nombre_funcionario);
                                        $('#vsl_id_funcionario').val(response.faltaAsistenciasTTHH.id_funcionario);
                                        $('#vsl_nombre_funcionario').val(response.faltaAsistenciasTTHH.nombre_funcionario);
                                        $('#vsl_notificado_email').val(response.faltaAsistenciasTTHH.notificado_email);
                                        $('#vsl_email_notificado').val(response.faltaAsistenciasTTHH.email_notificado);
                                        $('#vsl_fecha_notificación').val(response.faltaAsistenciasTTHH.fecha_notificación);
                                        $('#vsl_funcionarioTTHH').text(response.faltaAsistenciasTTHH.nombre_funcionarioTTHH);
                                        $('#vsl_fechaTTHH').text(response.faltaAsistenciasTTHH.fecha_registroTTHH);

                                        $('#vsl_fecha').val(response.faltaAsistenciasTTHH.fecha);

                                        let fechaJustificacion = (response.faltaAsistenciasTTHH.fecha_justificacion);
                                        let fecha = new Date(fechaJustificacion);
                                        fecha.setHours(fecha.getHours() + 5);
                                        let dia = fecha.getDate().toString().padStart(2, '0');
                                        let mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                                        let año = fecha.getFullYear();
                                        let hora = fecha.getHours().toString().padStart(2, '0');
                                        let minutos = fecha.getMinutes().toString().padStart(2, '0');
                                        let fechaFormateadaJ = `${año}-${mes}-${dia}T${hora}:${minutos}`;

                                        console.log('fechaFormateadaJ', fechaFormateadaJ);

                                        const AggtiempoDescuento = (response.faltaAsistenciasTTHH.tiempo_descuento);
                                        console.log('#agg_tiempo_horas', AggtiempoDescuento);
                                        const [Agghoras, Aggminutos] = AggtiempoDescuento.split(':');

                                        const tiempoDescuentoFormateado = `${Agghoras}:${Aggminutos}`;

                                        console.log('#agg_tiempo_horas', tiempoDescuentoFormateado);

                                        $('#vsl_tiempo_descuento').val(tiempoDescuentoFormateado);
                                        $('#vsl_motivo').val(response.faltaAsistenciasTTHH.motivo);
                                        if (response.faltaAsistenciasTTHH.estado === 'JUSTIFICADO') {
                                            $('#contentJustificar').removeClass('d-none');

                                        } else if (funcionario.estado === 'NO JUSTIFICADO') {
                                            $('#contentJustificar').addClass('d-none');
                                        }


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

                        $('#tbody-tramites').off('click', '.editarRegistro').on('click', '.editarRegistro', function () {
                            const id_registro = $(this).data('id-tramite');
                            $.ajax({
                                type: 'GET',
                                url: `/buscar-falta-asistencia`,
                                data: { id_registro },
                                success: function (response) {
                                    if (response.success) {
                                        $('#agg_id_registro2').text(response.faltaAsistenciasTTHH.id_registro);
                                        $('#agg_id_registro').val(response.faltaAsistenciasTTHH.id_registro);
                                        $('#agg_id_funcionario2').val(response.faltaAsistenciasTTHH.id_funcionario);
                                        $('#agg_nombre_funcionario2').val(response.faltaAsistenciasTTHH.nombre_funcionario);
                                        $('#agg_id_funcionario').val(response.faltaAsistenciasTTHH.id_funcionario);
                                        $('#agg_nombre_funcionario').val(response.faltaAsistenciasTTHH.nombre_funcionario);
                                        $('#agg_notificado_email').val(response.faltaAsistenciasTTHH.notificado_email);
                                        $('#agg_email_notificado').val(response.faltaAsistenciasTTHH.email_notificado);
                                        $('#agg_fecha_notificación').val(response.faltaAsistenciasTTHH.fecha_notificación);

                                        $('#agg_fecha').val(response.faltaAsistenciasTTHH.fecha);

                                        let fechaJustificacion = (response.faltaAsistenciasTTHH.fecha_justificacion);
                                        let fecha = new Date(fechaJustificacion);
                                        fecha.setHours(fecha.getHours() + 5);
                                        let dia = fecha.getDate().toString().padStart(2, '0');
                                        let mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                                        let año = fecha.getFullYear();
                                        let hora = fecha.getHours().toString().padStart(2, '0');
                                        let minutos = fecha.getMinutes().toString().padStart(2, '0');
                                        let fechaFormateadaJ = `${año}-${mes}-${dia}T${hora}:${minutos}`;

                                        console.log('fechaFormateadaJ', fechaFormateadaJ);

                                        const AggtiempoDescuento = (response.faltaAsistenciasTTHH.tiempo_descuento);
                                        console.log('#agg_tiempo_horas', AggtiempoDescuento);
                                        const [Agghoras, Aggminutos] = AggtiempoDescuento.split(':');

                                        console.log('#agg_tiempo_horas', Agghoras);
                                        console.log('#agg_tiempo_horas', Aggminutos);

                                        $('#agg_tiempo_horas').val(Agghoras);
                                        $('#agg_tiempo_minutos').val(Aggminutos);
                                        $('#agg_motivo').val(response.faltaAsistenciasTTHH.motivo);

                                        $('#agg_estado').val(response.faltaAsistenciasTTHH.estado);

                                        $('#agg_fecha_justificacion').val(fechaFormateadaJ);
                                        $('#agg_motivo_justificacion').val(response.faltaAsistenciasTTHH.motivo_justificacion);
                                        $('#agg_observación_justificacion').val(response.faltaAsistenciasTTHH.observación_justificacion);


                                        if (response.faltaAsistenciasTTHH.estado === 'JUSTIFICADO') {
                                            $('#contentJustificar').removeClass('d-none');

                                        } else if (funcionario.estado === 'NO JUSTIFICADO') {
                                            $('#contentJustificar').addClass('d-none');
                                        }


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

                        $('#tbody-tramites').off('click', '.eliminarRegistro').on('click', '.eliminarRegistro', function () {
                            const id_registro = $(this).data('id-tramite');

                            $.ajax({
                                type: 'GET',
                                url: `/buscar-falta-asistencia`,
                                data: { id_registro },
                                success: function (response) {
                                    if (response.success) {
                                        $('#elm_id_registro2').text(response.faltaAsistenciasTTHH.id_registro);
                                        $('#elm_id_registro').val(response.faltaAsistenciasTTHH.id_registro);
                                        $('#elm_id_funcionario2').val(response.faltaAsistenciasTTHH.id_funcionario);
                                        $('#elm_nombre_funcionario2').val(response.faltaAsistenciasTTHH.nombre_funcionario);
                                        $('#elm_id_funcionario').val(response.faltaAsistenciasTTHH.id_funcionario);
                                        $('#elm_nombre_funcionario').val(response.faltaAsistenciasTTHH.nombre_funcionario);

                                        $('#elm_fecha').val(response.faltaAsistenciasTTHH.fecha);

                                        $('#elm_tiempo').val(response.faltaAsistenciasTTHH.tiempo_descuento);

                                        $('#agg_estado').val(response.faltaAsistenciasTTHH.estado);
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

                        $('#tbody-tramites').off('click', '.justificarRegistro').on('click', '.justificarRegistro', function () {
                            const id_registro = $(this).data('id-tramite');

                            $.ajax({
                                type: 'GET',
                                url: `/buscar-falta-asistencia`,
                                data: { id_registro },
                                success: function (response) {
                                    if (response.success) {
                                        $('#jtf_id_registro2').text(response.faltaAsistenciasTTHH.id_registro);
                                        $('#jtf_id_registro').val(response.faltaAsistenciasTTHH.id_registro);
                                        $('#jtf_id_funcionario2').val(response.faltaAsistenciasTTHH.id_funcionario);
                                        $('#jtf_nombre_funcionario2').val(response.faltaAsistenciasTTHH.nombre_funcionario);
                                        $('#jtf_id_funcionario').val(response.faltaAsistenciasTTHH.id_funcionario);
                                        $('#jtf_nombre_funcionario').val(response.faltaAsistenciasTTHH.nombre_funcionario);
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


    }
});


///// ==     Suma de horas   ==    ////

$(document).ready(function () {
    $('#generarSumaHoras').click(function () {
        const fecha_ingreso = $('input[name="fecha_ingreso"]').val();
        const fecha_final = $('input[name="fecha_final"]').val();
        const idFuncionario = $('select[id="idFuncionario"]').val();

        $('input[name="fecha_ingreso_pdf"]').val(fecha_ingreso);
        $('input[name="fecha_final_pdf"]').val(fecha_final);

        if (!fecha_ingreso) {
            alert('Por favor ingresa una fecha válida.');
            return;
        }

        if (!fecha_final) {
            alert('Por favor ingresa una fecha válida.');
            return;
        }

        $.ajax({
            type: 'GET',
            url: '/sumar-faltas-inasistencia',
            data: { idFuncionario },
            success: function (response) {

                const tbody = $('#tbody-tramites');
                tbody.empty();

                if (response.success) {

                    $('#content').removeClass('d-none');

                    let numeroFila = 1;
                    response.faltaInasistencia.forEach(funcionario => {


                        const tiempoDescuento = funcionario.tiempo_descuento;
                        const [horas, minutos] = tiempoDescuento.split(':');
                        const tiempoDescuentoFormateado = `${horas}:${minutos}`;

                        const fechaOriginal = funcionario.fecha;
                        const fechaIngreso = new Date(fechaOriginal);
                        fechaIngreso.setHours(fechaIngreso.getHours() + 5);

                        const diaIngreso = fechaIngreso.getDate().toString().padStart(2, '0');
                        const mesIngreso = (fechaIngreso.getMonth() + 1).toString().padStart(2, '0');
                        const añoIngreso = fechaIngreso.getFullYear();
                        const fechaFormateada = `${diaIngreso}-${mesIngreso}-${añoIngreso}`;


                        let estadoColor = '';

                        if (funcionario.estado === 'NO JUSTIFICADO') {
                            estadoColor = 'bg-primary-red';

                        } else if (funcionario.estado === 'JUSTIFICADO') {
                            estadoColor = 'bg-primary-green';
                        }


                        const newRow = `
                            <tr style="border-style: none; border-bottom: 1px solid #dddee4;">
                                <td class="text-center">${numeroFila}</td>
                                <td class="text-center text-overflow-2">${fechaFormateada}</td>
                                <td class="text-start text-overflow-5">${funcionario.motivo}</td>
                                <td class="text-center text-overflow-4">${tiempoDescuentoFormateado}</td>
                                <td class="text-center text-overflow-3">
                                    <span class="${estadoColor} badge bg-primary-red rounded fw-semibold
                                     mb-0 me-2"">${funcionario.estado}</span>
                                </td>
                            </tr>
                        `;
                        tbody.append(newRow);
                        numeroFila++;



                    });

                

                    $('#visualizacion_email').text(`${response.funcionario.email_funcionario}`);
                    $('#visualizacion_nombre').text(`${response.funcionario.nombre_funcionario}`);


                    $('#visualizacion_registros').text(`${response.totalFaltas}`);
                    $('#visualizacion_horas').text(`${response.totalTiempo}`);
                } else {
                    alert('TRÁMITES NO ENCONTRADOS');
                }
            },
            error: function (error) {
                console.error('Error al buscar Trámite:', error);
                alert('Error al buscar Trámite. Por favor, inténtelo de nuevo.');
            }
        });
    });
});


