$(document).ready(function () {
    $('#generarReporteDiarioEspecies').click(function () {
        const fecha_ingreso = $('input[name="fecha_ingreso"]').val();
        const fecha_final = $('input[name="fecha_final"]').val();
        const username = $('input[name="username"]').val();
        const jefatura_departamento = $('input[name="jefatura_departamento"]').val();
        const area_laboral = $('input[name="area_laboral"]').val();
        const rol_funcionario = $('input[name="rol_funcionario"]').val();
        const nombre_funcionario = $('input[name="nombre_funcionario"]').val();

        $('input[name="fecha_ingreso_pdf"]').val(fecha_ingreso);

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
            url: '/generar-reporte-diario-especies',
            data: { fecha_ingreso, fecha_final, username, jefatura_departamento, area_laboral },
            success: function (response) {
                const tbody = $('#tbody-tramites');
                tbody.empty();

                if (response.success) {
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

                    // Agrega las filas de la tabla con los trámites agrupados
                    Object.entries(tramitesAgrupados).forEach(([tipoTramite, cantidad]) => {
                        const newRow = `
                            <tr>
                                <td class="text-left">${tipoTramite}</td>
                                <td class="text-center">${cantidad}</td>
                            </tr>`;
                        tbody.append(newRow);
                    });

                    // Agrega una fila al final con la suma total de las cantidades de trámites
                    const totalRow = `
                        <tr>
                            <td class="text-center"><b>TOTAL DE PROCESOS</b></td>
                            <td class="text-center"><b>${tramitesFiltrados.length}</b></td>
                        </tr>`;
                    tbody.append(totalRow);

                    const numeroEspeciesUtilizadas = tramitesFiltrados.length;


                    // Asigna la fecha ingresada a los campos de fecha
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
