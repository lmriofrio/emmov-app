$(document).ready(function () {
    $('#generarReporteDiario').click(function () {
        const fecha_ingreso = $('input[name="fecha_ingreso"]').val();
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

        $.ajax({
            type: 'GET',
            url: '/generar-reporte-diario',
            data: { fecha_ingreso, username, jefatura_departamento, area_laboral },
            success: function (response) {
                const tbody = $('#tbody-tramites');
                tbody.empty();

                if (response.success) {
                    let numeroFila = 1;
                    response.tramites.forEach(tramite => {


                        const fechaParts = tramite.fecha_ingreso.split('-');
                        const dia = fechaParts[2];
                        const mes = fechaParts[1];
                        const año = fechaParts[0];

                        const fechaFormateada = `${dia}-${mes}-${año}`;
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