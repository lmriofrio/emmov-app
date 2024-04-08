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
                        if (tramite.clase_vehiculo === 'MOTOCICLETA') {
                            tramitesAgrupados[canton].motocicleta++;
                        } else if (tramite.clase_vehiculo === 'VEHICULO') {
                            tramitesAgrupados[canton].vehiculo++;
                        }
                    });

                    // Agregar filas a la tabla
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
                            </tr>`;
                        tbody.append(newRow);
                    });


                    const totalRow = `
                    <tr>
                        <td  colspan="3" class="fs-3 text-center"><b>TOTAL DE PROCESOS</b></td>
                        <td class="fs-3 text-center"><b>${tramitesFiltrados.length}</b></td>
                    </tr>`;
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
