function mostrarAlerta(mensaje, tipo = 'success') {

  $('#alert-container').find('.alert').remove();

  const estadoTexto =
    tipo === 'success' ? 'ÉXITO' :
      tipo === 'warning' ? 'ATENCIÓN' :
        tipo === 'danger' ? 'ERROR' :
          'INFORMACIÓN';

  $('#alert-container').html(`
    <div class="alert alert-${tipo} alert-dismissible p-2 fade show d-flex col-12 align-items-center shadow-alert">
      <div class="col-11 pe-2">
        <div class="row">
          <strong class="col-12">¡${estadoTexto}!</strong>
        </div>
        <div class="row">
          <span class="col text-nowrap">
            ${mensaje}
          </span>
        </div>
      </div>
      <div class="col-auto">
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    </div>
  `);

  const $alert = $('#alert-container').find('.alert');
  setTimeout(function () {
    $alert.addClass('fade-out');
    setTimeout(() => $alert.alert('close'), 1000);
  }, 3000);
}



// 1.-Modifica el css del body para adaptarlo al tamaño de la PANTALLA
document.addEventListener("DOMContentLoaded", function () {
  var mainWrapper = document.getElementById('main-wrapper');
  var headerNameShort = document.getElementById('header-nameShort');
  var iconNavs = document.querySelectorAll('.icon-nav');
  var navTexts = document.querySelectorAll('.nav-text');

  function adjustSidebar() {
    if (window.innerWidth <= 767.98) {
      mainWrapper.setAttribute('data-sidebartype', 'mini-sidebar');
      headerNameShort.classList.add('d-none');
      iconNavs.forEach(function (icon) {
        icon.classList.remove('d-none');
      });
      navTexts.forEach(function (text) {
        text.classList.add('d-none');
      });
    } else {
      mainWrapper.setAttribute('data-sidebartype', 'full');
      headerNameShort.classList.remove('d-none');
      iconNavs.forEach(function (icon) {
        icon.classList.add('d-none');
      });
      navTexts.forEach(function (text) {
        text.classList.remove('d-none');
      });
    }
  }

  adjustSidebar();
  window.addEventListener('resize', adjustSidebar);
});

// 2.-Selects vinculados de clase y tipo de vehiculo
document.addEventListener('DOMContentLoaded', () => {
  const claseVehiculoSelect = document.getElementById('clase_vehiculo');
  const tipoVehiculoSelect = document.getElementById('tipo_vehiculo');

  const data = {
    AUTOBÚS: ['BUS', 'BUSETA', 'BUS COSTA', 'ÓMNIBUS'],
    AUTOMÓVIL: ['CUPÉ', 'DEPORTIVO', 'ELÉCTRICO', 'HÍBRIDO', 'HATCHBACK', 'SEDÁN', 'STATION WAGON'],
    CAMIÓN: ['CAMIÓN', 'CARROCERÍA DE ESTACAS', 'FURGÓN', 'MIXTO', 'PLATAFORMA', 'REPARTO'],
    CAMIONETA: ['CABINA SIMPLE', 'DOBLE CABINA', 'FURGONETA', 'CAJÓN', 'PICK-UP'],
    MOTOCICLETA: ['CROSS', 'CUADRÓN', 'DEPORTIVA', 'PASEO', 'DOS RUEDAS'],
    "VEHÍCULO UTILITARIO": ['JEEP']
  };

  function actualizarTiposDeVehiculo(claseSeleccionada, tipoSeleccionado = '') {
    tipoVehiculoSelect.innerHTML = '<option value="">Seleccione el tipo de vehículo</option>';
    tipoVehiculoSelect.disabled = true;

    if (data[claseSeleccionada]) {
      data[claseSeleccionada].forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        tipoVehiculoSelect.appendChild(option);
      });
      tipoVehiculoSelect.disabled = false;

      if (tipoSeleccionado) {
        tipoVehiculoSelect.value = tipoSeleccionado;
      }
    }
  }

  if (claseVehiculoSelect) {
    claseVehiculoSelect.addEventListener('change', () => {
      const selectedClass = claseVehiculoSelect.value;
      actualizarTiposDeVehiculo(selectedClass);
    });
  }

  window.actualizarTiposDeVehiculo = actualizarTiposDeVehiculo;
});

// 3.- buscar vehiculo desde agregar turno en la BD (REGISTRO-VEHICULO)
$(document).ready(function () {
  $('#buscarVehiculo').off('click').on('click', function () {
    const placa = $('input[name="placa"]').val().trim();
    const id_vehiculo = $('input[name="placa"]').val().trim();

    if (placa === '') {
      mostrarAlerta('El valor de la PLACA esta vacío.', 'danger');
      return;
    }

    if (placa.length >= 8) {
      $('#modalPlacaExtensa').modal('show');
      return;
    }

    $.ajax({
      type: 'POST',
      url: '/buscar-vehiculo',
      data: { placa },
      success: function (response) {

        $('#placaVehiculoConsultada').val('');
        $('#tipo_peso').val('');
        $('#clase_vehiculo_tipo').val('');
        $('#clase_vehiculo').val('');
        $('#tipo_vehiculo').val('');
        $('#clase_transporte').val('');
        $('input[name="tipo_id_usuario"]').prop('checked', false);
        $('#id_usuario').val('');
        $('#nombre_usuario').val('');
        $('#provincia_usuario').val('');
        $('#canton_usuario').val('');
        $('#parroquia_usuario').val('');
        $('#direccion_usuario').val('');
        $('#celular_usuario').val('');
        $('#email_usuario').val('');


        $('#result_placa').val();
        $('#result_camvCpn').val();
        $('#result_cilindraje').val();
        $('#result_marca').val();
        $('#result_modelo').val();
        $('#result_anioModelo').val();
        $('#result_paisFabricacion').val();
        $('#result_clase').val();
        $('#result_servicio').val();
        $('#result_placa2').text();
        $('#result_camvCpn2').text();
        $('#result_cilindraje2').text();
        $('#result_marca2').text();
        $('#result_modelo2').text();
        $('#result_anioModelo2').text();
        $('#result_paisFabricacion2').text();
        $('#result_clase2').text();
        $('#result_servicio2').text();

        if (response.success) {


          $('#nav-tabTittle').removeClass('d-none');
          $('#nav-tabContent').removeClass('d-none');
          $('#form-actions-save-turn').removeClass('d-none');

          $('#placaVehiculoConsultada').val(placa);
          $('#tipo_peso').val(response.vehiculo.tipo_peso || '');
          $('#clase_vehiculo_tipo').val(response.vehiculo.clase_vehiculo_tipo || '');
          $('#clase_vehiculo').val(response.vehiculo.clase_vehiculo || '');
          $('#clase_transporte').val(response.vehiculo.clase_transporte || '');
          $('#id_usuario').val(response.vehiculo.id_usuario || '');
          $('#nombre_usuario').val(response.vehiculo.nombre_usuario || '');
          $('#provincia_usuario').val(response.vehiculo.provincia_usuario || '');
          $('#canton_usuario').val(response.vehiculo.canton_usuario || '');
          $('#direccion_usuario').val(response.vehiculo.direccion_usuario || '');
          $('#parroquia_usuario').val(response.vehiculo.parroquia_usuario || '');
          $('#celular_usuario').val(response.vehiculo.celular_usuario || '');
          $('#email_usuario').val(response.vehiculo.email_usuario || '');

          // Seleccionar el radio button correspondiente al tipo de identificación
          $(`input[name="tipo_id_usuario"][value="${response.vehiculo.tipo_id_usuario || ''}"]`).prop('checked', true);

          // Actualizar los selects dependientes
          $('#clase_vehiculo').trigger('change'); // Disparar el evento de cambio para cargar el tipo de vehículo

          // Actualizar tipo de vehículo usando la función del script principal
          window.actualizarTiposDeVehiculo(response.vehiculo.clase_vehiculo, response.vehiculo.tipo_vehiculo);

          // Actualizar los selects dependientes
          $('#provincia_usuario').trigger('change'); // Disparar el evento de cambio para cargar el tipo de vehículo

          // Actualizar tipo de vehículo usando la función del script principal
          window.actualizarCantones(response.vehiculo.provincia_usuario, response.vehiculo.canton_usuario);

          mostrarAlerta('Vehículo encontrado en la empresa.', 'success');

        } else {
          $('#nav-tabTittle').removeClass('d-none');
          $('#nav-tabContent').removeClass('d-none');
          $('#form-actions-save-turn').removeClass('d-none');

          mostrarAlerta('Vehículo no encontrado en la empresa.', 'danger');

        }
      },
      error: function (error) {
        console.error('Error al buscar vehículo: ', error);
        alert('Error al buscar vehículo. Por favor, inténtelo de nuevo.');
      }
    });

    $.ajax({
      type: 'POST',
      url: '/buscar-vehiculo-sri',
      contentType: 'application/json',
      data: JSON.stringify({ id_vehiculo }),
      success: function (response) {

        $('#result_placa').val();
        $('#result_camvCpn').val();
        $('#result_cilindraje').val();
        $('#result_marca').val();
        $('#result_modelo').val();
        $('#result_anioModelo').val();
        $('#result_paisFabricacion').val();
        $('#result_clase').val();
        $('#result_servicio').val();
        $('#result_placa2').text();
        $('#result_camvCpn2').text();
        $('#result_cilindraje2').text();
        $('#result_marca2').text();
        $('#result_modelo2').text();
        $('#result_anioModelo2').text();
        $('#result_paisFabricacion2').text();
        $('#result_clase2').text();
        $('#result_servicio2').text();



        if (response.success) {

          $('#nav-tabTittle').removeClass('d-none');
          $('#nav-tabContent').removeClass('d-none');
          $('#form-actions-save-turn').removeClass('d-none');

          $('#informacion').text(response.data.informacion);
          $('#total').text(`USD $ ${(response.data.total)} `);

          $('#result_placa').val(response.data.placa);
          $('#result_camvCpn').val(response.data.camvCpn);
          $('#result_cilindraje').val(response.data.cilindraje);
          $('#result_marca').val(response.data.marca);
          $('#result_modelo').val(response.data.modelo);
          $('#result_anioModelo').val(response.data.anioModelo);
          $('#result_paisFabricacion').val(response.data.paisFabricacion);
          $('#result_clase').val(response.data.clase);
          $('#result_servicio').val(response.data.servicio);

          $('#result_placa2').text(response.data.placa);
          $('#result_camvCpn2').text(response.data.camvCpn);
          $('#result_cilindraje2').text(response.data.cilindraje);
          $('#result_marca2').text(response.data.marca);
          $('#result_modelo2').text(response.data.modelo);
          $('#result_anioModelo2').text(response.data.anioModelo);
          $('#result_paisFabricacion2').text(response.data.paisFabricacion);
          $('#result_clase2').text(response.data.clase);
          $('#result_servicio2').text(response.data.servicio);

          $('#clase_vehiculo').trigger('change');
          $('#provincia_usuario').trigger('change');

          $('#contentConSRI').removeClass('d-none');
          $('#cosultaSRI').removeClass('d-none');

          $('#contentAggTurno').addClass('animated fadeInRight');


          if (response.data.informacion === 'El vehiculo no tiene registros por pagar') {
            $('#sinDeudasSRI').removeClass('d-none');
            $('#DeudasSRI').addClass('d-none');
            $('#noExisteVehiculoSRI').addClass('d-none');
          } else if (response.data.informacion === null) {
            $('#DeudasSRI').removeClass('d-none');
            $('#sinDeudasSRI').addClass('d-none');
            $('#noDisponibleSRI').addClass('d-none');

            const data = response.data.deudas;

            $('#deudasTableBody').empty();

            data.forEach(deuda => {
              $('#deudasTableBody').append(`
              <tr <td class="col">
                  <td class="col-7 fw-normal text-start fs-3">${deuda.descripcion}</td>
                  <td class="col-5 text-end fw-semibold fs-4">USD $${deuda.subtotal.toFixed(2)}</td>
              </tr>
              `);
            });

            $('#total').text(`USD $${data.total.toFixed(2)}`);

          }
        } else {
          //Cuando el vehiculo no existe en el SRI
          $('#nav-tabTittle').removeClass('d-none');
          $('#nav-tabContent').removeClass('d-none');
          $('#form-actions-save-turn').removeClass('d-none');
          $('#noExisteVehiculoSRI').removeClass('d-none');
          $('#clase_vehiculo').trigger('change');
          $('#provincia_usuario').trigger('change');
          $('#contentConSRI').removeClass('d-none');
          $('#cosultaSRI').addClass('d-none');
        }
      },
      error: function (error) {
        if (error.responseJSON && error.responseJSON.message === 'Servicio del SRI no disponible') {
        } else if (error.responseJSON && error.responseJSON.message === 'Vehículo no encontrado en SRI') {
          mostrarAlerta('Vehículo no existe en el SRI.', 'warning');
        } else if (error.responseJSON && error.responseJSON.message === 'Error en la consulta.') {
          $('#nav-tabTittle').removeClass('d-none');
          $('#nav-tabContent').removeClass('d-none');
          $('#form-actions-save-turn').removeClass('d-none');

          $('#clase_vehiculo').trigger('change');
          $('#provincia_usuario').trigger('change');


          $('#contentConSRI').removeClass('d-none');
          $('#noDisponibleSRI').removeClass('d-none');
          $('#cosultaSRI').addClass('d-none');
        }
      }
    });




  });
});

// 4.- buscar vehiculo desde turnero en el SRI (API HACIA SRI)
$(document).ready(function () {
  $('#buscarVehiculoSRI').off('click').on('click', function () {
    const id_vehiculo = $('input[name="ramw"]').val().trim();

    if (id_vehiculo === '') {
      mostrarAlerta('El valor de la PLACA está vacío.', 'danger');
      return;
    }

    if (id_vehiculo.length >= 20) {
      $('#modalRawn').modal('show');
      return;
    }

    $.ajax({
      type: 'POST',
      url: '/buscar-vehiculo-sri',
      contentType: 'application/json',
      data: JSON.stringify({ id_vehiculo }),
      success: function (response) {

        $('#placaVehiculoConsultada').val('');
        $('#tipo_peso').val('');
        $('#clase_vehiculo_tipo').val('');
        $('#clase_vehiculo').val('');
        $('#tipo_vehiculo').val('');
        $('#clase_transporte').val('');
        $('input[name="tipo_id_usuario"]').prop('checked', false);
        $('#id_usuario').val('');
        $('#nombre_usuario').val('');
        $('#provincia_usuario').val('');
        $('#canton_usuario').val('');
        $('#parroquia_usuario').val('');
        $('#direccion_usuario').val('');
        $('#celular_usuario').val('');
        $('#email_usuario').val('');

        $('#result_placa').val('');
        $('#result_camvCpn').val('');
        $('#result_cilindraje').val('');
        $('#result_marca').val('');
        $('#result_modelo').val('');
        $('#result_anioModelo').val('');
        $('#result_paisFabricacion').val('');
        $('#result_clase').val('');
        $('#result_servicio').val('');
        $('#result_placa2').text('');
        $('#result_camvCpn2').text('');
        $('#result_cilindraje2').text('');
        $('#result_marca2').text('');
        $('#result_modelo2').text('');
        $('#result_anioModelo2').text('');
        $('#result_paisFabricacion2').text('');
        $('#result_clase2').text('');
        $('#result_servicio2').text('');

        $('#contentAggTurno').addClass('animated fadeInRight');

        if (response.success) {

          $('#nav-tabTittle').removeClass('d-none');
          $('#nav-tabContent').removeClass('d-none');
          $('#form-actions-save-turn').removeClass('d-none');

          $('#informacion').text(response.data.informacion);
          $('#total').text(`USD $ ${(response.data.total)} `);

          $('#result_placa').val(response.data.placa);
          $('#result_camvCpn').val(response.data.camvCpn);
          $('#result_cilindraje').val(response.data.cilindraje);
          $('#result_marca').val(response.data.marca);
          $('#result_modelo').val(response.data.modelo);
          $('#result_anioModelo').val(response.data.anioModelo);
          $('#result_paisFabricacion').val(response.data.paisFabricacion);
          $('#result_clase').val(response.data.clase);
          $('#result_servicio').val(response.data.servicio);

          $('#result_placa2').text(response.data.placa);
          $('#result_camvCpn2').text(response.data.camvCpn);
          $('#result_cilindraje2').text(response.data.cilindraje);
          $('#result_marca2').text(response.data.marca);
          $('#result_modelo2').text(response.data.modelo);
          $('#result_anioModelo2').text(response.data.anioModelo);
          $('#result_paisFabricacion2').text(response.data.paisFabricacion);
          $('#result_clase2').text(response.data.clase);
          $('#result_servicio2').text(response.data.servicio);

          $('#clase_vehiculo').trigger('change');
          $('#provincia_usuario').trigger('change');

          $('#contentConSRI').removeClass('d-none');
          $('#cosultaSRI').removeClass('d-none');

          if (response.data.informacion === 'El vehiculo no tiene registros por pagar') {
            $('#sinDeudasSRI').removeClass('d-none');
            $('#DeudasSRI').addClass('d-none');
            $('#noExisteVehiculoSRI').addClass('d-none');
          } else if (response.data.informacion === null) {
            $('#DeudasSRI').removeClass('d-none');
            $('#sinDeudasSRI').addClass('d-none');
            $('#noDisponibleSRI').addClass('d-none');

            const data = response.data.deudas;

            $('#deudasTableBody').empty();

            data.forEach(deuda => {
              $('#deudasTableBody').append(`
              <tr <td class="col">
                  <td class="col-7 fw-normal text-start fs-3">${deuda.descripcion}</td>
                  <td class="col-5 text-end fw-semibold fs-4">USD $${deuda.subtotal.toFixed(2)}</td>
              </tr>
              `);
            });

            $('#total').text(`USD $${data.total.toFixed(2)}`);

          }
        } else {
          //Cuando el vehiculo no existe en el SRI
          $('#nav-tabTittle').removeClass('d-none');
          $('#nav-tabContent').removeClass('d-none');
          $('#form-actions-save-turn').removeClass('d-none');
          $('#noExisteVehiculoSRI').removeClass('d-none');
          $('#clase_vehiculo').trigger('change');
          $('#provincia_usuario').trigger('change');
          $('#contentConSRI').removeClass('d-none');
          $('#cosultaSRI').addClass('d-none');
        }
      },
      error: function (error) {
        if (error.responseJSON && error.responseJSON.message === 'Servicio del SRI no disponible') {
        } else if (error.responseJSON && error.responseJSON.message === 'Vehículo no encontrado en SRI') {
          mostrarAlerta('Vehículo no existe en el SRI.', 'warning');
        } else if (error.responseJSON && error.responseJSON.message === 'Error en la consulta.') {
          $('#nav-tabTittle').removeClass('d-none');
          $('#nav-tabContent').removeClass('d-none');
          $('#form-actions-save-turn').removeClass('d-none');

          $('#clase_vehiculo').trigger('change');
          $('#provincia_usuario').trigger('change');


          $('#contentConSRI').removeClass('d-none');
          $('#noDisponibleSRI').removeClass('d-none');
          $('#cosultaSRI').addClass('d-none');
        }
      }
    });


  });
});

// 5.- buscar vehiculo desde registro directo en la BD (REGISTRO-VEHICULO)
$(document).ready(function () {
  $('#buscarVehiculoRD').off('click').on('click', function () {
    const placa = $('input[name="placa"]').val().trim();

    if (placa === '') {

      mostrarAlerta('El valor de la PLACA esta vacío.', 'danger');

      return;
    }

    if (placa.length >= 8) {
      $('#modalPlacaExtensa').modal('show');
      return;
    }

    $.ajax({
      type: 'POST',
      url: '/buscar-vehiculo',
      data: { placa },
      success: function (response) {

        $('#placaVehiculoConsultada').val('');
        $('#tipo_peso').val('');
        $('#clase_vehiculo_tipo').val('');
        $('#clase_vehiculo').val('');
        $('#tipo_vehiculo').val('');
        $('#clase_transporte').val('');
        $('#tipo_id_usuario').val('');
        $('#id_usuario').val('');
        $('#nombre_usuario').val('');
        $('#provincia_usuario').val('');
        $('#canton_usuario').val('');
        $('#parroquia_usuario').val('');
        $('#direccion_usuario').val('');
        $('#celular_usuario').val('');
        $('#email_usuario').val('');

        if (response.success) {

          $('#placaVehiculoConsultada').val(placa);
          $('#tipo_peso').val(response.vehiculo.tipo_peso || '');
          $('#clase_vehiculo_tipo').val(response.vehiculo.clase_vehiculo_tipo || '');
          $('#clase_vehiculo').val(response.vehiculo.clase_vehiculo || '');
          $('#tipo_vehiculo').val(response.vehiculo.tipo_vehiculo || '');
          $('#clase_transporte').val(response.vehiculo.clase_transporte || '');
          $('#tipo_id_usuario').val(response.vehiculo.tipo_id_usuario || '');
          $('#id_usuario').val(response.vehiculo.id_usuario || '');
          $('#nombre_usuario').val(response.vehiculo.nombre_usuario || '');
          $('#provincia_usuario').val(response.vehiculo.provincia_usuario || '');
          $('#canton_usuario').val(response.vehiculo.canton_usuario || '');
          $('#direccion_usuario').val(response.vehiculo.direccion_usuario || '');
          $('#parroquia_usuario').val(response.vehiculo.parroquia_usuario || '');
          $('#celular_usuario').val(response.vehiculo.celular_usuario || '');
          $('#email_usuario').val(response.vehiculo.email_usuario || '');

          mostrarAlerta('Vehículo encontrado.', 'success');

        } else {
          $('#nav-tabTittle').removeClass('d-none');
          $('#nav-tabContent').removeClass('d-none');
          $('#form-actions-save-turn').removeClass('d-none');

          mostrarAlerta('Vehículo no encontrado.', 'danger');

        }
      },
      error: function (error) {
        console.error('Error al buscar vehículo: ', error);
        alert('Error al buscar vehículo. Por favor, inténtelo de nuevo.');
      }
    });
  });
});

// 6.- buscar usuario
$(document).ready(function () {

  $('#buscarUsuario').off('click').on('click', function () {
    console.log("Evento 'click' registrado para #buscarUsuario");
    const id_usuario = $('input[name="id_usuario"]').val();

    if (!id_usuario || id_usuario.length >= 15) {
      console.log("ID de usuario demasiado largo o vacío");
      $('#modalIDExtensa').modal('show');
      return;
    }

    $.ajax({
      type: 'POST',
      url: '/buscar-usuario',
      data: { id_usuario },
      success: function (response) {
        $('input[name="tipo_id_usuario"]').prop('checked', false);
        $('#nombre_usuario').val('');
        $('#provincia_usuario').val('');
        $('#canton_usuario').val('');
        $('#parroquia_usuario').val('');
        $('#direccion_usuario').val('');
        $('#celular_usuario').val('');
        $('#email_usuario').val('');

        if (response.success) {
          $('#nombre_usuario').val(response.usuario.nombre_usuario);
          $('#provincia_usuario').val(response.usuario.provincia_usuario);
          $('#canton_usuario').val(response.usuario.canton_usuario);
          $('#parroquia_usuario').val(response.usuario.parroquia_usuario);
          $('#direccion_usuario').val(response.usuario.direccion_usuario);
          $('#celular_usuario').val(response.usuario.celular_usuario);
          $('#email_usuario').val(response.usuario.email_usuario);
          $('#provincia_usuario').trigger('change');

          // Seleccionar el radio button correspondiente al tipo de identificación
          $(`input[name="tipo_id_usuario"][value="${response.usuario.tipo_id_usuario || ''}"]`).prop('checked', true);

          // Actualizar los selects dependientes
          $('#provincia_usuario').trigger('change'); // Disparar el evento de cambio para cargar el tipo de vehículo

          window.actualizarCantones(response.usuario.provincia_usuario, response.usuario.canton_usuario);

        } else {
          mostrarAlerta('Usuario no encontrado.', 'warning');
        }
      },
      error: function (error) {
        console.error('Error al buscar usuario:', error);
        alert('Error al buscar usuario. Por favor, inténtelo de nuevo.');
      }
    });
  });
});

// 5.- guardar el tramite desde el area de Informacion
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registroFormAreaInformacion');
  const placaInput = document.getElementById('placa');
  const tipoTramiteSelect = document.getElementById('tipo_tramite');

  if (!form) return;

  // Validación de Bootstrap
  form.addEventListener('submit', function (event) {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add('was-validated');
  }, false);

  // Función para validar si la placa es obligatoria según el tipo de trámite
  function validarRequerimientoPlaca() {
    const tipoTramite = tipoTramiteSelect.value;

    // Tipos de trámite que no requieren la placa
    const tiposSinPlaca = ["CERTIFICADO DE POSEER VEHICULO", "EMISION DE MATRICULA POR PRIMERA VEZ"];

    if (tiposSinPlaca.includes(tipoTramite)) {
      placaInput.removeAttribute('required');
      document.getElementById('clase_vehiculo').removeAttribute('required');
      document.getElementById('tipo_vehiculo').removeAttribute('required');
      document.getElementById('clase_transporte').removeAttribute('required');
      document.getElementById('tipo_peso').removeAttribute('required');  // No es obligatorio
    } else {
      placaInput.setAttribute('required', 'required'); // Es obligatorio
    }
  }

  // Detectar cambio en el select de tipo_tramite
  tipoTramiteSelect.addEventListener('change', function () {
    validarRequerimientoPlaca();
  });

  // Llamar a la función de validación al cargar la página, por si hay un valor preseleccionado
  validarRequerimientoPlaca();

  document.getElementById('guardarTramiteAreaInformacion').addEventListener('click', async function (event) {
    event.preventDefault();

    // Validación del formulario
    if (!form.checkValidity()) {
      form.classList.add('was-validated'); // Mostrar mensajes de error de Bootstrap
      return; // No continuar si algún campo esta vacío
    }

    // Si la validación es correcta, procedemos a enviar el formulario
    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    try {
      const response = await fetch('/guardar-tramite-informacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formObject),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Trámite guardado con éxito:', result);
      } else {
        const errorText = await response.text();
        console.error('Error al guardar el trámite:', errorText);
        alert('Error al guardar el trámite: ' + errorText);
      }
    } catch (error) {
      console.error('Error al guardar el trámite:', error);
      alert('Error al guardar el trámite');
    }
  });
});

// 6.- guradar el tramite desde REGISTRO DIARIO
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registroForm');
  const tipoTramiteSelect = document.getElementById('tipo_tramite');
  const placaInput = document.getElementById('placa');

  if (!form) return;

  // Validación de Bootstrap
  form.addEventListener('submit', function (event) {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add('was-validated');
  }, false);

  // Función para validar si la placa es obligatoria según el tipo de trámite
  function validarRequerimientoPlaca() {

    let tipoTramite = tipoTramiteSelect.value;

    // Tipo de trámite que no requieren la placa
    const tiposSinPlaca = ["CERTIFICADO DE POSEER VEHICULO"];

    if (tiposSinPlaca.includes(tipoTramite)) {
      document.getElementById('placa').removeAttribute('required');
      document.getElementById('clase_vehiculo_tipo').removeAttribute('required');
      document.getElementById('clase_transporte').removeAttribute('required');
      document.getElementById('tipo_peso').removeAttribute('required');
    } else {
      placaInput.setAttribute('required', 'required');
      document.getElementById('clase_vehiculo_tipo').setAttribute('required', 'required');
      document.getElementById('clase_transporte').setAttribute('required', 'required');
      document.getElementById('tipo_peso').setAttribute('required', 'required');
    }
  }

  // Detectar cambio en el select de tipo_tramite
  tipoTramiteSelect.addEventListener('change', function () {
    validarRequerimientoPlaca();
  });

  document.getElementById('guardarTramiteRegistroDiario').addEventListener('click', async function (event) {
    event.preventDefault();

    // Validación del formulario
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    // Obtener valores de los campos del formulario
    const telefono = form.querySelector('input[name="celular_usuario"]').value;
    const nombrePropietario = form.querySelector('input[name="nombre_usuario"]').value;

    // Validación de campos
    let valid = true;
    let errorMessage = '';

    if (telefono.length !== 10) {
      valid = false;
      errorMessage += 'El número de teléfono debe tener exactamente 10 caracteres.\n';
    }

    if (!valid) {
      alert(errorMessage);
      return;
    }

    // Crear el objeto FormData y convertirlo a un objeto JavaScript
    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    try {
      // Enviar los datos al servidor
      const response = await fetch('/guardar-tramite-directo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formObject),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Trámite guardado con éxito:', result);
      } else {
        const errorText = await response.text();
        console.error('Error al guardar el trámite:', errorText);
        alert('Error al guardar el trámite: ' + errorText);
      }
    } catch (error) {
      console.error('Error al guardar el trámite:', error);
      alert('Error al guardar el trámite');
    }
  });
});

// 7.- guradar el tramite desde REGISTRO DIARIO POR TURNOS
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registroFormTurn');

  if (!form) return;

  // Verifica si el formulario existe
  if (form) {
    const tipoTramiteSelect = document.getElementById('tipo_tramite');
    const placaInput = document.getElementById('placa');

    // Validación de Bootstrap
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);

    // Función para validar si la placa es obligatoria según el tipo de trámite
    function validarRequerimientoPlaca() {

      let tipoTramite = tipoTramiteSelect.value;

      // Tipos de trámite que no requieren la placa
      const tiposSinPlaca = ["CERTIFICADO DE POSEER VEHICULO"];

      if (tiposSinPlaca.includes(tipoTramite)) {
        document.getElementById('placa').removeAttribute('required');
        document.getElementById('clase_vehiculo_tipo').removeAttribute('required');
        document.getElementById('clase_transporte').removeAttribute('required');
        document.getElementById('tipo_peso').removeAttribute('required');
      } else {
        placaInput.setAttribute('required', 'required');
        document.getElementById('clase_vehiculo_tipo').setAttribute('required', 'required');
        document.getElementById('clase_transporte').setAttribute('required', 'required');
        document.getElementById('tipo_peso').setAttribute('required', 'required');
      }
    }

    // Función para validar si la placa y datos del usuario son obligatorios es obligatoria según el tipo de trámite
    function validarRequerimientoUsuarioPlaca() {
      let tipoTramite = tipoTramiteSelect.value;

      // Tipos de trámite que no requieren la placa
      const tiposSinUsuarioPlaca = ["ADHESIVO ANULADO"];

      if (tiposSinUsuarioPlaca.includes(tipoTramite)) {
        document.getElementById('placa').removeAttribute('required');
        document.getElementById('clase_vehiculo_tipo').removeAttribute('required');
        document.getElementById('clase_transporte').removeAttribute('required');
        document.getElementById('tipo_peso').removeAttribute('required');

        document.getElementById('id_usuario').removeAttribute('required');
        document.getElementById('nombre_usuario').removeAttribute('required');
        document.getElementById('canton_usuario').removeAttribute('required');
      } else {
        placaInput.setAttribute('required', 'required');
        document.getElementById('clase_vehiculo_tipo').setAttribute('required', 'required');
        document.getElementById('clase_transporte').setAttribute('required', 'required');
        document.getElementById('tipo_peso').setAttribute('required', 'required');

        document.getElementById('id_usuario').setAttribute('required', 'required');
        document.getElementById('nombre_usuario').setAttribute('required', 'required');
        document.getElementById('canton_usuario').setAttribute('required', 'required');
      }
    }

    // Detectar cambio en el select de tipo_tramite
    tipoTramiteSelect.addEventListener('change', function () {
      validarRequerimientoPlaca();
      validarRequerimientoUsuarioPlaca();
    });

    // Llamar a la función de validación al cargar la página, por si hay un valor preseleccionado
    validarRequerimientoUsuario();
    validarRequerimientoUsuarioPlaca();

    document.getElementById('guardarTramiteRegistroDiario').addEventListener('click', async function (event) {
      event.preventDefault();

      // Validación del formulario
      if (!form.checkValidity()) {
        form.classList.add('was-validated'); // Mostrar mensajes de error de Bootstrap
        return; // No continuar si algún campo esta vacío
      }

      // Obtener valores de los campos del formulario
      const telefono = form.querySelector('input[name="celular_usuario"]').value;
      const nombrePropietario = form.querySelector('input[name="nombre_usuario"]').value;

      // Validación de campos
      let valid = true;
      let errorMessage = '';

      if (telefono.length !== 10) {
        valid = false;
        errorMessage += 'El número de teléfono debe tener exactamente 10 caracteres.\n';
      }

      if (!valid) {
        alert(errorMessage);
        return;
      }

      // Crear el objeto FormData y convertirlo a un objeto JavaScript
      const formData = new FormData(form);
      const formObject = {};
      formData.forEach((value, key) => {
        formObject[key] = value;
      });

      try {
        // Enviar los datos al servidor
        const response = await fetch('/guardar-tramite-turno', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formObject),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Trámite guardado con éxito:', result);
          // Opcional: Redirigir o mostrar un mensaje de éxito
        } else {
          const errorText = await response.text();
          console.error('Error al guardar el trámite:', errorText);
          alert('Error al guardar el trámite: ' + errorText);
        }
      } catch (error) {
        console.error('Error al guardar el trámite:', error);
        alert('Error al guardar el trámite');
      }
    });

  }





});


// 8.- guradar la anulación de una especie
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('anulacionEspecieForm');

  if (!form) return;

  form.addEventListener('submit', function (event) {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add('was-validated');
  }, false);


  document.getElementById('guardarTramiteRegistroDiario').addEventListener('click', async function (event) {
    event.preventDefault();

    // Validación del formulario
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    try {
      // Enviar los datos al servidor
      const response = await fetch('/guardar-especie-anulada', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formObject),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Trámite guardado con éxito:', result);

      } else {
        const errorText = await response.text();
        console.error('Error al guardar el trámite:', errorText);
        alert('Error al guardar el trámite: ' + errorText);
      }
    } catch (error) {
      console.error('Error al guardar el trámite:', error);
      alert('Error al guardar el trámite');
    }
  });
});



// 7.- modificar el estado de recepcion-tramites
document.addEventListener('DOMContentLoaded', function () {
  const switchElement = document.getElementById('recepcion_tramites');

  if (switchElement) {
    switchElement.addEventListener('change', function () {
      const isChecked = switchElement.checked;
      const nuevoEstado = isChecked ? 'HABILITADO' : 'DESHABILITADO';

      // Crear un objeto
      const data = { recepcion_tramites: nuevoEstado };

      // Hacer la solicitud a la ruta
      fetch('/modificar-recepcion-tramites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log('Estado guardado correctamente:', nuevoEstado);
          } else {
            console.error('Error al guardar el estado:', data.message);
          }
        })
        .catch((error) => {
          console.error('Error en la solicitud:', error);
        });
    });
  } else {
    console.error('Elemento switch no encontrado.');
  }
});

// 7.- modificar el estado de recepcion-tramites
document.addEventListener('DOMContentLoaded', function () {
  const switchElement = document.getElementById('recepcion_tramites');

  if (switchElement) {
    switchElement.addEventListener('change', function () {
      const isChecked = switchElement.checked;
      const nuevoEstado = isChecked ? 'HABILITADO' : 'DESHABILITADO';

      // Crear un objeto
      const data = { recepcion_tramites: nuevoEstado };

      // Hacer la solicitud a la ruta
      fetch('/modificar-recepcion-tramites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log('Estado guardado correctamente:', nuevoEstado);
          } else {
            console.error('Error al guardar el estado:', data.message);
          }
        })
        .catch((error) => {
          console.error('Error en la solicitud:', error);
        });
    });
  } else {
    console.error('Elemento switch no encontrado.');
  }
});

// 9.- Creacion de NUEVOS SERVICIOS de acuerdo al tipo de tramite

if (document.getElementById('registroFormAreaInformacion')) {
  document.addEventListener('DOMContentLoaded', function () {
    const tipoTramiteSelect = document.getElementById('tipo_tramite');

    // Selectores de los otros elementos
    const revisionTecnicaSelect = document.querySelector('select[name="revision_tecnica_vehicular_TURNO"]');
    const verificacionImprontasSelect = document.querySelector('select[name="verificacion_improntas_TURNO"]');
    const cambioServicioSelect = document.querySelector('select[name="cambio_servicio_TURNO"]');

    // Definir reglas para la asignación de valores
    const reglasTramites = {
      'CAMBIO DE CARACTERÍSTICAS': {
        verificacion_improntas_TURNO: 'SI',
        revision_tecnica_vehicular_TURNO: 'SI',
        cambio_servicio_TURNO: 'NO'
      },
      'DUPLICADO DE PLACAS': {
        verificacion_improntas_TURNO: 'SI',
        revision_tecnica_vehicular_TURNO: 'NO',
        cambio_servicio_TURNO: 'NO'
      },
      'DUPLICADO DEL DOCUMENTO DE LA MATRICULA Y EMISION DEL DOCUMENTO ANUAL DE CIRCULACION': {
        verificacion_improntas_TURNO: 'NO',
        revision_tecnica_vehicular_TURNO: 'SI',
        cambio_servicio_TURNO: 'NO'
      },
      'EMISION DEL DOCUMENTO ANUAL DE CIRCULACION': {
        verificacion_improntas_TURNO: 'NO',
        revision_tecnica_vehicular_TURNO: 'SI',
        cambio_servicio_TURNO: 'NO'
      },
      'RENOVACION DE MATRICULA Y EMISION DEL DOCUMENTO ANUAL DE CIRCULACION': {
        verificacion_improntas_TURNO: 'NO',
        revision_tecnica_vehicular_TURNO: 'SI',
        cambio_servicio_TURNO: 'NO'
      },
      'TRANSFERENCIA DE DOMINIO': {
        verificacion_improntas_TURNO: 'SI',
        revision_tecnica_vehicular_TURNO: 'NO',
        cambio_servicio_TURNO: 'NO'
      },
      'TRANSFERENCIA DE DOMINIO Y REVISION ANUAL': {
        verificacion_improntas_TURNO: 'SI',
        revision_tecnica_vehicular_TURNO: 'SI',
        cambio_servicio_TURNO: 'NO'
      },
      'PROCESO - REVISIÓN TECNICA VEHICULAR': {
        verificacion_improntas_TURNO: 'NO',
        revision_tecnica_vehicular_TURNO: 'SI',
        cambio_servicio_TURNO: 'NO'
      },
      'PROCESO - VERIFICACIÓN Y EXTRACCIÓN DE IMPRONTAS': {
        verificacion_improntas_TURNO: 'SI',
        revision_tecnica_vehicular_TURNO: 'NO',
        cambio_servicio_TURNO: 'NO'
      },
    };
    // Evento cuando se cambia el select del tipo de trámite

    tipoTramiteSelect.addEventListener('change', function () {
      const tipoSeleccionado = tipoTramiteSelect.value;

      if (tipoSeleccionado.startsWith('CAMBIO DE SERVICIO')) {
        // Aplicar la regla especial para "CAMBIO DE SERVICIO*"
        revisionTecnicaSelect.value = 'SI';
        verificacionImprontasSelect.value = 'SI';
        cambioServicioSelect.value = 'SI';
      } else if (reglasTramites[tipoSeleccionado]) {
        // Aplicar las reglas si el tipo de trámite está en las reglas
        const { revision_tecnica_vehicular_TURNO, verificacion_improntas_TURNO, cambio_servicio_TURNO } = reglasTramites[tipoSeleccionado];
        revisionTecnicaSelect.value = revision_tecnica_vehicular_TURNO || 'NO';
        verificacionImprontasSelect.value = verificacion_improntas_TURNO || 'NO';
        cambioServicioSelect.value = cambio_servicio_TURNO || 'NO';
      } else {
        // Restablecer todos los selects a "NO" si no hay reglas
        revisionTecnicaSelect.value = 'NO';
        verificacionImprontasSelect.value = 'NO';
        cambioServicioSelect.value = 'NO';
      }
    });
  });
}




// 10.- Selects vinculados de la provincia y cantones
document.addEventListener('DOMContentLoaded', () => {
  const provinciaSelect = document.getElementById('provincia_usuario');
  const cantonSelect = document.getElementById('canton_usuario');

  // Datos: Provincias y cantones relacionados
  const data = {
    "Azuay": ["Camilo Ponce Enríquez", "Cuenca", "Déleg", "Girón", "Guachapala", "Gualaceo", "Nabón", "Paute", "Pucará", "San Fernando", "Santa Isabel", "Sevilla de Oro", "Sígsig"],
    "Bolívar": ["Caluma", "Chillanes", "Chimbo", "Echeandía", "Guaranda", "Las Naves"],
    "Cañar": ["Azogues", "Biblián", "Cañar", "Déleg", "El Tambo", "La Troncal", "Suscal"],
    "Carchi": ["Bolívar", "Espejo", "Mira", "Montúfar", "San Pedro de Huaca", "Tulcán"],
    "Chimborazo": ["Alausí", "Chambo", "Chunchi", "Colta", "Cumandá", "Guamote", "Guano", "Pallatanga", "Penipe", "Riobamba"],
    "Cotopaxi": ["La Maná", "Latacunga", "Pangua", "Pujilí", "Salcedo", "Saquisilí", "Sigchos"],
    "El Oro": ["Arenillas", "Atahualpa", "Balsas", "Chilla", "El Guabo", "Huaquillas", "Las Lajas", "Machala", "Marcabelí", "Pasaje", "Piñas", "Portovelo", "Santa Rosa", "Zaruma"],
    "Esmeraldas": ["Atacames", "Eloy Alfaro", "Esmeraldas", "Muisne", "Quinindé", "Rioverde", "San Lorenzo"],
    "Galápagos": ["Isabela", "San Cristóbal", "Santa Cruz"],
    "Guayas": ["Alfredo Baquerizo", "Balao", "Balzar", "Colimes", "Daule", "Durán", "El Empalme", "General Antonio Elizalde", "Guayaquil", "Isidro Ayora", "Lomas de Sargentillo", "Marcelino Maridueña", "Milagro", "Naranjal", "Naranjito", "Nobol", "Palestina", "Pedro Carbo", "Playas", "Salitre", "Samborondón", "Santa Lucía", "Yaguachi"],
    "Imbabura": ["Antonio Ante", "Cotacachi", "Ibarra", "Otavalo", "Pimampiro", "San Miguel de Urcuquí"],
    "Loja": ["Calvas", "Catamayo", "Celica", "Chaguarpamba", "Espíndola", "Gonzanamá", "Loja", "Macará", "Olmedo", "Paltas", "Pindal", "Puyango", "Quilanga", "Saraguro", "Sozoranga", "Zapotillo"],
    "Los Ríos": ["Baba", "Babahoyo", "Buena Fe", "Mocache", "Montalvo", "Palenque", "Puebloviejo", "Quevedo", "Quinsaloma", "Urdaneta", "Valencia", "Ventanas", "Vinces"],
    "Manabí": ["24 de Mayo", "Bolívar", "Chone", "El Carmen", "Flavio Alfaro", "Jama", "Jaramijó", "Jipijapa", "Junín", "Manta", "Montecristi", "Olmedo", "Paján", "Pedernales", "Pichincha", "Portoviejo", "Puerto López", "Rocafuerte", "Santa Ana", "Sucre", "Tosagua"],
    "Morona Santiago": ["Gualaquiza", "Huamboya", "Limón Indanza", "Logroño", "Morona", "Pablo Sexto", "Palora", "Santiago de Méndez", "Sucúa", "Taisha", "Tiwintza"],
    "Napo": ["Arajuno", "Archidona", "Carlos Julio Arosemena Tola", "El Chaco", "Quijos", "Tena"],
    "Orellana": ["Aguarico", "La Joya de los Sachas", "Loreto", "Francisco de Orellana"],
    "Pastaza": ["Arajuno", "Mera", "Pastaza", "Santa Clara"],
    "Pichincha": ["Cayambe", "Mejía", "Pedro Moncayo", "Pedro Vicente Maldonado", "Puerto Quito", "Quito", "Rumiñahui", "San Miguel de los Bancos"],
    "Santa Elena": ["La Libertad", "Salinas", "Santa Elena"],
    "Santo Domingo de los Tsáchilas": ["La Concordia", "Santo Domingo"],
    "Sucumbíos": ["Cascales", "Cuyabeno", "Gonzalo Pizarro", "Lago Agrio", "Putumayo", "Shushufindi", "Sucumbíos"],
    "Tungurahua": ["Ambato", "Baños", "Cevallos", "Mocha", "Patate", "Quero", "San Pedro de Pelileo", "Santiago de Píllaro", "Tisaleo"],
    "Zamora Chinchipe": ["Centinela del Cóndor", "Chinchipe", "El Pangui", "Nangaritza", "Palanda", "Paquisha", "Yacuambi", "Yantzaza", "Zamora"]
  };

  // Función para actualizar los cantones basados en la provincia seleccionada
  function actualizarCantones(provinciaSeleccionada, cantonSeleccionado = '') {
    // Reiniciar el select de cantón
    cantonSelect.innerHTML = '<option value="">Seleccione el cantón</option>';
    cantonSelect.disabled = true;

    if (data[provinciaSeleccionada]) {
      // Agregar las opciones de cantones correspondientes a la provincia seleccionada
      data[provinciaSeleccionada].forEach(canton => {
        const option = document.createElement('option');
        option.value = canton;
        option.textContent = canton;
        cantonSelect.appendChild(option);
      });
      cantonSelect.disabled = false;

      // Si se proporcionó un cantón seleccionado, establecerlo
      if (cantonSeleccionado) {
        cantonSelect.value = cantonSeleccionado;
      }
    }
  }

  // Evento cuando cambia el select de provincias
  provinciaSelect.addEventListener('change', () => {
    const provinciaSeleccionada = provinciaSelect.value;
    actualizarCantones(provinciaSeleccionada); // Actualiza el select de cantones
  });

  // Hacer la función accesible desde otros scripts si es necesario
  window.actualizarCantones = actualizarCantones;
});

// 11.- REASIGNAR un tramite a un usuario
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('reasignarForm');

  document.getElementById('reasignarTramite').addEventListener('click', async function (event) {
    event.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch('/reasignar-tramite', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Trámite guardado con éxito:', result);
        alert('Trámite guardado con éxito');
      } else {
        const errorText = await response.text();
        console.error('Error al guardar el trámite:', errorText);
        alert('Error al guardar el trámite');
      }
    } catch (error) {
      console.error('Error al guardar el trámite:', error);
      alert('Error al guardar el trámite');
    }
  });
});


// 12.- evento que esucha el tipo de tramite para mostrar ALERTAS
if (document.getElementById('registroFormAreaInformacion')) {
  $('#tipo_tramite').on('change', function () {
    var tipoSeleccionado = $(this).val();

    if (tipoSeleccionado === 'ACTUALIZACIÓN DE DATOS DEL VEHÍCULO' ||
      tipoSeleccionado === 'DESBLOQUEO DE VEHÍCULO' ||
      tipoSeleccionado === 'DUPLICADO DE PLACAS' ||
      tipoSeleccionado === 'BLOQUEO DE VEHÍCULO') {

      mostrarAlerta('Verifica si el trámite requiere una asignación manual.', 'warning');

      document.getElementById('nav-alert-Asignacion').classList.remove('d-none');
      document.getElementById('mensaje-AsignacionManual').classList.remove('d-none');
    } else {
      document.getElementById('nav-alert-Asignacion').classList.add('d-none');
      document.getElementById('mensaje-AsignacionManual').classList.add('d-none');
    }
  });
}


// 13.- evento que esucha el tipo de tramite para mostrar ALERTAS

if (document.getElementById('registroFormAreaInformacion')) {
  $('#tipo_tramite').on('change', function () {
    var tipoSeleccionado = $(this).val();

    // Verifica si el tipo de trámite es uno de los listados
    if (tipoSeleccionado === 'CAMBIO DE SERVICIO DE COMERCIAL A PARTICULAR' ||
      tipoSeleccionado === 'CAMBIO DE SERVICIO DE COMERCIAL A PUBLICO' ||
      tipoSeleccionado === 'CAMBIO DE SERVICIO DE COMERCIAL A USO DE CUENTA PROPIA' ||
      tipoSeleccionado === 'CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A COMERCIAL' ||
      tipoSeleccionado === 'CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A PARTICULAR' ||
      tipoSeleccionado === 'CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A PUBLICO' ||
      tipoSeleccionado === 'CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A USO DE CUENTA PROPIA' ||
      tipoSeleccionado === 'CAMBIO DE SERVICIO DE PARTICULAR A COMERCIAL' ||
      tipoSeleccionado === 'CAMBIO DE SERVICIO DE PARTICULAR A ESTATAL U OFICIAL' ||
      tipoSeleccionado === 'CAMBIO DE SERVICIO DE PARTICULAR A PUBLICO' ||
      tipoSeleccionado === 'CAMBIO DE SERVICIO DE PARTICULAR A USO DE CUENTA PROPIA' ||
      tipoSeleccionado === 'CAMBIO DE SERVICIO DE PARTICULAR A USO DIPLOMATICO U ORGANISMOS INTERNACIONALES' ||
      tipoSeleccionado === 'CAMBIO DE SERVICIO DE PUBLICO A COMERCIAL' ||
      tipoSeleccionado === 'CAMBIO DE SERVICIO DE PUBLICO A PARTICULAR' ||
      tipoSeleccionado === 'CAMBIO DE SERVICIO DE PUBLICO A USO DE CUENTA PROPIA' ||
      tipoSeleccionado === 'CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A COMERCIAL' ||
      tipoSeleccionado === 'CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A PARTICULAR' ||
      tipoSeleccionado === 'CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A PUBLICO') {

      mostrarAlerta('Verifica los procesos a realizar en el centro de RTV.', 'warning');

      document.getElementById('nav-alert-proRTV').classList.remove('d-none');
      document.getElementById('mensaje-procesosRTV').classList.remove('d-none');
    } else {

      document.getElementById('nav-alert-proRTV').classList.add('d-none');
      document.getElementById('mensaje-procesosRTV').classList.add('d-none');
    }
  });

}



// 14.- consultar el valor de la matricula
$(document).ready(function () {
  $('#consultarValorMatricula').off('click').on('click', function () {
    const placa = $('input[name="placa"]').val().trim();

    if (placa === '') {
      alert('Por favor, ingrese una placa válida.');
      return;
    }

    $.ajax({
      type: 'POST',
      url: '/consultar-matricula-sri',
      contentType: 'application/json',
      data: JSON.stringify({ placa }),
      success: function (response) {
        if (response.success) {


          $('#consulta_placa').text(response.data.placa);
          $('#consulta_anioUltimoPago').text(response.data.anioUltimoPago);

          $('#consulta_marca').text(response.data.marca);
          $('#consulta_modelo').text(response.data.modelo);
          $('#consulta_anioModelo').text(response.data.anioModelo);
          $('#consulta_paisFabricacion').text(response.data.paisFabricacion);
          $('#consulta_anioUltimoPago').text(response.data.anioUltimoPago);
          $('#informacion').text(response.data.informacion);

          $('#result_placa').text(response.data.placa);
          $('#result_camvCpn').text(response.data.camvCpn);
          $('#result_cilindraje').text(response.data.cilindraje);
          $('#result_marca').text(response.data.marca);
          $('#result_modelo').text(response.data.modelo);
          $('#result_anioModelo').text(response.data.anioModelo);
          $('#result_paisFabricacion').text(response.data.paisFabricacion);
          $('#result_clase').text(response.data.clase);
          $('#result_servicio').text(response.data.servicio);

        } else {
          alert('Vehículo no encontrado');
        }
      },
      error: function (error) {
        console.error('Error al buscar vehículo: ', error);
        alert('Error al buscar vehículo. Por favor, inténtelo de nuevo.');
      }
    });

  });
});


// 15.- evento que esucha el tipo de tramite para mostrar ALERTAS
$('#registroFormAreaInformacion #tipo_tramite').on('change', function () {

  // Reiniciar valores de los campos
  $('#placaVehiculoConsultada').val('');
  $('#placa').val('');
  $('#tipo_peso').val('');
  $('#clase_vehiculo_tipo').val('');
  $('#clase_vehiculo').val('');
  $('#tipo_vehiculo').val('');
  $('#clase_transporte').val('');

  // Desmarcar todos los inputs tipo radio
  $('input[name="tipo_id_usuario"]').prop('checked', false);

  // Limpiar campos de usuario
  $('#id_usuario').val('');
  $('#nombre_usuario').val('');
  $('#provincia_usuario').val('');
  $('#canton_usuario').val('');
  $('#parroquia_usuario').val('');
  $('#direccion_usuario').val('');
  $('#celular_usuario').val('');
  $('#email_usuario').val('');

  // Limpiar
  $('#valor_pago_INFORMACION').val('');
  $('#observaciones_INFORMACION').val('');

  // Limpiar campos de las consultas al SRI
  $('#result_placa').val('');
  $('#result_camvCpn').val('');
  $('#result_cilindraje').val('');
  $('#result_marca').val('');
  $('#result_modelo').val('');
  $('#result_anioModelo').val('');
  $('#result_paisFabricacion').val('');
  $('#result_clase').val('');
  $('#result_servicio').val('');
  $('#result_placa2').text();
  $('#result_camvCpn2').text();
  $('#result_cilindraje2').text();
  $('#result_marca2').text();
  $('#result_modelo2').text();
  $('#result_anioModelo2').text();
  $('#result_paisFabricacion2').text();
  $('#result_clase2').text();
  $('#result_servicio2').text();

  $('#contentAggTurno').addClass('justify-content-center');
  $('#contentConSRI').addClass('d-none');

});


// 16.- modificar el estado de ASIGNACION DE TRAMITES
$(document).ready(function () {
  $('#conf-asignacionTramites').on('click', function () {

    var tipoAsignacion = $('#tipo_ASIGNACION').val();
    var oficinaAsignacion = $('#oficina_ASIGNACION').val();
    var usuarioAsignacion = $('#usuario_ASIGNACION').val();

    $.ajax({
      url: '/conf-AsigTramites',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        tipo_ASIGNACION: tipoAsignacion,
        oficina_ASIGNACION: oficinaAsignacion,
        usuario_ASIGNACION: usuarioAsignacion
      }),
      success: function (response) {

        if (response === 'success') {

          mostrarAlerta('Cambios guardados correctamente.', 'success');

        } else {
          alert('Error al actualizar la asignación.');
        }
      },
      error: function (xhr) {
        alert('Error al realizar la solicitud.');
      }
    });
  });
});

// 17.- modificar el estado de RECEPCION DE TRAMITES
$(document).ready(function () {
  $('#conf-recepcionTramites').on('click', function () {

    var recepcion_tramites = $('#recepcion_tramitesFuncionario').val();

    $.ajax({
      url: '/conf-RecepcionTramites',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ recepcion_tramites }),

      success: function (response) {
        if (response === 'success') {

          mostrarAlerta('Cambios guardados correctamente.', 'success');

        } else {
          alert('Error al actualizar la asignación.');
        }
      },
      error: function (xhr) {
        alert('Error al realizar la solicitud.');
      }
    });
  });
});

// 18.- modificar el numero de acta para el INVENTARIO
$(document).ready(function () {
  $('#conf-numero_acta').on('click', function () {

    var numero_acta = $('#numero_acta').val();

    $.ajax({
      url: '/conf-NumeroActa',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ numero_acta }),

      success: function (response) {
        if (response === 'success') {

          mostrarAlerta('Cambios guardados correctamente.', 'success');

        } else {
          alert('Error al actualizar la asignación.');
        }
      },
      error: function (xhr) {
        alert('Error al realizar la solicitud.');
      }
    });
  });
});

// 19.- modificar el NOMBRE CORTO
$(document).ready(function () {
  $('#conf-nombre_funcionario_corto').on('click', function () {

    var nombre_funcionario_corto = $('#nombre_funcionario_corto').val();

    $.ajax({
      url: '/conf-NombreCorto',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ nombre_funcionario_corto }),

      success: function (response) {
        if (response === 'success') {

          mostrarAlerta('Cambios guardados correctamente.', 'success');

        } else {
          alert('Error al actualizar la asignación.');
        }
      },
      error: function (xhr) {
        alert('Error al realizar la solicitud.');
      }
    });
  });
});


// 18.- guardar una nueva placa al IVENTARIO INSTITUCIONAL (individual)
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('ingresarPlacaInventarioForm');
  if (!form) return;

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const placaInput = form.querySelector('input[name="placa"]');
    const selectInput = form.querySelector('select[name="clase_vehiculo"]');

    // Validación de campos
    let valid = true;
    // Obtener el valor seleccionado en el select
    const tipoVehiculo = selectInput.value.toUpperCase();

    if (tipoVehiculo === 'VEHICULO' && placaInput.value.length !== 7) {
      valid = false;
      mostrarAlerta('El campo placa debe tener 7 caracteres', 'danger');
    } else if (tipoVehiculo === 'MOTOCICLETA' && placaInput.value.length !== 6) {
      valid = false;
      mostrarAlerta('El campo placa debe tener 6 caracteres', 'danger');
    }

    if (!valid) return;

    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    try {
      const response = await fetch('/ingresar-placa-individual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formObject),
      });

      const result = await response.json();
      if (response.ok) {
        window.location.href = result.redirectUrl;
      } else {
        mostrarAlerta(result.message, 'danger');
      }
    } catch (error) {
      console.error('Error al guardar el trámite:', error);
      alert('Error al guardar el trámite');
    }
  });
});

// 19.- guardar una nueva placa al IVENTARIO INSTITUCIONAL (por lotes)
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('ingresarPlacaInventarioFormLOTES');
  const previewCard = document.getElementById('previewPlacasCard');

  if (!form || !previewCard) return;

  let placasGeneradas = [];

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const letrasInicial = form.querySelector('input[name="id_letrasInicial"]').value.toUpperCase();
    const numerosInicial = parseInt(form.querySelector('input[name="id_numeros"]').value);
    const letrasFinal = form.querySelector('input[name="id_letrasFinal"]').value.toUpperCase() || '';
    const cantidadGenerar = parseInt(form.querySelector('input[name="cantidadGenerar"]').value);
    const claseVehiculo = form.querySelector('select[name="clase_vehiculo"]').value;
    const claseTransporte = form.querySelector('select[name="clase_transporte"]').value;
    const cantidad = form.querySelector('input[name="cantidad"]').value;

    const cantidadBottom = form.querySelector('input[name="cantidad"]');
    cantidadBottom.classList.remove('is-valid');
    const ingreso_fechaBottom = form.querySelector('input[name="ingreso_fecha"]');
    ingreso_fechaBottom.classList.remove('is-valid');

    if (isNaN(numerosInicial) || isNaN(cantidadGenerar) || cantidadGenerar <= 0) {
      mostrarAlerta('Por favor complete todos los campos correctamente.', 'danger');
      return;
    }

    placasGeneradas = Array.from({ length: cantidadGenerar }, (_, i) =>
      `${letrasInicial}${(numerosInicial + i).toString().padStart(3, '0')}${letrasFinal}`
    );

    mostrarPlacas(previewCard, placasGeneradas, claseVehiculo, cantidadGenerar, claseTransporte, cantidad);


  });

  function mostrarPlacas(previewCard, placas, claseVehiculo, cantidadGenerar, claseTransporte, cantidad) {
    previewCard.innerHTML = `
              <div class="card">
                <div class="px-4 py-3">
                  <h5 class="text-black fw-semibold text-start">Visualización de ingreso</h5>
                  <hr>
                  <div class="py-0">
                    <div class="row">
                      <div class="row">
                        <div class="">
                          <p><strong class="text-black">Clase de vehículo:</strong> ${claseVehiculo}</p>
                          <p><strong class="text-black">Clase de transporte:</strong> ${claseTransporte}</p>
                          <p><strong class="text-black">Cantidad de placas:</strong> ${cantidad}</p>
                          <p><strong class="text-black">Total a generar:</strong> ${cantidadGenerar}</p>
                          <ul class="list-group">
                            ${placas.map(placa => `<li class="list-group-item">${placa}</li>`).join('')}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row mt-3">
                    <div class="mb-1">
                      <div class="card-body px-0 py-0 d-flex justify-content-end gap-2">
                        <button type=""
                          onclick="window.location.href='/home'" 
                          class="col-lg-4 justify-content-center fw-semibold btn shadow-btn mb-1  btn-rounded btn-secondary align-items-center">Cancelar
                          ingreso
                        </button>
                        <button type="submit"
                          class="col-lg-4 justify-content-center fw-semibold btn shadow-btn  mb-1 btn-rounded btn-primary align-items-center"
                          id="confirmarPlacasBtn">Confirmar
                          ingreso
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
    `;

    previewCard.classList.remove('d-none');

    const confirmButton = document.getElementById('confirmarPlacasBtn');
    confirmButton.addEventListener('click', confirmarPlacas, { once: true });
  }


  async function confirmarPlacas() {
    const formData = {
      id_letrasInicial: form.querySelector('input[name="id_letrasInicial"]').value.toUpperCase(),
      id_numeros: form.querySelector('input[name="id_numeros"]').value,
      id_letrasFinal: form.querySelector('input[name="id_letrasFinal"]').value.toUpperCase() || '',
      cantidadGenerar: form.querySelector('input[name="cantidadGenerar"]').value,
      clase_vehiculo: form.querySelector('select[name="clase_vehiculo"]').value,
      clase_transporte: form.querySelector('select[name="clase_transporte"]').value,
      ubicacion: form.querySelector('input[name="ubicacion"]').value.toUpperCase(),
      cantidad: form.querySelector('input[name="cantidad"]').value,
      ingreso_fecha: form.querySelector('input[name="ingreso_fecha"]').value,

    };

    $('#overlay').addClass('active');

    try {
      const response = await fetch('/ingresar-placa-lotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      $('#overlay').removeClass('active');
      if (response.ok) {
        window.location.href = result.redirectUrl;
      } else {
        mostrarAlerta(result.message, 'danger');
      }


    } catch (error) {
      console.error('Error al guardar las placas:', error);
      mostrarAlerta('Ocurrió un error al guardar las placas.', 'danger');
    }

  }
});





