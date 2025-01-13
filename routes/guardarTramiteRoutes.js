const express = require('express');
const router = express.Router();
const Tramite = require('../models/Tramite');
const Vehiculo = require('../models/Vehiculo');
const Funcionario = require('../models/Funcionario');
const Usuario = require('../models/Usuario');
const CentroMatriculacion = require('../models/CentroMatriculacion');
const { sequelize } = require('sequelize');
const { Op } = require('sequelize');
const { getCurrentDay, getRangeCurrentDay } = require('../utils/dateUtils');
const { updateVehiculo, createVehiculo, createUsuario, actualizarUsuario, createTramite, updateTramite_placa, updateTramite_id_usuario, updateVehiculo_DateSRI } = require('../utils/saveUtils');

router.post('/guardar-tramite-directo', async (req, res) => {
  try {
    const { id_funcionario, username, nombre_funcionario, id_empresa, nombre_empresa, nombre_corto_empresa, estado_empresa, provincia_empresa, canton_empresa, id_centro_matriculacion, nombre_centro_matriculacion, canton_centro_matriculacion } = req.session.user;
    const { placa, tipo_tramite, id_usuario, nombre_usuario, celular_usuario, email_usuario, canton_usuario, clase_vehiculo_tipo, clase_vehiculo, clase_transporte, fecha_ingreso, numero_fojas, numero_adhesivo, numero_matricula } = req.body;

    const solicitud_del_servicio_INFORMACION = ('NO');
    const entrega_informe_certificado_FINALIZACION = ('SI');
    const id_etapa = ('Entrega de informe y certificado');
    const estado_tramite = ('Finalizado');

    let fecha_ultimo_proceso = fecha_ingreso,
      fecha_finalizacion = fecha_ingreso,
      fecha_final_PRESENTACION = fecha_ingreso;

    // Obtener la fecha actual a travez de la funcionalidad utlisDate
    const { currentDay } = getCurrentDay();
    const date_registraton = currentDay;

    // Guardar el nuevo trámite 
    const { id_tramite } = await createTramite({
      placa, tipo_tramite, solicitud_del_servicio_INFORMACION, entrega_informe_certificado_FINALIZACION, id_etapa, estado_tramite, id_usuario, nombre_usuario, celular_usuario, email_usuario, canton_usuario,
      clase_vehiculo_tipo, clase_vehiculo, clase_transporte, numero_fojas, numero_adhesivo, numero_matricula, id_funcionario, username, nombre_funcionario, id_empresa, nombre_empresa, nombre_corto_empresa, estado_empresa, provincia_empresa, canton_empresa, fecha_ingreso,
      fecha_finalizacion, id_centro_matriculacion, nombre_centro_matriculacion, canton_centro_matriculacion, date_registraton, fecha_final_PRESENTACION
    });


    // Verificar si el vehículo ya existe
    if (!placa) {
      console.log('La placa está vacía. Se omite la ejecución del código.');

    } else {
      console.log('La placa tiene un valor:', placa);
       
      console.log('   1 Verificando si el vehículo ya existe... ');
      let vehiculo = await Vehiculo.findOne({ where: { placa } });
      if (vehiculo) {
        await updateVehiculo({
          id_usuario, nombre_usuario, canton_usuario, celular_usuario, email_usuario,
          placa, clase_vehiculo_tipo, clase_vehiculo, clase_transporte, fecha_ultimo_proceso,
          id_funcionario, username, id_centro_matriculacion, id_empresa, nombre_corto_empresa
        });
        await updateTramite_placa({
          id_tramite, placa
        });

      } else {
        await createVehiculo({
          id_usuario, nombre_usuario, canton_usuario, celular_usuario, email_usuario,
          placa, clase_vehiculo_tipo, clase_vehiculo, clase_transporte, fecha_ultimo_proceso,
          id_funcionario, username, id_centro_matriculacion, id_empresa, nombre_corto_empresa
        });
      }
    }




    // Verificar si el usuario ya existe
    console.log('  2 Verificando si el usuario ya existe... ');
    let usuario = await Usuario.findOne({ where: { id_usuario } });
    if (usuario) {
      await actualizarUsuario({
        id_usuario, nombre_usuario, canton_usuario, celular_usuario,
        email_usuario, fecha_ultimo_proceso, id_funcionario, username, id_centro_matriculacion
      });
      await updateTramite_id_usuario({
        id_tramite, id_usuario
      });
    } else {
      await createUsuario({
        id_usuario, nombre_usuario, canton_usuario, celular_usuario,
        email_usuario, fecha_ultimo_proceso, id_funcionario, username, id_centro_matriculacion
      });
    }

    if (["CAMBIO DE SERVICIO DE COMERCIAL A PARTICULAR", "CAMBIO DE SERVICIO DE COMERCIAL A PUBLICO", "CAMBIO DE SERVICIO DE COMERCIAL A USO DE CUENTA PROPIA", "CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A COMERCIAL", "CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A PARTICULAR", "CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A PUBLICO", "CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A USO DE CUENTA PROPIA", "CAMBIO DE SERVICIO DE PARTICULAR A COMERCIAL", "CAMBIO DE SERVICIO DE PARTICULAR A ESTATAL U OFICIAL", "CAMBIO DE SERVICIO DE PARTICULAR A PUBLICO", "CAMBIO DE SERVICIO DE PARTICULAR A USO DE CUENTA PROPIA", "CAMBIO DE SERVICIO DE PARTICULAR A USO DIPLOMATICO U ORGANISMOS INTERNACIONALES", "CAMBIO DE SERVICIO DE PUBLICO A COMERCIAL", "CAMBIO DE SERVICIO DE PUBLICO A PARTICULAR", "CAMBIO DE SERVICIO DE PUBLICO A USO DE CUENTA PROPIA", "CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A COMERCIAL", "CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A PARTICULAR", "CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A PUBLICO", "DUPLICADO DE PLACAS", "EMISION DE MATRICULA POR PRIMERA VEZ"].includes(tipo_tramite)) {
      res.redirect(`/matriculacion/gestion-tramite/registrar-pago-placas?id_tramite=${id_tramite}`);
    } else {
      res.redirect(`/matriculacion/tramite-registrado?id_tramite=${id_tramite}`);
    }

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.error('Error: Registro duplicado en la base de datos', error);
      res.status(400).json({ success: false, message: 'El registro con esta placa ya existe' });
    } else {
      console.error('Error al guardar el trámite en la ruta:', error);
      res.status(500).json({ success: false, message: 'Error al guardar el trámite' });
    }
  }
});

router.post('/guardar-tramite-turno', async (req, res) => {
  try {

    const { id_funcionario, username, nombre_funcionario, id_empresa, nombre_empresa, nombre_corto_empresa, estado_empresa, provincia_empresa, canton_empresa, id_centro_matriculacion, nombre_centro_matriculacion, canton_centro_matriculacion } = req.session.user;
    const { id_tramite, tipo_tramite, id_usuario, nombre_usuario, celular_usuario, email_usuario, canton_usuario, clase_vehiculo_tipo, clase_vehiculo, clase_transporte, fecha_ingreso, numero_fojas, numero_adhesivo, numero_matricula } = req.body;
    let { placa } = req.body;
    const solicitud_del_servicio_INFORMACION = ('SI');
    const entrega_informe_certificado_FINALIZACION = ('SI');
    const id_etapa = ('Entrega de informe y certificado');
    const estado_tramite = ('Finalizado');

    // Convertir la placa a mayúsculas
    let placaMayus = placa.toUpperCase();

    // Obtener la fecha actual a travez de la funcionalidad utlisDate
    const { currentDay } = getCurrentDay();
    const date_registraton = currentDay;

    console.log('ID del trámite a actualizar:', id_tramite);

    let fecha_ultimo_proceso = fecha_ingreso;


    const tramite = await Tramite.findByPk(id_tramite, { where: { id_tramite } });

    if (tramite) {
      tramite.placa = placaMayus;
      tramite.tipo_tramite = tipo_tramite;
      tramite.numero_adhesivo = numero_adhesivo;
      tramite.numero_matricula = numero_matricula;
      tramite.fecha_ingreso = fecha_ingreso;
      tramite.numero_fojas = numero_fojas;
      tramite.clase_transporte = clase_transporte;
      tramite.clase_vehiculo = clase_vehiculo;
      tramite.clase_vehiculo_tipo = clase_vehiculo_tipo;
      tramite.id_usuario = id_usuario;
      tramite.nombre_usuario = nombre_usuario;
      tramite.canton_usuario = canton_usuario;
      tramite.celular_usuario = celular_usuario;
      tramite.email_usuario = email_usuario;
      tramite.solicitud_del_servicio_INFORMACION = solicitud_del_servicio_INFORMACION;
      tramite.entrega_informe_certificado_FINALIZACION = entrega_informe_certificado_FINALIZACION;
      tramite.id_etapa = id_etapa;
      tramite.estado_tramite = estado_tramite;
      tramite.entrega_informe_certificado_FINALIZACION = entrega_informe_certificado_FINALIZACION;
      tramite.id_funcionario = id_funcionario;
      tramite.username = username;
      tramite.nombre_funcionario = nombre_funcionario;
      tramite.id_centro_matriculacion = id_centro_matriculacion;
      tramite.nombre_centro_matriculacion = nombre_centro_matriculacion;
      tramite.canton_centro_matriculacion = canton_centro_matriculacion;
      tramite.id_centro_matriculacion = id_centro_matriculacion;
      tramite.nombre_centro_matriculacion = nombre_centro_matriculacion;
      tramite.fecha_finalizacion = fecha_ingreso;
      tramite.date_registraton = date_registraton;
      tramite.fecha_final_PRESENTACION = fecha_ingreso;
      await tramite.save();
      const id_tramite = tramite.id_tramite;



      placa = placaMayus;

      if (tipo_tramite === 'EMISION DE MATRICULA POR PRIMERA VEZ') {
        let ramw = tramite.ramw;
      
        if (!ramw) {
          console.error("El campo 'ramw' no está definido en el objeto 'tramite'.");
        } else {
          try {
            // Buscar el vehículo por RAMW
            const vehiculo2 = await Vehiculo.findOne({ where: { ramw } });
      
            if (vehiculo2) {
              console.error("--------EMISION DE MATRICULA POR PRIMERA VEZ--------.");
              //console.log(`-----vehiculo2:`, vehiculo2);
              console.log(`-----Vehículo encontrado - RAMW: ${vehiculo2.ramw}, Placa actual: ${vehiculo2.placa}`);
              console.log(`-----Nueva placa a asignar: ${placaMayus}`);
      
              // Verificar si la nueva placa ya existe
              const existePlaca = await Vehiculo.findOne({ where: { placa: placaMayus } });
              if (existePlaca) {
                throw new Error(`La placa "${placaMayus}" ya está en uso.`);
              }
      
              // Actualizar directamente la placa
              await Vehiculo.update(
                { placa: placaMayus },
                { where: { placa: vehiculo2.placa } }
              );

              //console.log(`-----vehiculo2:`, vehiculo2);
      
              console.log(`------Placa actualizada correctamente a: ${placaMayus}`);
              console.log(`-----vehiculo2`, vehiculo2.ramw);
            } else {
              console.warn(`No se encontró un vehículo asociado al RAMW: ${ramw}`);
            }
          } catch (error) {
            console.error("Error al actualizar la placa:", error);
          }
        }
      }
      
      

      console.log('Verificando si el vehículo ya existe');
      let vehiculo = await Vehiculo.findOne({ where: { placa } });
      if (vehiculo) {
        //console.log(`-----vehiculo 1: despues de verificar si exiet`, vehiculo);
        await updateVehiculo({
          id_usuario, nombre_usuario, canton_usuario, celular_usuario, email_usuario,
          placa, clase_vehiculo_tipo, clase_vehiculo, clase_transporte, fecha_ultimo_proceso,
          id_funcionario, username, id_centro_matriculacion, id_empresa, nombre_corto_empresa
        });
        //let vehiculo4 = await Vehiculo.findOne({ where: { placa } });

        //console.log(`-----vehiculo 2: despues de verificar si exiet`, vehiculo4);
        await updateTramite_placa({
          id_tramite, placa
        });

      } else {
        await createVehiculo({
          id_usuario, nombre_usuario, canton_usuario, celular_usuario, email_usuario,
          placa, clase_vehiculo_tipo, clase_vehiculo, clase_transporte, fecha_ultimo_proceso,
          id_funcionario, username, id_centro_matriculacion, id_empresa, nombre_corto_empresa
        });
      }


      console.log('Verificando si el usuario ya existe');
      let usuario = await Usuario.findOne({ where: { id_usuario } });
      if (usuario) {
        await actualizarUsuario({
          id_usuario, nombre_usuario, canton_usuario, celular_usuario,
          email_usuario, fecha_ultimo_proceso, id_funcionario, username, id_centro_matriculacion
        });
        await updateTramite_id_usuario({
          id_tramite, id_usuario
        });
      } else {
        await createUsuario({
          id_usuario, nombre_usuario, canton_usuario, celular_usuario,
          email_usuario, fecha_ultimo_proceso, id_funcionario, username, id_centro_matriculacion
        });
      }

      if (["CAMBIO DE SERVICIO DE COMERCIAL A PARTICULAR", "CAMBIO DE SERVICIO DE COMERCIAL A PUBLICO", "CAMBIO DE SERVICIO DE COMERCIAL A USO DE CUENTA PROPIA", "CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A COMERCIAL", "CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A PARTICULAR", "CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A PUBLICO", "CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A USO DE CUENTA PROPIA", "CAMBIO DE SERVICIO DE PARTICULAR A COMERCIAL", "CAMBIO DE SERVICIO DE PARTICULAR A ESTATAL U OFICIAL", "CAMBIO DE SERVICIO DE PARTICULAR A PUBLICO", "CAMBIO DE SERVICIO DE PARTICULAR A USO DE CUENTA PROPIA", "CAMBIO DE SERVICIO DE PARTICULAR A USO DIPLOMATICO U ORGANISMOS INTERNACIONALES", "CAMBIO DE SERVICIO DE PUBLICO A COMERCIAL", "CAMBIO DE SERVICIO DE PUBLICO A PARTICULAR", "CAMBIO DE SERVICIO DE PUBLICO A USO DE CUENTA PROPIA", "CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A COMERCIAL", "CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A PARTICULAR", "CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A PUBLICO", "DUPLICADO DE PLACAS", "EMISION DE MATRICULA POR PRIMERA VEZ"].includes(tipo_tramite)) {
        res.redirect(`/matriculacion/gestion-tramite/registrar-pago-placas?id_tramite=${id_tramite}`);
      } else {
        res.redirect(`/matriculacion/tramite-registrado?id_tramite=${id_tramite}`);
      }
    }

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.error('Error: Registro duplicado en la base de datos', error);
      res.status(400).json({ success: false, message: 'El registro con esta placa ya existe' });
    } else {
      console.error('Error al guardar el trámite en la ruta:', error);
      res.status(500).json({ success: false, message: 'Error al guardar el trámite' });
    }
  }
});

router.post('/guardar-tramite-informacion', async (req, res) => {
  try {

    const { id_funcionario, username, nombre_funcionario, id_empresa, nombre_empresa, nombre_corto_empresa, estado_empresa, provincia_empresa, canton_empresa, id_centro_matriculacion, nombre_centro_matriculacion, canton_centro_matriculacion } = req.session.user;
    const { tipo_peso, tipo_tramite, id_usuario, tipo_id_usuario, nombre_usuario, celular_usuario, email_usuario, provincia_usuario, canton_usuario, parroquia_usuario, direccion_usuario, clase_vehiculo_tipo, clase_vehiculo, tipo_vehiculo, clase_transporte, observaciones_INFORMACION,
      revision_tecnica_vehicular_TURNO, verificacion_improntas_TURNO, cambio_servicio_TURNO, cambio_color_TURNO, cambio_motor_TURNO, tipo_asignacion, oficina_ASIGNACION, usuario_ASIGNACION } = req.body;
    let { placa, ramw } = req.body;
    let { fecha_turno_RTV } = req.body;

    console.log('PASO 8 revisar este valor: revision_tecnica_vehicular_TURNO', revision_tecnica_vehicular_TURNO);
    console.log('Fecha de turno', fecha_turno_RTV);
    const { result_placa, result_camvCpn, result_cilindraje, result_marca, result_modelo, result_anioModelo, result_paisFabricacion, result_clase, result_servicio } = req.body;

    let { valor_pago_INFORMACION } = req.body;

    valor_pago_INFORMACION = valor_pago_INFORMACION === '' ? null : valor_pago_INFORMACION;

    const solicitud_del_servicio_INFORMACION = 'SI';
    const id_etapa = 'Solicitud del servicio';
    const estado_tramite = 'En proceso';
    const id_funcionario_INFORMACION = id_funcionario;
    const username_funcionario_INFORMACION = username;
    const nombre_funcionario_INFORMACION = nombre_funcionario;

    // Obtener la fecha actual a través de la funcionalidad utilsDate
    const { currentDay } = getCurrentDay();
    const fecha_ingreso_INFORMACION = currentDay;
    const { startOfDay, endOfDay } = getRangeCurrentDay();
    const fecha_final_PRESENTACION = fecha_ingreso_INFORMACION;

    let fecha_ultimo_proceso = fecha_ingreso_INFORMACION;

    if (tipo_tramite === 'EMISION DE MATRICULA POR PRIMERA VEZ') {
      placa = ramw;
    }

    // Buscar el último turno asignado en el día actual para una empresa específica
    const lastCurrentTurner = await Tramite.findOne({
      where: {
        fecha_ingreso_INFORMACION: {
          [Op.between]: [startOfDay, endOfDay]
        },
        id_empresa: id_empresa
      },
      order: [['numero_turno_INFORMACION', 'DESC']]
    });
    const nextTurno = lastCurrentTurner ? lastCurrentTurner.numero_turno_INFORMACION + 1 : 1;

    let asignacion,
      funcionarioAsignado,
      funcionarioDetails;

    if (tipo_tramite === 'PROCESO - VERIFICACIÓN Y EXTRACCIÓN DE IMPRONTAS' || tipo_tramite === 'PROCESO - REVISIÓN TECNICA VEHICULAR') {
      console.log('PASO 6: Validando si el tramite necesita asignacion');

    } else {

      console.log('PASO 7: NECESITA ASIGNACION, validando el tipo de asignacion');

      // Lógica de asignación automática o manual
      if (tipo_asignacion === 'AUTOMÁTICA') {
        const centroMatriculacion = await CentroMatriculacion.findOne({
          where: { id_centro_matriculacion: oficina_ASIGNACION },
          attributes: ['indice_asignacion']
        });

        const indiceAsignacion = centroMatriculacion.indice_asignacion || 0;

        const funcionariosActivosEnOficina = await Funcionario.findAll({
          where: { id_centro_matriculacion: oficina_ASIGNACION, estado_funcionario: 'ACTIVO', recepcion_tramites: 'HABILITADO' },
          attributes: ['id_funcionario', 'nombre_funcionario'],
          order: [['indice_asignacion', 'ASC']]
        });

        if (!funcionariosActivosEnOficina.length) {
          return res.status(400).json({ success: false, message: 'No hay funcionarios habilitados para recibir trámites en la oficina seleccionada.' });
        }

        // Seleccionamos el usuario de acuerdo a l ultimo indice de asignacion
        const indexAsignado = (indiceAsignacion + 1) % funcionariosActivosEnOficina.length;
        funcionarioAsignado = funcionariosActivosEnOficina[indexAsignado];

        // Actualizar el índice de asignación en el centro de matriculación
        await CentroMatriculacion.update({ indice_asignacion: indexAsignado }, { where: { id_centro_matriculacion: oficina_ASIGNACION } });

      } else if (tipo_asignacion === 'MANUAL') {

        const centroMatriculacion = await CentroMatriculacion.findOne({
          where: { id_centro_matriculacion: oficina_ASIGNACION },
          attributes: ['indice_asignacion']
        });

        const indiceAsignacion = centroMatriculacion.indice_asignacion || 0;

        const indexAsignado = (indiceAsignacion + 1);

        // Actualizar el índice de asignación en el centro de matriculación
        await CentroMatriculacion.update({ indice_asignacion: indexAsignado }, { where: { id_centro_matriculacion: oficina_ASIGNACION } });

        funcionarioAsignado = await Funcionario.findOne({
          where: { id_funcionario: usuario_ASIGNACION }
        });

        if (!funcionarioAsignado) {
          return res.status(400).json({ success: false, message: 'No se encontró el funcionario asignado o no está habilitado.' });
        }
      }

      console.log('PASO 8: ASIGNACION REALIZADA, guardando el tramite');

      asignacion = 'SI';

      funcionarioDetails = await Funcionario.findOne({
        where: { id_funcionario: funcionarioAsignado.id_funcionario }
      });
    }

    // Guardar el nuevo trámite con el número de turno
    const { id_tramite, nuevoTramite } = await createTramite({
      placa, ramw, tipo_peso, tipo_tramite, solicitud_del_servicio_INFORMACION, id_etapa, estado_tramite, tipo_id_usuario, id_usuario, nombre_usuario,
      celular_usuario, email_usuario, provincia_usuario, canton_usuario, parroquia_usuario, direccion_usuario,
      clase_vehiculo_tipo, clase_vehiculo, tipo_vehiculo, clase_transporte,
      id_empresa, nombre_empresa, nombre_corto_empresa, estado_empresa, provincia_empresa, canton_empresa,
      valor_pago_INFORMACION, observaciones_INFORMACION, id_funcionario_INFORMACION, username_funcionario_INFORMACION, nombre_funcionario_INFORMACION, fecha_ingreso_INFORMACION,
      id_centro_matriculacion, nombre_centro_matriculacion, canton_centro_matriculacion, fecha_final_PRESENTACION,
      revision_tecnica_vehicular_TURNO, verificacion_improntas_TURNO, cambio_servicio_TURNO, cambio_color_TURNO, cambio_motor_TURNO, numero_turno_INFORMACION: nextTurno,
    });

    const idTramite = id_tramite;

    try {
      if (asignacion === 'SI') {
        console.log('PASO : Ingresando los datos de asignación');

        const [affectedCount, [nuevoTramite]] = await Tramite.update({
          id_funcionario_asignado_INFORMACION: funcionarioAsignado.id_funcionario,
          username_funcionario_asignado_INFORMACION: funcionarioDetails.username,
          nombre_funcionario_asignado_INFORMACION: funcionarioAsignado.nombre_funcionario,
        }, {
          where: { id_tramite: idTramite }, // Asegúrate de que idTramite tenga el ID correcto
          returning: true // Devuelve el objeto actualizado
        });

        if (affectedCount > 0) {
          console.log('Datos de asignación actualizados exitosamente.');
        } else {
          console.log('No se encontraron registros para actualizar.');
        }
      } else {
        console.log('No se ingresan los datos de asignación.');
      }
    } catch (error) {
      console.error('Error en la lógica de asignación:', error);
    }

    // Verificar si el vehículo ya existe
    let vehiculo = await Vehiculo.findOne({ where: { placa } });
    if (vehiculo) {
      await updateVehiculo({
        tipo_peso, tipo_id_usuario, provincia_usuario, parroquia_usuario, direccion_usuario,
        id_usuario, nombre_usuario, canton_usuario, celular_usuario, email_usuario,
        placa, ramw, clase_vehiculo_tipo, tipo_vehiculo, clase_vehiculo, clase_transporte, fecha_ultimo_proceso,
        id_funcionario, username, id_centro_matriculacion, id_empresa, nombre_corto_empresa
      });
      await updateTramite_placa({
        id_tramite, placa
      });
    } else {
      console.log('  Antes de crear el vehiculo... ', ramw);
      await createVehiculo({
        tipo_id_usuario, id_usuario, nombre_usuario, provincia_usuario, canton_usuario, celular_usuario, email_usuario, parroquia_usuario, direccion_usuario,
        placa, ramw, clase_vehiculo_tipo, tipo_vehiculo, clase_vehiculo, clase_transporte, tipo_peso, fecha_ultimo_proceso,
        id_funcionario, username, id_centro_matriculacion, id_empresa, nombre_corto_empresa
      });
    }

    await updateVehiculo_DateSRI({
      placa, result_placa, result_camvCpn, result_cilindraje, result_marca, result_modelo, result_anioModelo, result_paisFabricacion, result_clase, result_servicio
    });


    console.log('  2 Verificando si el usuario ya existe... ');
    let usuario = await Usuario.findOne({ where: { id_usuario } });
    if (usuario) {
      await actualizarUsuario({
        id_usuario, tipo_id_usuario, nombre_usuario, provincia_usuario, canton_usuario, parroquia_usuario, direccion_usuario, celular_usuario,
        email_usuario, fecha_ultimo_proceso, id_funcionario, username, id_centro_matriculacion
      });
      await updateTramite_id_usuario({
        id_tramite, id_usuario
      });
    } else {
      await createUsuario({
        tipo_id_usuario, id_usuario, nombre_usuario, provincia_usuario, canton_usuario, parroquia_usuario, direccion_usuario, celular_usuario,
        email_usuario, fecha_ultimo_proceso, id_funcionario, username, id_centro_matriculacion
      });
    }

    res.redirect(`/matriculacion/informacion/turno-agregado?id_tramite=${idTramite}`);

  }

  catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ success: false, message: 'El registro con esta placa ya existe' });
    } else {
      console.error('Error al guardar el trámite:', error);
      res.status(500).json({ success: false, message: 'Error al guardar el trámite' });
    }
  }


});

router.post('/guardar-especie-anulada', async (req, res) => {
  try {
    const { id_funcionario, username, nombre_funcionario, id_empresa, nombre_empresa, nombre_corto_empresa, estado_empresa, provincia_empresa, canton_empresa, id_centro_matriculacion, nombre_centro_matriculacion, canton_centro_matriculacion } = req.session.user;
    const { tipo_tramite, fecha_ingreso, numero_fojas, numero_adhesivo, numero_matricula, motivo_especie_anulada } = req.body;

    const solicitud_del_servicio_INFORMACION = ('NO');
    const entrega_informe_certificado_FINALIZACION = ('NO');
    const id_etapa = ('Anulación de especie');
    const estado_tramite = ('Finalizado');

    let fecha_ultimo_proceso = fecha_ingreso,
      fecha_finalizacion = fecha_ingreso,
      fecha_final_PRESENTACION = fecha_ingreso;

    // Obtener la fecha actual a travez de la funcionalidad utlisDate
    const { currentDay } = getCurrentDay();
    const date_registraton = currentDay;

    // Guardar el nuevo trámite 
    const { id_tramite } = await createTramite({
      tipo_tramite, solicitud_del_servicio_INFORMACION, entrega_informe_certificado_FINALIZACION, id_etapa, estado_tramite, numero_fojas, numero_adhesivo, numero_matricula, id_funcionario, username, nombre_funcionario, id_empresa, nombre_empresa, nombre_corto_empresa, estado_empresa, provincia_empresa, canton_empresa, fecha_ingreso,
      fecha_finalizacion, id_centro_matriculacion, nombre_centro_matriculacion, canton_centro_matriculacion, date_registraton, fecha_final_PRESENTACION, motivo_especie_anulada
    });

    res.redirect(`/matriculacion/especie-anulada?id_tramite=${id_tramite}`);


  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.error('Error: Registro duplicado en la base de datos', error);
      res.status(400).json({ success: false, message: 'El registro con esta placa ya existe' });
    } else {
      console.error('Error al guardar el trámite en la ruta:', error);
      res.status(500).json({ success: false, message: 'Error al guardar el trámite' });
    }
  }
});


module.exports = router;
