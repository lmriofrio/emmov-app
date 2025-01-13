
//buscar placas para el inventario
$(document).ready(function () {


  $('#buscarPlacaInventario').click(function () {

    const placa = $('input[name="placa"]').val();

    if (placa.length >= 8) {

      $('#modalPlacaExtensa').modal('show');
      return;
    }


    $.ajax({
      type: 'POST',
      url: '/buscar-placa-inventario',
      data: { placa },
      success: function (response) {
        const tbody = $('#tbody-tramites');
        tbody.empty();

        if (response.success) {

          $('#sinResultados').addClass('d-none');
          $('#content').removeClass('d-none');
          let numeroFila = 1;
          response.placaInventario.forEach(placaInventario => {

            const fechaIngresoOriginal = placaInventario.salida_fecha;
            const fechaIngreso = new Date(fechaIngresoOriginal);
            fechaIngreso.setHours(fechaIngreso.getHours() + 5);

            const diaIngreso = fechaIngreso.getDate().toString().padStart(2, '0');
            const mesIngreso = (fechaIngreso.getMonth() + 1).toString().padStart(2, '0');
            const añoIngreso = fechaIngreso.getFullYear();
            const horaIngreso = fechaIngreso.getHours().toString().padStart(2, '0');
            const minutosIngreso = fechaIngreso.getMinutes().toString().padStart(2, '0');
            const fechaSalidaFormateada = `${diaIngreso}-${mesIngreso}-${añoIngreso} ${horaIngreso}:${minutosIngreso}`;

            let opcionesHabilitadas = [];

            opcionesHabilitadas.push(`
              <li>
                  <a class="dropdown-item visualizarTramite text-black" href="#" 
                     id="${placaInventario.id_inventario}" 
                     data-id-inventario="${placaInventario.id_inventario}"
                     data-username="">
                     Visualizar
                  </a>
              </li>
              <li>
                  <a class="dropdown-item visualizarTramite text-black" href="#" 
                     id="${placaInventario.id_inventario}" 
                     data-id-inventario="${placaInventario.id_inventario}"
                     data-username="">
                     Modificar registro
                  </a>
              </li>

            `);

            if (placaInventario.estado === 'ENTREGADO') {

              opcionesHabilitadas.push(`
                <li>
                                            <a class="dropdown-item imprimirActa text-black" href="#"
                                                data-salida-id-funcionario="1105205775"
                                                data-salida-fecha="2025-01-11T21:38:00.000Z"
                                                data-salida-tipo-entrega="ENTREGA GRUPAL"
                                                data-solicitante-id="1950131811" data-salida-acta="3"
                                                data-salida-nombre-puesto-funcionario="ASISTENTE DE INFORMACIÓN Y ACTUALIZACIÓN DE DATOS">
                                                Imprimir acta
                                            </a>

                </li>
                `);
            } else if (placaInventario.estado === 'POR ENTREGAR') {
            }

            const opcionesMenu = opcionesHabilitadas.join('');

            const newRow = `
                    <tr  style="border-style: none; border-bottom: 1px solid #dddee4;">
                        <td class="text-center text-overflow-1">${numeroFila}</td>
                        
                        <td class="text-center text-blue fw-semibold text-overflow-2">${placaInventario.placa}</td>
                        <td class="text-center text-overflow-2 text-nowrap" >${placaInventario.clase_transporte}</td>
                        <td class="text-center text-overflow-2">${placaInventario.clase_vehiculo}</td>
                        <td class="text-center text-overflow-2">${placaInventario.cantidad}</td>
                        <td class="text-overflow-2">${placaInventario.ubicacion || ''}</td>
                        <td class="text-center text-overflow-2">${placaInventario.estado}</td>
                        <td class="text-overflow-3">${fechaSalidaFormateada || ''}</td>
                        <td class="text-start text-overflow-7">${placaInventario.solicitante_nombre || ''}</td>
                        <td class="text-center align-items-center justify-content-center p-2 text-overflow-2 overflow-visible">
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
          });

          $('#tbody-tramites').on('click', '.imprimirActa', function () {
            const salida_id_funcionario = $(this).data('salida-id-funcionario');
            const salida_fecha = $(this).data('salida-fecha');
            const salida_tipo_entrega = $(this).data('salida-tipo-entrega');
            const solicitante_id = $(this).data('solicitante-id');
            const salida_acta = $(this).data('salida-acta');
            const salida_nombre_puesto_funcionario = $(this).data('salida-nombre-puesto-funcionario');

            console.info('solicitante-id', solicitante_id);

            const url = `/inventario-placas/entrega-placas/placa-entregada?salida_id_funcionario=${encodeURIComponent(salida_id_funcionario)}&salida_fecha=${encodeURIComponent(salida_fecha)}&salida_tipo_entrega=${encodeURIComponent(salida_tipo_entrega)}&solicitante_id=${encodeURIComponent(solicitante_id)}&salida_nombre_puesto_funcionario=${encodeURIComponent(salida_nombre_puesto_funcionario)}&salida_acta=${encodeURIComponent(salida_acta)}`;

            window.location.href = url;
          });


        } else {
          $('#sinResultados').removeClass('d-none');
          $('#content').addClass('d-none');
        }
      },
      error: function (error) {
        console.error('Error al buscar vehículo en la antigua js:', error);
        alert('Error al buscar vehículo. Por favor, inténtelo de nuevo.');
      }
    });


  });


});
//buscar placas para el web services
$(document).ready(function () {


  $('#buscarPlacaInventario_ServiciosWeb').click(function () {

    const placa = $('input[name="placa"]').val();

    if (placa.length >= 8) {

      $('#modalPlacaExtensa').modal('show');
      return;
    }


    $.ajax({
      type: 'POST',
      url: '/buscar-placa-inventario',
      data: { placa },
      success: function (response) {
        const tbody = $('#tbody-tramites');
        tbody.empty();

        if (response.success) {

          $('#content').removeClass('d-none');
          let numeroFila = 1;
          response.placaInventario.forEach(placaInventario => {

            const fechaIngresoOriginal = placaInventario.ingreso_fecha;
            const fechaIngreso = new Date(fechaIngresoOriginal);
            fechaIngreso.setHours(fechaIngreso.getHours() + 5);

            const diaIngreso = fechaIngreso.getDate().toString().padStart(2, '0');
            const mesIngreso = (fechaIngreso.getMonth() + 1).toString().padStart(2, '0');
            const añoIngreso = fechaIngreso.getFullYear();
            const horaIngreso = fechaIngreso.getHours().toString().padStart(2, '0');
            const minutosIngreso = fechaIngreso.getMinutes().toString().padStart(2, '0');
            const fechaIngresoFormateada = `${diaIngreso}-${mesIngreso}-${añoIngreso} ${horaIngreso}:${minutosIngreso}`;

            const newRow = `
                    <tr  style="border-style: none; border-bottom: 1px solid #dddee4;">

                        <td class="text-center text-overflow-3">${numeroFila}</td>
                        <td class="text-center text-overflow-3">${fechaIngresoFormateada}</td>
                        <td class="text-center text-blue fw-semibold text-overflow-3">${placaInventario.placa}</td>
                        <td class="text-center text-overflow-3 text-nowrap" >${placaInventario.clase_transporte}</td>
                        <td class="text-center text-overflow-3">${placaInventario.clase_vehiculo}</td>
                        <td class="text-center text-overflow-2">${placaInventario.cantidad}</td>
                        <td class="text-center text-overflow-3">${placaInventario.estado}</td>

                    </tr>`;
            tbody.append(newRow);
            numeroFila++;

            $('#content').removeClass('d-none');
            $('#sinResultados').addClass('d-none');

            $('#numeroRegistros').text(`Mostrando ${numeroFila - 1} registro`);
            $('#placaConsultada').text(placaInventario.placa);



          });

        } else {
          $('#content').addClass('d-none');
          $('#sinResultados').removeClass('d-none');

        }
      },
      error: function (error) {
        console.error('Error al buscar vehículo en la antigua js:', error);
        alert('Error al buscar vehículo. Por favor, inténtelo de nuevo.');
      }
    });


  });


});

$(document).ready(function () {
  let contadorPlacas = 1;


  $('#buscarPlacaInventarioEntregaGrupal').click(function () {
    const placa = $('input[name="placa"]').val();


    if (placa.length >= 8) {
      $('#modalPlacaExtensa').modal('show');
      return;
    }


    $.ajax({
      type: 'POST',
      url: '/buscar-placa-inventario',
      data: { placa },
      success: function (response) {
        const tbody = $('#tbody-tramites');
        tbody.empty();

        if (response.success) {

          mostrarAlerta('Placa encontrada en el inventario.', 'success');

          $('#sinResultados').addClass('d-none');
          $('#content').removeClass('d-none');
          let numeroFila = 1;

          response.placaInventario.forEach((placaInventario) => {
            let opcionesHabilitadas = [];

            if (placaInventario.estado === 'ENTREGADO') {

              estadoClass = '';
              estadoFont = 'fw-normal';

            } else if (placaInventario.estado === 'POR ENTREGAR') {

              opcionesHabilitadas.push(`
                <li>
                  <a class="dropdown-item entregarPlaca text-black" href="#" 
                     id="${placaInventario.id_inventario}" 
                     data-id-inventario="${placaInventario.id_inventario}">
                     Agregar a la entrega
                  </a>
                </li>
              `);
              estadoClass = 'text-blue';
              estadoFont = 'fw-semibold';
            }

            const opcionesMenu = opcionesHabilitadas.join('');
            const newRow = `
              <tr style="border-style: none; border-bottom: 1px solid #dddee4;">
                <td class="text-center px-1 py-1 text-overflow-1">${numeroFila}</td>
                <td class="text-center px-1 py-1 ${estadoClass} ${estadoFont} text-overflow-2">${placaInventario.placa}</td>
                <td class="text-center px-1 py-1 text-overflow-2">${placaInventario.clase_transporte}</td>
                <td class="text-center px-1 py-1 text-overflow-2">${placaInventario.clase_vehiculo}</td>
                <td class="text-center px-1 py-1 text-overflow-2">${placaInventario.cantidad}</td>
                <td class="text-center px-1 py-1 text-overflow-2">${placaInventario.estado}</td>
                <td class="text-center px-1 py-1 align-items-center justify-content-center p-2 text-overflow-2 overflow-visible">
                  <div class="btn-group">
                    <button class="btn btn-light-primary text-primary dropdown-toggle px-2 py-1" type="button" 
                        data-bs-toggle="dropdown" aria-expanded="false">
                      Acción
                    </button>
                    <ul class="dropdown-menu border">
                      ${opcionesMenu}
                    </ul>
                  </div>
                </td>
              </tr>`;
            tbody.append(newRow);
            numeroFila++;
          });


          $('#tbody-tramites').off('click', '.entregarPlaca').on('click', '.entregarPlaca', function () {
            const id_inventario = $(this).data('id-inventario');
            const placa = $(this).closest('tr').find('td:nth-child(2)').text();

            $('#contenedorPlacaInventario').append(`
              <div class="col d-flex p-1">
                <p class="col-2 m-0">${contadorPlacas}</p>
                <p class="col-6 m-0">${id_inventario}</p>
                <p class="col-4 m-0">${placa}</p>
                <input type="hidden" name="id_inventario[]" value="${id_inventario}">
              </div>
            `);

            contadorPlacas++;
          });




        } else {

          mostrarAlerta('La placa no existe en el inventario', 'danger');
          $('#sinResultados').removeClass('d-none');
          $('#content').addClass('d-none');
        }
      },
      error: function () {
        alert('Error al buscar vehículo. Por favor, inténtelo de nuevo.');
      }
    });
  });
});

//buscar placas para la entrega por unidades
$(document).ready(function () {


  $('#buscarPlacaInventarioEntregaIndividual').click(function () {

    const placa = $('input[name="placa"]').val();

    if (placa.length >= 8) {

      $('#modalPlacaExtensa').modal('show');
      return;
    }


    $.ajax({
      type: 'POST',
      url: '/buscar-placa-inventario',
      data: { placa },
      success: function (response) {
        const tbody = $('#tbody-tramites');
        tbody.empty();

        if (response.success) {

          $('#sinResultados').addClass('d-none');
          $('#content').removeClass('d-none');
          let numeroFila = 1;
          response.placaInventario.forEach(placaInventario => {

            const fechaIngresoOriginal = placaInventario.salida_fecha;
            const fechaIngreso = new Date(fechaIngresoOriginal);
            fechaIngreso.setHours(fechaIngreso.getHours() + 5);

            const diaIngreso = fechaIngreso.getDate().toString().padStart(2, '0');
            const mesIngreso = (fechaIngreso.getMonth() + 1).toString().padStart(2, '0');
            const añoIngreso = fechaIngreso.getFullYear();
            const horaIngreso = fechaIngreso.getHours().toString().padStart(2, '0');
            const minutosIngreso = fechaIngreso.getMinutes().toString().padStart(2, '0');
            const fechaSalidaFormateada = `${diaIngreso}-${mesIngreso}-${añoIngreso} ${horaIngreso}:${minutosIngreso}`;

            let opcionesHabilitadas = [];

            if (placaInventario.estado === 'ENTREGADO') {

              estadoClass = '';
              estadoFont = 'fw-normal';
            } else if (placaInventario.estado === 'POR ENTREGAR') {

              opcionesHabilitadas.push(`
              <li>
                  <a class="dropdown-item entregarPlaca text-black" href="#" 
                     id="${placaInventario.id_inventario}" 
                     data-id-inventario="${placaInventario.id_inventario}" 
                     data-username="">
                     Entregar
                  </a>
              </li>
              `);

              estadoClass = 'text-blue';
              estadoFont = 'fw-semibold';
            }

            const opcionesMenu = opcionesHabilitadas.join('');

            const newRow = `
                    <tr  style="border-style: none; border-bottom: 1px solid #dddee4;">
                        <td class="text-center text-overflow-1">${numeroFila}</td>
                         <td class="text-center px-1 py-1 ${estadoClass} ${estadoFont} text-overflow-2">${placaInventario.placa}</td>
                        <td class="text-center text-overflow-2 text-nowrap" >${placaInventario.clase_transporte}</td>
                        <td class="text-center text-overflow-2">${placaInventario.clase_vehiculo}</td>
                        <td class="text-center text-overflow-2">${placaInventario.estado}</td>
                        <td class="text-center align-items-center justify-content-center p-2 text-overflow-2 overflow-visible">
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
          });

          $('#tbody-tramites').on('click', '.entregarPlaca', function () {
            const id_inventario = $(this).data('id-inventario');

            console.log('ID inventario seleccionado:', id_inventario);

            $.ajax({
              type: 'GET',
              url: '/buscar-placa-id_inventario',
              data: { id_inventario },
              success: function (response) {
                if (response.success) {
                  window.location.href = `/inventario-placas/entrega-placas/entregar-placa-individual?id_inventario=${id_inventario}`;
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
          $('#content').addClass('d-none');
        }
      },
      error: function (error) {
        console.error('Error al buscar vehículo en la antigua js:', error);
        alert('Error al buscar vehículo. Por favor, inténtelo de nuevo.');
      }
    });


  });

});

