$(document).ready(function () {

    $('#generarReportePlacas').click(function () {
        const fecha_ingreso = $('input[name="fecha_ingreso"]').val();
        const fecha_final = $('input[name="fecha_final"]').val();
        const cons_tipo_tramite = $('select[name="cons_tipo_tramite"]').val();
        const cons_clase_vehiculo = $('select[name="cons_clase_vehiculo"]').val();
        $('#modalReportePlacas').modal('hide');
        $('#overlay').addClass('active');

        if (!fecha_ingreso || !fecha_final) {
            alert('Por favor ingresa fechas válidas.');
            return;
        }

        $.ajax({
            type: 'GET',
            url: '/generar-reporte-placas',
            data: { fecha_ingreso, fecha_final, cons_tipo_tramite, cons_clase_vehiculo },
            success: function (response) {
                const thead = $('#thead-tramites');
                const tbody = $('#tbody-tramites');
                tbody.empty();

                if (response.success) {
                    const tramitesFiltrados = response.tramites;

                    if (thead.children().length === 0) {
                        const headerRow = `
                            <tr class="text-dark">
                                <th class="text-center align-middle px-2 py-2" style="border-style: none;">N°</th>
                                <th class="text-center align-middle px-2 py-2" style="white-space: wrap; overflow: hidden; text-overflow: ellipsis; border-style: none; max-width: 120px;">FECHA DEL TRÁMITE</th>
                                <th class="text-center align-middle px-2 py-2" style="border-style: none;">PROCESO</th>
                                <th class="text-center align-middle px-2 py-2" style="border-style: none;">PLACA</th>
                                <th class="text-center align-middle px-2 py-2" style="border-style: none;">ENTIDAD BANCARIA</th>
                                <th class="text-center align-middle px-2 py-2" style="border-style: none;">COMPROBANTE</th>
                                <th class="text-center align-middle px-2 py-2" style="border-style: none;">FECHA DE PAGO</th>
                                <th class="text-center align-middle px-2 py-2" style="border-style: none;">VALOR</th>
                                <th class="text-center align-middle px-2 py-2" style="white-space: wrap; overflow: hidden; text-overflow: ellipsis; border-style: none; max-width: 108px;">TIPO DE SERVICIO</th>
                                <th class="text-center align-middle px-2 py-2" style="white-space: wrap; overflow: hidden; text-overflow: ellipsis; border-style: none; max-width: 108px;">TRÁMITE AXIS</th>
                                <th class="text-center align-middle px-2 py-2" style="white-space: wrap; overflow: hidden; text-overflow: ellipsis; border-style: none; max-width: 108px;">ACCIÓN</th>
                            </tr>`;
                        thead.append(headerRow);
                    }

                    let contadorFilas = 1;

                    tramitesFiltrados.forEach(tramite => {
                        const fechaParts = tramite.fecha_ingreso.split('-');
                        const dia = fechaParts[2];
                        const mes = fechaParts[1];
                        const año = fechaParts[0];

                        const fechaFormateada = `${dia}-${mes}-${año}`;

                        //const fechaPagoParts = tramite.pago_placas_fecha.split('-');
                        //const pagoPlacasDia = fechaPagoParts[2];
                        //const pagoPlacasMes = fechaPagoParts[1];
                        //const pagoPlacasAño = fechaPagoParts[0];
                        //const fechaPagoPlacasFormateada = `${pagoPlacasDia}-${pagoPlacasMes}-${pagoPlacasAño}`;

                        const newRow = `
                            <tr class="" style="border-style: none; border-bottom: 1px solid #dddee4;">
                                                            <td class="text-center" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-style: none; max-width: 120px;">${contadorFilas}</td>
                                <td class="text-center" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-style: none; max-width: 120px;">${fechaFormateada}</td>
                                <td class="text-dark" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-style: none; max-width: 250px;">${tramite.tipo_tramite || ''}</td>
                                <td class="fw-semibold text-blue" style="border-style: none;">${tramite.placa || ''}</td>
                                <td class="" style="background: #f9fafb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-style: none; max-width: 50px;">${tramite.pago_placas_entidad_bancaria || ''}</td>
                                <td class="" style="background: #f9fafb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-style: none; max-width: 100px;">${tramite.pago_placas_comprobante || ''}</td>
                                <td class="text-center" style="background: #f9fafb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-style: none; max-width: 120px;">${tramite.pago_placas_fecha}</td>
                                <td class="text-center" style="background: #f9fafb; border-style: none;">${tramite.pago_placas_valor || ''}</td>
                                <td class="text-center" style="background: #f9fafb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-style: none; max-width: 109px;">${tramite.pago_placas_newservicio || ''}</td>
                                <td class="text-center" style="background: #f9fafb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-style: none; max-width: 108px;">${tramite.id_tramite_axis || ''}</td>
                                <td class="text-center" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-style: none; max-width: 108px;">
                                    <button class="btn bg-info-subtle text-warning me-1 visualizarTramite px-2 py-2" id="visualizar-${tramite.id_tramite}" data-id-tramite="${tramite.id_tramite}" data-username="${tramite.username}">
                                        <i class="ti ti-file-description fs-4"></i></button>
                                </td>
                            </tr>`;
                        tbody.append(newRow);
                        contadorFilas++;

                        $('#overlay').removeClass('active');

                        const numeroDeTramites = tramitesFiltrados.length;

                        const fechaIngresoParts = fecha_ingreso.split('-');
                        const ingresoDia = fechaIngresoParts[2];
                        const ingresoMes = fechaIngresoParts[1];
                        const ingresoAños = fechaIngresoParts[0];
                        const fechaIngresoFormateada = `${ingresoDia}-${ingresoMes}-${ingresoAños}`;
                        $('#visualizacion_fecha_inicial').text(`Desde el: ${fechaIngresoFormateada}`);

                        const fechaFinalParts = fecha_final.split('-');
                        const finalDia = fechaFinalParts[2];
                        const finalMes = fechaFinalParts[1];
                        const finalAños = fechaFinalParts[0];
                        const fechaFinalFormateada = `${finalDia}-${finalMes}-${finalAños}`;
                        $('#visualizacion_fecha_final').text(`Hasta el: ${fechaFinalFormateada}`);
                        $('#visualizacion_tipo_tramite').text(`Tipo de trámite: ${cons_tipo_tramite}`);
                        $('#visualizacion_numero_tramites').text(`${numeroDeTramites} trámites`);
                        $('#visualizacion_clase_vehiculo').text(`Clase de vehículo: ${cons_clase_vehiculo}`);

                    });

                } else {
                    alert('TRÁMITES NO ENCONTRADOS');
                    $('#overlay').removeClass('active');
                }
            },
            error: function (error) {
                console.error('Error al buscar Trámite:', error);
                alert('Error al buscar Trámite. Por favor, inténtelo de nuevo.');
            }
        });




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
                    $('#info_fecha_ingreso').text(response.tramite.fecha_ingreso);
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




});
