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

                    if (tramite.resultado_final_RTV === 'Aprobado') {
                        estadoClass = 'bg-info';
                        estadoFont = 'fw-normal';

                    } else if (tramite.resultado_final_RTV === 'Condicionado') {
                        estadoClass = 'bg-wait';
                        estadoFont = 'fw-normal';

                    } else if (tramite.resultado_final_RTV === '' || tramite.resultado_final_RTV === null) {
                        estadoFont = 'fw-semibold';

                        opcionesHabilitadas.push(`
        <li>
            <a class="dropdown-item aprobarRevision text-black px-4" href="#" 
               data-bs-toggle="modal" data-bs-target="#modalAprobarRevision" 
               id="reasignar-${tramite.id_tramite}" 
               data-id-tramite="${tramite.id_tramite}" 
               data-username="${tramite.username}">
               Aprobar revisión
            </a>
        </li>
    `);
                    }




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

<td class="d-flex align-items-center justify-content-start text-overflow-5">
  <span class="round-8 ${estadoClass} rounded-circle d-inline-block ms-2"></span>
  <span class="badge text-dark rounded-pill fw-normal ms-2">${tramite.resultado_final_RTV || ''}</span>
</td>

                            <td class="text-center text-overflow-4">${tramite.username_funcionario_asignado_INFORMACION}</td>
                                                    
                        </tr>
                    `;
                    tbody.append(newRow);
                    numeroFila++;







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



