

$(document).ready(function () {

    $('#consultarProcesoRTV').click(function () {

        const placa = $('input[name="placa"]').val();

        $.ajax({
            type: 'GET',
            url: '/visualizar-titulos-credito-filtro',
            data: { placa },

            success: function (response) {

                const tbody = $('#tbody-tramites');
                tbody.empty();

                if (response.success) {

                    let numeroFila = 1;
                    let total = 0;

                    response.titulosCredito.forEach(titulo => {

                        const subtotal = Number(titulo.subtotal_concepto) || 0;
                        total += subtotal;

                        const fila = `
                            <tr>
                                <td class="text-center">${numeroFila}</td>
                                <td class="text-center">${titulo.id_tramite}</td>
                                <td class="text-center fw-semibold">${titulo.placa}</td>
                                <td>${titulo.nombre_concepto}</td>
                                <td class="text-center">${titulo.cantidad_concepto}</td>
                                <td class="text-end">$${Number(titulo.valor_unitario_concepto).toFixed(2)}</td>
                                <td class="text-end">$${subtotal.toFixed(2)}</td>
                                <td class="text-center">${titulo.estado_titulo_credito}</td>
                                <td class="text-center">${titulo.id_usuario}</td>
                                <td class="text-center">${titulo.nombre_usuario}</td>
                            </tr>
                        `;

                        tbody.append(fila);
                        numeroFila++;

                    });

                    
                    $('#totalTitulos').text(`$${total.toFixed(2)}`);

                } else {
                    tbody.append(`
                        <tr>
                            <td colspan="8" class="text-center">
                                No se encontraron títulos de crédito
                            </td>
                        </tr>
                    `);
                }

            },

            error: function (error) {

                console.error('Error al buscar títulos de crédito:', error);

                alert('Error al buscar títulos de crédito.');

            }

        });

    });

});