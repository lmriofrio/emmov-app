const express = require('express');
const router = express.Router();
const Tramite = require('../models/Tramite');
const Funcionario = require('../models/Funcionario');

router.post('/estado-eliminar-tramite', async (req, res) => {
  try {
    const { id_funcionario, nombre_funcionario, username } = req.session.user;
    const { eliminar_id_tramite, observaciones_ELIMINACION } = req.body;

    const estado_tramite = 'Eliminado';

    const tramite = await Tramite.findByPk(eliminar_id_tramite);

    await tramite.update({
      estado_tramite: estado_tramite,
      observaciones_ELIMINACION: observaciones_ELIMINACION,
      id_funcionario_ELIMINACION: id_funcionario,
      nombre_funcionario_ELIMINACION: nombre_funcionario,
      username_funcionario_ELIMINACION: username
    });

    res.redirect(`/matriculacion/informacion/vista-turnos`);

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


router.post('/eliminar-tramite', async (req, res) => {

  try {
    const { id_tramite } = req.body;

    console.log('ID del trámite a eliminar:', id_tramite);

    console.log('Buscando el trámite por ID:', id_tramite);
    const tramite = await Tramite.findByPk(id_tramite);

    if (tramite) {
      console.log('Trámite encontrado. Eliminando...');
      await tramite.destroy();

      console.log('Trámite eliminado');

      res.render('home', { userData: req.session.user,permisos: req.session.permisos});
    } else {
      console.log('Trámite no encontrado');
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error al eliminar el trámite:', error);
    res.status(500).send('Error al eliminar el trámite');
  }
});


router.post('/act-tramite', async (req, res) => {
  try {
    const { id_tramite, tipo_tramite, numero_adhesivo, numero_matricula, fecha_ingreso, numero_fojas, placa, clase_transporte, clase_vehiculo, id_usuario,
      nombre_usuario, canton_usuario, celular_usuario, email_usuario, pago_placas_entidad_bancaria, id_tramite_axis, pago_placas_comprobante, pago_placas_newservicio,
      pago_placas_valor, pago_placas_fecha, username, nombre_corto_empresa, fecha_finalizacion } = req.body;
    let { tipo_id_usuario, telefono_usuario, provincia_usuario, parroquia_usuario, direccion_usuario } = req.body;

    //console.log('ID del trámite a actualizar:', id_tramite);
    //console.log('Valores recibidos para actualizar:', {
     // tipo_tramite, numero_adhesivo, numero_matricula, fecha_ingreso, numero_fojas, placa, clase_transporte, clase_vehiculo, id_usuario, nombre_usuario, canton_usuario,
      //celular_usuario, email_usuario, pago_placas_entidad_bancaria, id_tramite_axis, pago_placas_comprobante, pago_placas_newservicio, pago_placas_valor, pago_placas_fecha,
      //username, nombre_corto_empresa, tipo_id_usuario, telefono_usuario, provincia_usuario, parroquia_usuario, direccion_usuario
    //});

    const tramite = await Tramite.findOne({ where: { id_tramite } });

    if (tramite) {

      console.log('Trámite encontrado. Actualizando campos...');
      tramite.tipo_tramite = tipo_tramite;
      tramite.numero_adhesivo = numero_adhesivo;
      tramite.numero_matricula = numero_matricula;
      tramite.fecha_ingreso = fecha_ingreso;
      tramite.fecha_finalizacion = fecha_finalizacion;
      tramite.numero_fojas = numero_fojas;
      tramite.placa = placa;
      tramite.clase_transporte = clase_transporte;
      tramite.clase_vehiculo = clase_vehiculo;
      tramite.id_usuario = id_usuario;
      tramite.nombre_usuario = nombre_usuario;
      tramite.canton_usuario = canton_usuario;
      tramite.celular_usuario = celular_usuario;
      tramite.email_usuario = email_usuario;
      tramite.pago_placas_entidad_bancaria = pago_placas_entidad_bancaria;
      tramite.id_tramite_axis = id_tramite_axis;
      tramite.pago_placas_comprobante = pago_placas_comprobante;
      tramite.pago_placas_newservicio = pago_placas_newservicio;
      tramite.pago_placas_valor = pago_placas_valor;
      tramite.pago_placas_fecha = pago_placas_fecha;
      tramite.fecha_final_PRESENTACION = fecha_ingreso;

      tramite.tipo_id_usuario = tipo_id_usuario;
      tramite.telefono_usuario = telefono_usuario;
      tramite.provincia_usuario = provincia_usuario;
      tramite.direccion_usuario = direccion_usuario;

      if (!pago_placas_valor || isNaN(pago_placas_valor)) {
        tramite.pago_placas_valor = 0;
      } else {
        tramite.pago_placas_valor = parseFloat(pago_placas_valor);
      }
      if (pago_placas_fecha && pago_placas_fecha !== 'Invalid date') {
        tramite.pago_placas_fecha = pago_placas_fecha;
      } else {
        tramite.pago_placas_fecha = null;
      }

      tramite.pago_placas_valor = pago_placas_valor;

      await tramite.save();

      res.redirect(`/matriculacion/tramite-registrado?id_tramite=${id_tramite}`);

    } else {
      console.log('Trámite no encontrado');
      res.redirect('/error-tramite-no-encontrado');
    }
  } catch (error) {
    console.error('Error al actualizar el trámite:', error);
    res.status(500).send('Error al actualizar el trámite');
  }
});


router.post('/registar-pago-placas', async (req, res) => {
  try {
    const { id_tramite, id_tramite_axis, pago_placas_entidad_bancaria, pago_placas_comprobante, pago_placas_fecha, pago_placas_newservicio } = req.body;
    let { pago_placas_valor } = req.body;

    console.log('/error-tramite-no-encontrado',pago_placas_valor );

    const entidad_bancaria_Mayus = pago_placas_entidad_bancaria.toUpperCase();

    const tramite = await Tramite.findOne({ where: { id_tramite } });

    if (!tramite) {
      return res.redirect('/error-tramite-no-encontrado');
    }

    tramite.id_tramite_axis = id_tramite_axis;
    tramite.pago_placas_entidad_bancaria = entidad_bancaria_Mayus;
    tramite.pago_placas_comprobante = pago_placas_comprobante;
    tramite.pago_placas_newservicio = pago_placas_newservicio;
    tramite.pago_placas_valor = !pago_placas_valor || isNaN(pago_placas_valor) ? 0 : parseFloat(pago_placas_valor);
    tramite.pago_placas_fecha = pago_placas_fecha && pago_placas_fecha !== 'Invalid date' ? pago_placas_fecha : null;

    await tramite.save();

    console.log('/error-tramite-no-encontrado',tramite.pago_placas_valor);

    res.redirect(`/matriculacion/tramite-registrado?id_tramite=${id_tramite}`);
  } catch (error) {
    console.error('Error al actualizar el trámite:', error);
    res.status(500).send('Error al actualizar el trámite');
  }
});


router.post('/reasignar-tramite', async (req, res) => {
  try {
    const { reasignar_id_tramite, nombre_funcionario_asignado_INFORMACION } = req.body;

    const id_tramite = reasignar_id_tramite;
    const idFuncionario = nombre_funcionario_asignado_INFORMACION;

    const funcionario = await Funcionario.findOne({
      where: { id_funcionario: idFuncionario },
      attributes: ['nombre_funcionario', 'username', 'id_funcionario']
    });

    const tramite = await Tramite.findByPk(id_tramite);

    console.log('Intentando reasignar trámite');

    await tramite.update({
      id_funcionario_asignado_INFORMACION: funcionario.id_funcionario,
      username_funcionario_asignado_INFORMACION: funcionario.username,
      nombre_funcionario_asignado_INFORMACION: funcionario.nombre_funcionario
    });

    res.redirect(`/matriculacion/informacion/turno-agregado?id_tramite=${id_tramite}`);

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
