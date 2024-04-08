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
                            <td class="fs-3 text-center"><b>TOTAL DE PROCESOS</b></td>
                            <td class="fs-3 text-center"><b>${tramitesFiltrados.length}</b></td>
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
