$(document).ready(function () {
    $('#generarReporteDiario').click(function () {
        const fecha_finalizacion = $('input[name="fecha_finalizacion"]').val();
        const username = $('input[name="username"]').val();
        const jefatura_departamento = $('input[name="jefatura_departamento"]').val();
        const area_laboral = $('input[name="area_laboral"]').val();
        const rol_funcionario = $('input[name="rol_funcionario"]').val();
        const nombre_funcionario = $('input[name="nombre_funcionario"]').val();


        console.log('La fecha que biene es:' + fecha_finalizacion);

        $('input[name="fecha_finalizacion_pdf"]').val(fecha_finalizacion);


        if (!fecha_finalizacion) {
            alert('Por favor ingresa una fecha válidasss.');
            return;
        }

        $.ajax({
            type: 'GET',
            url: '/generar-reporte-diario',
            data: { fecha_finalizacion, username, jefatura_departamento, area_laboral },
            success: function (response) {
                const tbody = $('#tbody-tramites');
                tbody.empty();

                if (response.success) {

                    $('#content').removeClass('d-none');
                    let numeroFila = 1;
                    response.tramites.forEach(tramite => {

                        const fechaIngresoOriginal = tramite.fecha_finalizacion;
                        const fechaIngreso = new Date(fechaIngresoOriginal);
                        fechaIngreso.setHours(fechaIngreso.getHours() + 5); // zona horaria paa ecuador

                        // Variables para fecha formateada
                        const diaIngreso = fechaIngreso.getDate().toString().padStart(2, '0');
                        const mesIngreso = (fechaIngreso.getMonth() + 1).toString().padStart(2, '0');
                        const añoIngreso = fechaIngreso.getFullYear();
                        const fechaFormateada = `${diaIngreso}-${mesIngreso}-${añoIngreso}`;

                        const newRow = `
                            <tr>
                                <td class="text-center">${numeroFila}</td>
                                <td class="text-center">${jefatura_departamento}</td>
                                <td class="text-center">${area_laboral}</td>
                                <td class="text-center">${tramite.placa}</td>
                                <td class="text-center">${tramite.tipo_tramite}</td>
                                <td class="text-center">${tramite.numero_fojas}</td>
                                <td class="text-center">${fechaFormateada}</td>
                                <td class="text-center">${rol_funcionario} (${nombre_funcionario})</td>
                                <td class="text-center">AUTORIZACIÓN DE GERENCIA</td>
                            </tr>`;
                        tbody.append(newRow);
                        numeroFila++;
                    });
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

$(document).ready(function () {
    $('#generarReporteDiarioEspecies').click(function () {
        const fecha_ingreso = $('input[name="fecha_ingreso"]').val();
        const fecha_final = $('input[name="fecha_final"]').val();
        const username = $('input[name="username"]').val();
        const jefatura_departamento = $('input[name="jefatura_departamento"]').val();
        const area_laboral = $('input[name="area_laboral"]').val();

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
            url: '/generar-reporte-especies',
            data: { fecha_ingreso, fecha_final, username, jefatura_departamento, area_laboral },
            success: function (response) {
                const tbody = $('#tbody-tramites');
                tbody.empty();

                if (response.success) {

                    $('#content').removeClass('d-none');
                    const tramitesFiltrados = response.tramites.filter(tramite => {
                        return tramite.tipo_tramite === 'CAMBIO DE CARACTERÍSTICAS'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE COMERCIAL A PARTICULAR'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE COMERCIAL A PUBLICO'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE COMERCIAL A USO DE CUENTA PROPIA'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A COMERCIAL'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A PARTICULAR'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A PUBLICO'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A USO DE CUENTA PROPIA'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PARTICULAR A COMERCIAL'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PARTICULAR A ESTATAL U OFICIAL'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PARTICULAR A PUBLICO'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PARTICULAR A USO DE CUENTA PROPIA'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PARTICULAR A USO DIPLOMATICO U ORGANISMOS INTERNACIONALES'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PUBLICO A COMERCIAL'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PUBLICO A PARTICULAR'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PUBLICO A USO DE CUENTA PROPIA'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A COMERCIAL'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A PARTICULAR'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A PUBLICO'
                            || tramite.tipo_tramite === 'DUPLICADO DEL DOCUMENTO DE LA MATRICULA'
                            || tramite.tipo_tramite === 'DUPLICADO DEL DOCUMENTO DE LA MATRICULA Y EMISION DEL DOCUMENTO ANUAL DE CIRCULACION'
                            || tramite.tipo_tramite === 'EMISION DE MATRICULA POR PRIMERA VEZ'
                            || tramite.tipo_tramite === 'ESPECIE ANULADA'
                            || tramite.tipo_tramite === 'ESPECIE Y ADHESIVO ANULADO'
                            || tramite.tipo_tramite === 'RENOVACION DE MATRICULA Y EMISION DEL DOCUMENTO ANUAL DE CIRCULACION'
                            || tramite.tipo_tramite === 'TRANSFERENCIA DE DOMINIO'
                            || tramite.tipo_tramite === 'TRANSFERENCIA DE DOMINIO Y REVISION ANUAL';
                    });

                    const tramitesAgrupados = {};
                    tramitesFiltrados.forEach(tramite => {
                        const tipoTramite = tramite.tipo_tramite;
                        tramitesAgrupados[tipoTramite] = (tramitesAgrupados[tipoTramite] || 0) + 1;
                    });


                    Object.entries(tramitesAgrupados).forEach(([tipoTramite, cantidad]) => {
                        const newRow = `
                            <tr>
                                <td class="text-left">${tipoTramite}</td>
                                <td class="text-center">${cantidad}</td>
                            </tr>`;
                        tbody.append(newRow);
                    });


                    const totalRow = `
                    <tr>
                        <td class="fs-3 text-center fw-normal"><b class="fw-normal">TOTAL DE PROCESOS</b></td>
                        <td class="fs-3 text-center"><b class="fw-normal">${tramitesFiltrados.length}</b></td>
                    </tr>`;
                    tbody.append(totalRow);

                    const numeroEspeciesUtilizadas = tramitesFiltrados.length;

                    $('input[name="fecha_ingresada"]').val(response.fecha_ingreso);
                    $('input[name="fecha_ingresada2"]').val(response.fecha_final);
                    $('input[name="especies_utilizadas"]').val(tramitesFiltrados.length);
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

$(document).ready(function () {
    $('#generarReporteTipoVehiculo').click(function () {
        const fecha_ingreso = $('input[name="fecha_ingreso"]').val();
        const fecha_final = $('input[name="fecha_final"]').val();
        const username = $('input[name="username"]').val();
        const jefatura_departamento = $('input[name="jefatura_departamento"]').val();
        const area_laboral = $('input[name="area_laboral"]').val();

        $('input[name="fecha_ingreso_pdf"]').val(fecha_ingreso);
        $('input[name="fecha_final_pdf"]').val(fecha_final);


        if (!fecha_ingreso || !fecha_final) {
            alert('Por favor ingresa fechas válidas.');
            return;
        }

        $.ajax({
            type: 'GET',
            url: '/generar-reporte-tipo-vehiculo',
            data: { fecha_ingreso, fecha_final, username, jefatura_departamento, area_laboral },
            success: function (response) {
                const tbody = $('#tbody-tramites');
                const tbody2 = $('#tbody-tramites2');
                tbody.empty();
                tbody2.empty();

                if (response.success) {


                    $('#content').removeClass('d-none');

                    const tramitesFiltrados = response.tramites.filter(tramite => {
                        return tramite.tipo_tramite !== 'ADHESIVO ANULADO' &&
                            tramite.tipo_tramite !== 'ESPECIE ANULADA' &&
                            tramite.tipo_tramite !== 'ESPECIE Y ADHESIVO ANULADO';
                    });


                    const tramitesMotocicletas = tramitesFiltrados.filter(tramite => tramite.clase_vehiculo_tipo === 'MOTOCICLETA');
                    const tramitesVehiculos = tramitesFiltrados.filter(tramite => tramite.clase_vehiculo_tipo === 'VEHICULO');

                    const tramitesAgrupadosMotocicletas = {};
                    tramitesMotocicletas.forEach(tramite => {
                        const tipoTramite = tramite.tipo_tramite;
                        tramitesAgrupadosMotocicletas[tipoTramite] = (tramitesAgrupadosMotocicletas[tipoTramite] || 0) + 1;
                    });

                    const tramitesAgrupadosVehiculos = {};
                    tramitesVehiculos.forEach(tramite => {
                        const tipoTramite = tramite.tipo_tramite;
                        tramitesAgrupadosVehiculos[tipoTramite] = (tramitesAgrupadosVehiculos[tipoTramite] || 0) + 1;
                    });



                    Object.entries(tramitesAgrupadosMotocicletas).forEach(([tipoTramite, cantidad]) => {
                        const newRow = `
                            <tr>
                                <td class="text-left">${tipoTramite}</td>
                                <td class="text-center">${cantidad}</td>
                            </tr>`;
                        tbody.append(newRow);
                    });

                    Object.entries(tramitesAgrupadosVehiculos).forEach(([tipoTramite, cantidad]) => {
                        const newRow = `
                            <tr>
                                <td class="text-left">${tipoTramite}</td>
                                <td class="text-center">${cantidad}</td>
                            </tr> `;
                        tbody2.append(newRow);
                    });


                    const totalRow = `
                        <tr>
                            <td class="fs-3 text-center"><b>TOTAL DE PROCESOS</b></td>
                            <td class="fs-3 text-center"><b>${tramitesMotocicletas.length}</b></td>
                        </tr> `;
                    tbody.append(totalRow);

                    const totalRow2 = `
                        <tr>
                           <td class="fs-3 text-center"><b>TOTAL DE PROCESOS</b></td>
                           <td class="fs-3 text-center"><b>${tramitesVehiculos.length}</b></td>
                        </tr> `;
                    tbody2.append(totalRow2);

                    const EspeciesUtilizadas = response.tramites.filter(tramite => {
                        return tramite.tipo_tramite === 'CAMBIO DE CARACTERÍSTICAS'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE COMERCIAL A PARTICULAR'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE COMERCIAL A PUBLICO'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE COMERCIAL A USO DE CUENTA PROPIA'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A COMERCIAL'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A PARTICULAR'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A PUBLICO'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A USO DE CUENTA PROPIA'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PARTICULAR A COMERCIAL'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PARTICULAR A ESTATAL U OFICIAL'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PARTICULAR A PUBLICO'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PARTICULAR A USO DE CUENTA PROPIA'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PARTICULAR A USO DIPLOMATICO U ORGANISMOS INTERNACIONALES'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PUBLICO A COMERCIAL'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PUBLICO A PARTICULAR'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PUBLICO A USO DE CUENTA PROPIA'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A COMERCIAL'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A PARTICULAR'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A PUBLICO'
                            || tramite.tipo_tramite === 'DUPLICADO DEL DOCUMENTO DE LA MATRICULA'
                            || tramite.tipo_tramite === 'DUPLICADO DEL DOCUMENTO DE LA MATRICULA Y EMISION DEL DOCUMENTO ANUAL DE CIRCULACION'
                            || tramite.tipo_tramite === 'EMISION DE MATRICULA POR PRIMERA VEZ'
                            || tramite.tipo_tramite === 'RENOVACION DE MATRICULA Y EMISION DEL DOCUMENTO ANUAL DE CIRCULACION'
                            || tramite.tipo_tramite === 'TRANSFERENCIA DE DOMINIO'
                            || tramite.tipo_tramite === 'TRANSFERENCIA DE DOMINIO Y REVISION ANUAL';
                    });

                    const EspeciesAnuladas = response.tramites.filter(tramite => {
                        return tramite.tipo_tramite === 'ESPECIE ANULADA'
                            || tramite.tipo_tramite === 'ESPECIE Y ADHESIVO ANULADO';
                    });

                    const AdhesivosEntregados = response.tramites.filter(tramite => {
                        return tramite.tipo_tramite !== 'ACTUALIZACIÓN DE DATOS DEL VEHÍCULO' &&
                            tramite.tipo_tramite !== 'ADHESIVO ANULADO' &&
                            tramite.tipo_tramite !== 'ESPECIE ANULADA' &&
                            tramite.tipo_tramite !== 'BLOQUEO DE VEHÍCULO' &&
                            tramite.tipo_tramite !== 'CERTIFICADO DE POSEER VEHICULO' &&
                            tramite.tipo_tramite !== 'CERTIFICADO UNICO VEHICULAR' &&
                            tramite.tipo_tramite !== 'DESBLOQUEO DE VEHÍCULO' &&
                            tramite.tipo_tramite !== 'DUPLICADO DE PLACAS' &&
                            tramite.tipo_tramite !== 'DUPLICADO DEL DOCUMENTO DE LA MATRICULA' &&
                            tramite.tipo_tramite !== 'ESPECIE ANULADA' &&
                            tramite.tipo_tramite !== 'ESPECIE Y ADHESIVO ANULADO' &&
                            tramite.tipo_tramite !== 'TRANSFERENCIA DE DOMINIO';
                    });



                    $('input[name="fecha_ingresada"]').val(response.fecha_ingreso);
                    $('input[name="fecha_ingresada2"]').val(response.fecha_final);
                    $('input[name="tramites_total_motocicletas"]').val(tramitesMotocicletas.length);
                    $('input[name="tramites_total_vehiculos"]').val(tramitesVehiculos.length);
                    $('input[name="tramites_total"]').val(tramitesFiltrados.length);
                    $('input[name="especies_utilizadas"]').val(EspeciesUtilizadas.length);
                    $('input[name="especies_anuladas"]').val(EspeciesAnuladas.length);
                    $('input[name="ahesivos_entregados"]').val(AdhesivosEntregados.length);

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

$(document).ready(function () {
    $('#generarReporteTramites').click(function () {
        const fecha_ingreso = $('input[name="fecha_ingreso"]').val();
        const fecha_final = $('input[name="fecha_final"]').val();
        const username = $('input[name="username"]').val();
        const jefatura_departamento = $('input[name="jefatura_departamento"]').val();
        const area_laboral = $('input[name="area_laboral"]').val();

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
            url: '/generar-reporte-tramites',
            data: { fecha_ingreso, fecha_final, username, jefatura_departamento, area_laboral },
            success: function (response) {
                const tbody = $('#tbody-tramites');
                tbody.empty();

                if (response.success) {

                    $('#content').removeClass('d-none');

                    const tramitesFiltrados = response.tramites.filter(tramite => {
                        return tramite.tipo_tramite !== 'ADHESIVO ANULADO' &&
                            tramite.tipo_tramite !== 'ESPECIE ANULADA' &&
                            tramite.tipo_tramite !== 'ESPECIE Y ADHESIVO ANULADO';
                    });

                    const tramitesAgrupados = {};
                    tramitesFiltrados.forEach(tramite => {
                        const tipoTramite = tramite.tipo_tramite;
                        tramitesAgrupados[tipoTramite] = (tramitesAgrupados[tipoTramite] || 0) + 1;
                    });

                    Object.entries(tramitesAgrupados).forEach(([tipoTramite, cantidad]) => {
                        const newRow = `
                            <tr>
                                <td class="text-left">${tipoTramite}</td>
                                <td class="text-center">${cantidad}</td>
                            </tr>`;
                        tbody.append(newRow);
                    });


                    const totalRow = `
                    <tr>
                        <td class="fs-3 text-center fw-normal"><b class="fw-normal">TOTAL DE PROCESOS</b></td>
                        <td class="fs-3 text-center"><b class="fw-normal">${tramitesFiltrados.length}</b></td>
                    </tr>`;
                    tbody.append(totalRow);

                    const EspeciesUtilizadas = response.tramites.filter(tramite => {
                        return tramite.tipo_tramite === 'CAMBIO DE CARACTERÍSTICAS'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE COMERCIAL A PARTICULAR'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE COMERCIAL A PUBLICO'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE COMERCIAL A USO DE CUENTA PROPIA'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A COMERCIAL'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A PARTICULAR'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A PUBLICO'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A USO DE CUENTA PROPIA'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PARTICULAR A COMERCIAL'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PARTICULAR A ESTATAL U OFICIAL'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PARTICULAR A PUBLICO'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PARTICULAR A USO DE CUENTA PROPIA'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PARTICULAR A USO DIPLOMATICO U ORGANISMOS INTERNACIONALES'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PUBLICO A COMERCIAL'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PUBLICO A PARTICULAR'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PUBLICO A USO DE CUENTA PROPIA'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A COMERCIAL'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A PARTICULAR'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A PUBLICO'
                            || tramite.tipo_tramite === 'DUPLICADO DEL DOCUMENTO DE LA MATRICULA'
                            || tramite.tipo_tramite === 'DUPLICADO DEL DOCUMENTO DE LA MATRICULA Y EMISION DEL DOCUMENTO ANUAL DE CIRCULACION'
                            || tramite.tipo_tramite === 'EMISION DE MATRICULA POR PRIMERA VEZ'
                            || tramite.tipo_tramite === 'RENOVACION DE MATRICULA Y EMISION DEL DOCUMENTO ANUAL DE CIRCULACION'
                            || tramite.tipo_tramite === 'TRANSFERENCIA DE DOMINIO'
                            || tramite.tipo_tramite === 'TRANSFERENCIA DE DOMINIO Y REVISION ANUAL';
                    });

                    const EspeciesAnuladas = response.tramites.filter(tramite => {
                        return tramite.tipo_tramite === 'ESPECIE ANULADA'
                            || tramite.tipo_tramite === 'ESPECIE Y ADHESIVO ANULADO';
                    });

                    const AdhesivosEntregados = response.tramites.filter(tramite => {
                        return tramite.tipo_tramite !== 'ACTUALIZACIÓN DE DATOS DEL VEHÍCULO' &&
                            tramite.tipo_tramite !== 'ADHESIVO ANULADO' &&
                            tramite.tipo_tramite !== 'ESPECIE ANULADA' &&
                            tramite.tipo_tramite !== 'BLOQUEO DE VEHÍCULO' &&
                            tramite.tipo_tramite !== 'CERTIFICADO DE POSEER VEHICULO' &&
                            tramite.tipo_tramite !== 'CERTIFICADO UNICO VEHICULAR' &&
                            tramite.tipo_tramite !== 'DESBLOQUEO DE VEHÍCULO' &&
                            tramite.tipo_tramite !== 'DUPLICADO DE PLACAS' &&
                            tramite.tipo_tramite !== 'DUPLICADO DEL DOCUMENTO DE LA MATRICULA' &&
                            tramite.tipo_tramite !== 'ESPECIE ANULADA' &&
                            tramite.tipo_tramite !== 'ESPECIE Y ADHESIVO ANULADO' &&
                            tramite.tipo_tramite !== 'TRANSFERENCIA DE DOMINIO';
                    });

                    $('input[name="fecha_ingresada"]').val(response.fecha_ingreso);
                    $('input[name="fecha_ingresada2"]').val(response.fecha_final);
                    $('input[name="tramites_total"]').val(tramitesFiltrados.length);
                    $('input[name="especies_utilizadas"]').val(EspeciesUtilizadas.length);
                    $('input[name="especies_anuladas"]').val(EspeciesAnuladas.length);
                    $('input[name="ahesivos_entregados"]').val(AdhesivosEntregados.length);
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

$(document).ready(function () {
    $('#generarReporteDomicilio').click(function () {
        const fecha_ingreso = $('input[name="fecha_ingreso"]').val();
        const fecha_final = $('input[name="fecha_final"]').val();
        const username = $('input[name="username"]').val();
        const jefatura_departamento = $('input[name="jefatura_departamento"]').val();
        const area_laboral = $('input[name="area_laboral"]').val();

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
            url: '/generar-reporte-tramites',
            data: { fecha_ingreso, fecha_final, username, jefatura_departamento, area_laboral },
            success: function (response) {
                const tbody = $('#tbody-tramites');
                tbody.empty();

                if (response.success) {

                    $('#content').removeClass('d-none');

                    const tramitesFiltrados = response.tramites.filter(tramite => {
                        return tramite.tipo_tramite !== 'ADHESIVO ANULADO' &&
                            tramite.tipo_tramite !== 'ESPECIE ANULADA' &&
                            tramite.tipo_tramite !== 'ESPECIE Y ADHESIVO ANULADO';
                    });

                    const tramitesAgrupados = {};
                    tramitesFiltrados.forEach(tramite => {
                        const canton = tramite.canton_usuario;
                        if (!tramitesAgrupados[canton]) {
                            tramitesAgrupados[canton] = {
                                motocicleta: 0,
                                vehiculo: 0
                            };
                        }
                        if (tramite.clase_vehiculo_tipo === 'MOTOCICLETA') {
                            tramitesAgrupados[canton].motocicleta++;
                        } else if (tramite.clase_vehiculo_tipo === 'VEHICULO') {
                            tramitesAgrupados[canton].vehiculo++;
                        }
                    });

                    Object.entries(tramitesAgrupados).forEach(([canton, data]) => {
                        const totalMotocicletas = data.motocicleta;
                        const totalVehiculos = data.vehiculo;
                        const totalTramites = totalMotocicletas + totalVehiculos;

                        const newRow = `
                        <tr>
                            <td class="text-left">${canton}</td>
                            <td class="text-center">${totalMotocicletas}</td>
                            <td class="text-center">${totalVehiculos}</td>
                            <td class="text-center">${totalTramites}</td>
                        </tr> `;
                        tbody.append(newRow);
                    });


                    const totalRow = `
                    <tr>
                        <td  colspan="3" class="fs-3 text-center"><b>TOTAL DE PROCESOS</b></td>
                        <td class="fs-3 text-center"><b>${tramitesFiltrados.length}</b></td>
                    </tr> `;
                    tbody.append(totalRow);

                    $('input[name="tramites_total"]').val(tramitesFiltrados.length);

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


$(document).ready(function () {
    $('#generarReporteTramitesInformacion').click(function () {
        const fecha_inicial = $('input[name="fecha_inicial"]').val();
        const fecha_final = $('input[name="fecha_final"]').val();
        const username = $('input[name="username"]').val();

        if (!fecha_inicial) {
            alert('Por favor ingresa una fecha inicial válida.');
            return;
        }

        if (!fecha_final) {
            alert('Por favor ingresa una fecha final válida.');
            return;
        }

        $('input[name="fecha_ingreso_pdf"]').val(fecha_inicial);
        $('input[name="fecha_final_pdf"]').val(fecha_final);

        $.ajax({
            type: 'GET',
            url: '/generar-reporte-tramitesInformacion',
            data: { fecha_inicial, fecha_final, username },
            success: function (response) {
                const tbody = $('#tbody-tramites');
                tbody.empty();
                const tbodyDetalle = $('#tbody-tramitesDetalle');
                tbodyDetalle.empty();
                const tbodyDetalle2 = $('#tbody-tramitesDetalle2');
                tbodyDetalle2.empty();

                if (response.success) {

                    $('#content').removeClass('d-none');

                    const tramitesFiltrados = response.tramites.filter(tramite => {
                        return !['ADHESIVO ANULADO', 'ESPECIE ANULADA', 'ESPECIE Y ADHESIVO ANULADO'].includes(tramite.tipo_tramite);
                    });

                    const tramitesAgrupados = {};
                    tramitesFiltrados.forEach(tramite => {
                        const tipoTramite = tramite.tipo_tramite;
                        tramitesAgrupados[tipoTramite] = (tramitesAgrupados[tipoTramite] || 0) + 1;
                    });

                    Object.entries(tramitesAgrupados).forEach(([tipoTramite, cantidad]) => {
                        const newRow = `
                            <tr>
                                <td class="text-left">${tipoTramite}</td>
                                <td class="text-center">${cantidad}</td>
                            </tr>`;
                        tbody.append(newRow);
                    });

                    const totalRow = `
                        <tr>
                            <td class="fs-3 text-center fw-normal"><b class="fw-normal">TOTAL DE PROCESOS</b></td>
                            <td class="fs-3 text-center"><b class="fw-normal">${tramitesFiltrados.length}</b></td>
                        </tr>`;
                    tbody.append(totalRow);

                    $('input[name="fecha_ingresada"]').val(response.fecha_ingreso);
                    $('input[name="fecha_ingresada2"]').val(response.fecha_final);
                    $('input[name="tramites_total"]').val(tramitesFiltrados.length);

                    let numeroFila = 1;
                    response.tramitesDetalle.forEach(tramite => {
                        const fechaIngreso = new Date(tramite.fecha_ingreso_INFORMACION);
                        fechaIngreso.setHours(fechaIngreso.getHours() + 5);

                        const fechaIngresoFormateada = `${fechaIngreso.getDate().toString().padStart(2, '0')}-${(fechaIngreso.getMonth() + 1).toString().padStart(2, '0')}-${fechaIngreso.getFullYear()} ${fechaIngreso.getHours().toString().padStart(2, '0')}:${fechaIngreso.getMinutes().toString().padStart(2, '0')}`;

                        let tiempoEspera = '';
                        if (tramite.fecha_finalizacion) {
                            const fechaFinalizacion = new Date(tramite.fecha_finalizacion);
                            fechaFinalizacion.setHours(fechaFinalizacion.getHours() + 5);

                            const diffMs = fechaFinalizacion - fechaIngreso;
                            const diferenciaHoras = Math.floor(diffMs / (1000 * 60 * 60));
                            const diferenciaMinutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

                            tiempoEspera = `${diferenciaHoras} horas ${diferenciaMinutos} min.`;
                        } else {
                            const fechaActual = new Date();
                            const diferenciaMs = fechaActual - fechaIngreso;
                            const diferenciaHoras = Math.floor(diferenciaMs / (1000 * 60 * 60));
                            const diferenciaMinutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));

                            tiempoEspera = `${diferenciaHoras} horas ${diferenciaMinutos} min.`;
                        }

                        const estadoClass = tramite.estado_tramite === 'Finalizado' ? 'bg-info' :
                            tramite.estado_tramite === 'En proceso' ? 'bg-wait' :
                                'bg-danger';
                        const estadoFont = tramite.estado_tramite === 'Finalizado' ? 'fw-normal' : tramite.estado_tramite === 'Eliminado' ? 'fw-normal' : 'fw-semibold';

                        const newRow = `
                            <tr style="border-style: none; border-bottom: 1px solid #dddee4;">
                                <td class="text-center">${numeroFila}</td>
                                <td class="text-center">${tramite.placa}</td>
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
                            </tr>`;
                        tbodyDetalle.append(newRow);
                        numeroFila++;
                    });

                    let numeroFila2 = 1;
                    response.tramitesDetalle.forEach(tramite => {
                        const fechaIngreso = new Date(tramite.fecha_ingreso_INFORMACION);
                        fechaIngreso.setHours(fechaIngreso.getHours() + 5);

                        const fechaIngresoFormateada = `${fechaIngreso.getDate().toString().padStart(2, '0')}-${(fechaIngreso.getMonth() + 1).toString().padStart(2, '0')}-${fechaIngreso.getFullYear()} ${fechaIngreso.getHours().toString().padStart(2, '0')}:${fechaIngreso.getMinutes().toString().padStart(2, '0')}`;

                        let tiempoEspera = '';
                        if (tramite.fecha_finalizacion) {
                            const fechaFinalizacion = new Date(tramite.fecha_finalizacion);
                            fechaFinalizacion.setHours(fechaFinalizacion.getHours() + 5);

                            const diffMs = fechaFinalizacion - fechaIngreso;
                            const diferenciaHoras = Math.floor(diffMs / (1000 * 60 * 60));
                            const diferenciaMinutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

                            tiempoEspera = `${diferenciaHoras} horas ${diferenciaMinutos} min.`;
                        } else {
                            const fechaActual = new Date();
                            const diferenciaMs = fechaActual - fechaIngreso;
                            const diferenciaHoras = Math.floor(diferenciaMs / (1000 * 60 * 60));
                            const diferenciaMinutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));

                            tiempoEspera = `${diferenciaHoras} horas ${diferenciaMinutos} min.`;
                        }
                        const newRow = `
                            <tr style="border-style: none; border-bottom: 1px solid #dddee4;">
                                <td class="text-center">${numeroFila2}</td>
                                <td class="text-center">${tramite.placa}</td>
                                <td class="text-overflow-13">${tramite.tipo_tramite}</td>
                                <td class="text-center text-overflow-4">${fechaIngresoFormateada}</td>
                                <td class="text-center text-overflow-4">${tiempoEspera}</td>
                                <td class="text-center text-overflow-1">${tramite.numero_turno_INFORMACION}</td>
                                <td class="align-items-center justify-content-start text-overflow-4">
                                    <span class="badge text-dark rounded-pill fw-normal">${tramite.estado_tramite}</span>
                                </td>
                                <td class="text-center text-overflow-4">${tramite.username_funcionario_INFORMACION}</td>
                                <td class="text-center text-overflow-4">${tramite.username_funcionario_asignado_INFORMACION}</td>
                            </tr>`;
                        tbodyDetalle2.append(newRow);
                        numeroFila2++;
                    });

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




$(document).ready(function () {
    $('#generarReporteGeneralTramites').click(function () {

        const funcionarioSeleccionado = $('select[name="funcionarioSeleccionado"]').val();
        const tipo_tramite = $('select[name="tipo_tramite"]').val();
        const estado_tramite = $('select[name="estado_tramite"]').val();
        const fecha_inicial = $('input[name="fecha_inicial"]').val();
        const fecha_final = $('input[name="fecha_final"]').val();

        if (!funcionarioSeleccionado) {
            alert('Por favor selecciona a un usuario.');
            return;
        }

        if (!tipo_tramite) {
            alert('Por favor selecciona un tipo de trámite.');
            return;
        }

        if (!estado_tramite) {
            alert('Por favor selecciona un estado de trámite.');
            return;
        }

        if (!fecha_inicial) {
            alert('Por favor ingresa una fecha válida.');
            return;
        }

        if (!fecha_final) {
            alert('Por favor ingresa una fecha válida.');
            return;
        }

        console.info(funcionarioSeleccionado, tipo_tramite, estado_tramite, fecha_inicial, fecha_final);


        $('input[name="funcionarioSeleccionado_pdf"]').val(funcionarioSeleccionado);
        $('input[name="tipo_tramite_pdf"]').val(tipo_tramite);
        $('input[name="estado_tramite_pdf"]').val(estado_tramite);
        $('input[name="fecha_ingreso_pdf"]').val(fecha_inicial);
        $('input[name="fecha_final_pdf"]').val(fecha_final);

        $.ajax({
            type: 'GET',
            url: '/generar-reporte-general-tramites',
            data: { funcionarioSeleccionado, tipo_tramite, fecha_inicial, fecha_final, estado_tramite },
            success: function (response) {
                const tbody = $('#tbody-tramites');
                const tbody2 = $('#tbody-tramites2');
                const tbody3 = $('#tbody-tramites3');
                tbody.empty();
                tbody2.empty();
                tbody3.empty();

                if (response.success) {

                    $('#content').removeClass('d-none');
                    const tramitesFiltrados = response.tramites.filter(tramite => {
                        return tramite.tipo_tramite !== 'ADHESIVO ANULADO' &&
                            tramite.tipo_tramite !== 'ESPECIE ANULADA' &&
                            tramite.tipo_tramite !== 'ESPECIE Y ADHESIVO ANULADO';
                    });

                    const tramitesFiltrados2 = response.tramitesDetalle.filter(tramite => {
                        return tramite.tipo_tramite !== 'ADHESIVO ANULADO' &&
                            tramite.tipo_tramite !== 'ESPECIE ANULADA' &&
                            tramite.tipo_tramite !== 'ESPECIE Y ADHESIVO ANULADO';
                    });

                    const tramitesAgrupados = {};
                    tramitesFiltrados.forEach(tramite => {
                        const tipoTramite = tramite.tipo_tramite;
                        tramitesAgrupados[tipoTramite] = (tramitesAgrupados[tipoTramite] || 0) + 1;
                    });


                    const tramitesMotocicletas = tramitesFiltrados2.filter(tramite => tramite.clase_vehiculo_tipo === 'MOTOCICLETA');
                    const tramitesVehiculos = tramitesFiltrados2.filter(tramite => tramite.clase_vehiculo_tipo === 'VEHICULO');

                    const tramitesAgrupadosMotocicletas = {};
                    tramitesMotocicletas.forEach(tramite => {
                        const tipoTramite = tramite.tipo_tramite;
                        tramitesAgrupadosMotocicletas[tipoTramite] = (tramitesAgrupadosMotocicletas[tipoTramite] || 0) + 1;
                    });

                    const tramitesAgrupadosVehiculos = {};
                    tramitesVehiculos.forEach(tramite => {
                        const tipoTramite = tramite.tipo_tramite;
                        tramitesAgrupadosVehiculos[tipoTramite] = (tramitesAgrupadosVehiculos[tipoTramite] || 0) + 1;
                    });


                    Object.entries(tramitesAgrupados).forEach(([tipoTramite, cantidad]) => {
                        const newRow = `
                        <tr>
                            <td class="text-left">${tipoTramite}</td>
                            <td class="text-center">${cantidad}</td>
                        </tr>`;
                        tbody.append(newRow);
                    });


                    const totalRow = `
                    <tr>
                        <td class="fs-3 text-center fw-normal"><b class="fw-normal">TOTAL DE PROCESOS</b></td>
                        <td class="fs-3 text-center"><b class="fw-normal">${tramitesFiltrados.length}</b></td>
                    </tr>`;
                    tbody.append(totalRow);



                    Object.entries(tramitesAgrupadosMotocicletas).forEach(([tipoTramite, cantidad]) => {
                        const newRow = `
                            <tr>
                                <td class="text-left">${tipoTramite}</td>
                                <td class="text-center">${cantidad}</td>
                            </tr>`;
                        tbody2.append(newRow);
                    });

                    Object.entries(tramitesAgrupadosVehiculos).forEach(([tipoTramite, cantidad]) => {
                        const newRow = `
                            <tr>
                                <td class="text-left">${tipoTramite}</td>
                                <td class="text-center">${cantidad}</td>
                            </tr> `;
                        tbody3.append(newRow);
                    });


                    const totalRow2 = `
                        <tr>
                            <td class="fs-3 text-center fw-normal"><b class="fw-normal">TOTAL DE PROCESOS</b></td>
                            <td class="fs-3 text-center"><b class="fw-normal">${tramitesMotocicletas.length}</b></td>
                        </tr> `;
                    tbody2.append(totalRow2);

                    const totalRow3 = `
                        <tr>
                           <td class="fs-3 text-center fw-normal"><b class="fw-normal">TOTAL DE PROCESOS</b></td>
                           <td class="fs-3 text-center"><b class="fw-normal">${tramitesVehiculos.length}</b></td>
                        </tr> `;
                    tbody3.append(totalRow3);


                    const EspeciesUtilizadas = response.tramites.filter(tramite => {
                        return tramite.tipo_tramite === 'CAMBIO DE CARACTERÍSTICAS'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE COMERCIAL A PARTICULAR'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE COMERCIAL A PUBLICO'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE COMERCIAL A USO DE CUENTA PROPIA'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A COMERCIAL'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A PARTICULAR'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A PUBLICO'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A USO DE CUENTA PROPIA'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PARTICULAR A COMERCIAL'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PARTICULAR A ESTATAL U OFICIAL'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PARTICULAR A PUBLICO'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PARTICULAR A USO DE CUENTA PROPIA'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PARTICULAR A USO DIPLOMATICO U ORGANISMOS INTERNACIONALES'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PUBLICO A COMERCIAL'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PUBLICO A PARTICULAR'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE PUBLICO A USO DE CUENTA PROPIA'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A COMERCIAL'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A PARTICULAR'
                            || tramite.tipo_tramite === 'CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A PUBLICO'
                            || tramite.tipo_tramite === 'DUPLICADO DEL DOCUMENTO DE LA MATRICULA'
                            || tramite.tipo_tramite === 'DUPLICADO DEL DOCUMENTO DE LA MATRICULA Y EMISION DEL DOCUMENTO ANUAL DE CIRCULACION'
                            || tramite.tipo_tramite === 'EMISION DE MATRICULA POR PRIMERA VEZ'
                            || tramite.tipo_tramite === 'RENOVACION DE MATRICULA Y EMISION DEL DOCUMENTO ANUAL DE CIRCULACION'
                            || tramite.tipo_tramite === 'TRANSFERENCIA DE DOMINIO'
                            || tramite.tipo_tramite === 'TRANSFERENCIA DE DOMINIO Y REVISION ANUAL';
                    });

                    const EspeciesAnuladas = response.tramites.filter(tramite => {
                        return tramite.tipo_tramite === 'ESPECIE ANULADA'
                            || tramite.tipo_tramite === 'ESPECIE Y ADHESIVO ANULADO';
                    });

                    const AdhesivosEntregados = response.tramites.filter(tramite => {
                        return tramite.tipo_tramite !== 'ACTUALIZACIÓN DE DATOS DEL VEHÍCULO' &&
                            tramite.tipo_tramite !== 'ADHESIVO ANULADO' &&
                            tramite.tipo_tramite !== 'ESPECIE ANULADA' &&
                            tramite.tipo_tramite !== 'BLOQUEO DE VEHÍCULO' &&
                            tramite.tipo_tramite !== 'CERTIFICADO DE POSEER VEHICULO' &&
                            tramite.tipo_tramite !== 'CERTIFICADO UNICO VEHICULAR' &&
                            tramite.tipo_tramite !== 'DESBLOQUEO DE VEHÍCULO' &&
                            tramite.tipo_tramite !== 'DUPLICADO DE PLACAS' &&
                            tramite.tipo_tramite !== 'DUPLICADO DEL DOCUMENTO DE LA MATRICULA' &&
                            tramite.tipo_tramite !== 'ESPECIE ANULADA' &&
                            tramite.tipo_tramite !== 'ESPECIE Y ADHESIVO ANULADO' &&
                            tramite.tipo_tramite !== 'TRANSFERENCIA DE DOMINIO';
                    });







                    $('input[name="fecha_ingresada"]').val(response.fecha_inicial);
                    $('input[name="fecha_ingresada2"]').val(response.fecha_final);
                    $('input[name="tramites_total"]').val(tramitesFiltrados.length);
                    $('input[name="especies_utilizadas"]').val(EspeciesUtilizadas.length);
                    $('input[name="especies_anuladas"]').val(EspeciesAnuladas.length);
                    $('input[name="ahesivos_entregados"]').val(AdhesivosEntregados.length);
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



$(document).ready(function () {

    $('#generarReportePlacas').click(function () {

        const cons_funcionario = $('select[name="funcionarioSeleccionado"]').val();
        const cons_tipo_tramite = $('select[name="cons_tipo_tramite"]').val();
        const cons_clase_vehiculo = $('select[name="cons_clase_vehiculo"]').val();
        const fecha_inicial = $('input[name="fecha_inicial"]').val();
        const fecha_final = $('input[name="fecha_final"]').val();
        $('#overlay').addClass('active');

        if (!fecha_inicial || !fecha_final) {
            alert('Por favor ingresa fechas válidas.');
            $('#overlay').removeClass('active');
            return;
        }

        $('input[name="cons_funcionario_excel"]').val(cons_funcionario);
        $('input[name="tipo_tramite_excel"]').val(cons_tipo_tramite);
        $('input[name="fecha_ingreso_excel"]').val(fecha_inicial);
        $('input[name="fecha_final_excel"]').val(fecha_final);
        $('input[name="cons_clase_vehiculo_excel"]').val(cons_clase_vehiculo);

        $.ajax({
            type: 'GET',
            url: '/generar-reporte-placas',
            data: { fecha_inicial, fecha_final, cons_tipo_tramite, cons_clase_vehiculo, cons_funcionario },
            success: function (response) {
                const tbody = $('#tbody-tramites');
                tbody.empty();

                if (response.success) {

                    $('#content').removeClass('d-none');

                    const funcionario = response.funcionario.recepcion_tramites;
                    const tramitesFiltrados = response.tramites;
                    let contadorFilas = 1;

                    tramitesFiltrados.forEach(tramite => {

                        const fechaIngreso = new Date(tramite.fecha_ingreso);
                        fechaIngreso.setHours(fechaIngreso.getHours() + 5);

                        const fechaIngresoFormateada = `${fechaIngreso.getDate().toString().padStart(2, '0')}-${(fechaIngreso.getMonth() + 1).toString().padStart(2, '0')}-${fechaIngreso.getFullYear()} ${fechaIngreso.getHours().toString().padStart(2, '0')}:${fechaIngreso.getMinutes().toString().padStart(2, '0')}`;

                        const newRow = `
                        <tr style="border-style: none; border-bottom: 1px solid #dddee4;">
                                <td class="text-center">${contadorFilas}</td>
                                <td class="text-center">${fechaIngresoFormateada}</td>
                                <td class="text-dark" >${tramite.tipo_tramite || ''}</td>
                                <td class="text-center fw-semibold text-blue">${tramite.placa || ''}</td>
                                <td class="">${tramite.pago_placas_entidad_bancaria || ''}</td>
                                <td class="">${tramite.pago_placas_comprobante || ''}</td>
                                <td class="text-center">${tramite.pago_placas_fecha || ''}</td>
                                <td class="text-center">${tramite.pago_placas_valor || ''}</td>
                                <td class="text-center">${tramite.pago_placas_newservicio || ''}</td>
                                <td class="text-center">${tramite.id_tramite_axis || ''}</td>
                                <td class="text-center">
                                    <button class="btn bg-info-subtle text-warning me-1 visualizarTramite px-2 py-2" id="visualizar-${tramite.id_tramite}" data-id-tramite="${tramite.id_tramite}" data-username="${tramite.username}">
                                        <i class="ti ti-file-description fs-4"></i></button>
                                </td>
                            </tr>`;
                        tbody.append(newRow);
                        contadorFilas++;
                    });

                    $('#overlay').removeClass('active');

                    const fechaIngresoFormateada = `${fecha_inicial.split('-').reverse().join('-')}`;
                    $('#visualizacion_fecha_inicial').text(`Desde el: ${fechaIngresoFormateada}`);
                    const fechaFinalFormateada = `${fecha_final.split('-').reverse().join('-')}`;
                    $('#visualizacion_fecha_final').text(`Hasta el: ${fechaFinalFormateada}`);
                    $('#visualizacion_tipo_tramite').text(`Tipo de trámite: ${cons_tipo_tramite}`);
                    $('#visualizacion_numero_tramites').text(`${tramitesFiltrados.length} trámites`);
                    $('#visualizacion_cons_funcionario').text(`Usuario: ${cons_funcionario}`);
                    $('#visualizacion_clase_vehiculo').text(`Clase de vehículo: ${cons_clase_vehiculo}`);

                } else {
                    alert('TRÁMITES NO ENCONTRADOS');
                    $('#overlay').removeClass('active');
                }
            },
            error: function (error) {
                console.error('Error al buscar Trámite:', error);
                alert('Error al buscar Trámite. Por favor, inténtelo de nuevo.');
                $('#overlay').removeClass('active');
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

                    $('#fecha_ingreso').text(fechaFormateada);
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





});

$(document).ready(function () {
    $('#generarReportePlacasEXCEL').click(function () {
        const cons_funcionario = $('select[name="funcionarioSeleccionado"]').val();
        const fecha_inicial = $('input[name="fecha_ingreso_excel"]').val();
        const fecha_final = $('input[name="fecha_final_excel"]').val();
        const cons_tipo_tramite = $('input[name="tipo_tramite_excel"]').val();
        const cons_clase_vehiculo = $('input[name="cons_clase_vehiculo_excel"]').val();
        $('#overlay').addClass('active');

        console.info(cons_funcionario, cons_tipo_tramite, fecha_inicial, fecha_final, cons_clase_vehiculo);

        $.ajax({
            type: 'GET',
            url: '/exportar-datos',
            data: { fecha_inicial, fecha_final, cons_tipo_tramite, cons_clase_vehiculo, cons_funcionario },
            xhrFields: {
                responseType: 'blob'
            },
            success: function (response) {
                const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);


                const a = document.createElement('a');
                a.href = url;
                a.download = 'Pagos-de-placas.xlsx';
                document.body.appendChild(a);
                a.click();


                a.remove();
                window.URL.revokeObjectURL(url);
                $('#overlay').removeClass('active');
            },
            error: function (error) {
                console.error('Error al buscar Trámite:', error);
                alert('Error al buscar Trámite. Por favor, inténtelo de nuevo.');
                $('#overlay').removeClass('active');
            }
        });
    });
});


