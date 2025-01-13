const express = require('express');
const router = express.Router();
const { Op, Sequelize } = require('sequelize');
const InventarioPlacas = require('../models/InventarioPlacas');
const Funcionario = require('../models/Funcionario');
const Usuario = require('../models/Usuario');
const { getChangeDay } = require('../utils/dateUtils');
const { createUsuario, actualizarUsuario, updateTramite_id_usuario } = require('../utils/saveUtils');

router.post('/ingresar-placa-individual', async (req, res) => {
  try {
    const { id_funcionario, username, nombre_funcionario, id_empresa, nombre_corto_empresa, nombre_puesto_funcionario } = req.session.user;
    const { clase_vehiculo, clase_transporte, cantidad } = req.body;
    let { placa, ubicacion, ingreso_fecha } = req.body;

    placa = placa.toUpperCase();
    ubicacion = ubicacion.toUpperCase();

    let { ChangeDay } = getChangeDay(ingreso_fecha);
    ingreso_fecha = ChangeDay;

    const ingreso_id_funcionario = id_funcionario;
    const ingreso_funcionario = nombre_funcionario;
    const ingreso_nombre_puesto_funcionario = nombre_puesto_funcionario;
    const ingreso_username = username;

    const estado = 'POR ENTREGAR';

    const ingreso_id_empresa = id_empresa;
    const ingreso_nombre_corto_empresa = nombre_corto_empresa;

    const nuevaPlaca = await InventarioPlacas.create({
      placa, clase_vehiculo, clase_transporte, ubicacion, ingreso_id_funcionario, ingreso_funcionario, ingreso_nombre_puesto_funcionario,
      ingreso_username, ingreso_fecha, ingreso_id_empresa, ingreso_nombre_corto_empresa, estado, cantidad
    });

    res.status(200).json({
      success: true,
      message: 'Placa ingresada con éxito',
      redirectUrl: `/inventario-placas/placa-ingresada-unidad?id_inventario=${nuevaPlaca.id_inventario}`
    });


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

router.post('/ingresar-placa-lotes', async (req, res) => {
  try {
    const { id_letrasInicial, id_numeros, id_letrasFinal = '', cantidadGenerar, cantidad, clase_vehiculo, clase_transporte, } = req.body;
    const { id_funcionario, username, nombre_funcionario, id_empresa, nombre_corto_empresa, nombre_puesto_funcionario } = req.session.user;
    let { ubicacion, ingreso_fecha } = req.body;

    console.log(req.body);

    const numeroInicial = parseInt(id_numeros);
    if (isNaN(numeroInicial) || cantidadGenerar <= 0) {
      return res.status(400).json({ success: false, message: 'Datos inválidos: Verifique los campos' });
    }

    const ingreso_id_funcionario = id_funcionario;
    const ingreso_funcionario = nombre_funcionario;
    const ingreso_nombre_puesto_funcionario = nombre_puesto_funcionario;
    const ingreso_username = username;

    let { ChangeDay } = getChangeDay(ingreso_fecha);
    ingreso_fecha = ChangeDay;

    const prefijoInicial = id_letrasInicial.toUpperCase();
    const sufijoFinal = id_letrasFinal.toUpperCase();
    const placasPorLote = Array.from({ length: cantidadGenerar }, (_, i) =>
      `${prefijoInicial}${(numeroInicial + i).toString().padStart(3, '0')}${sufijoFinal}`
    );

    const primeraPlaca = placasPorLote[0];
    const ultimaPlaca = placasPorLote[placasPorLote.length - 1];

    const placasGeneradas = `${primeraPlaca} hasta la placa ${ultimaPlaca}`;

    const ingreso_id_empresa = id_empresa;
    const ingreso_nombre_corto_empresa = nombre_corto_empresa;



    await Promise.all(placasPorLote.map(placa =>
      InventarioPlacas.create({
        placa,
        clase_vehiculo,
        clase_transporte,
        ubicacion: ubicacion.toUpperCase(),
        ingreso_fecha,
        cantidad,
        estado: 'POR ENTREGAR',
        ingreso_id_funcionario,
        ingreso_funcionario,
        ingreso_nombre_puesto_funcionario,
        ingreso_username,
        ingreso_id_empresa,
        ingreso_nombre_corto_empresa
      })
    ));

    res.status(200).json({
      success: true,
      message: 'Placas ingresadas con éxito',
      redirectUrl: `/inventario-placas/placa-ingresada-lotes?clase_vehiculo=${clase_vehiculo}&clase_transporte=${clase_transporte}&ubicacion=${ubicacion}&nombre_corto_empresa=${nombre_corto_empresa}&ingreso_username=${ingreso_username}&ingreso_fecha=${ingreso_fecha}&cantidad=${cantidad}&cantidadGenerar=${cantidadGenerar}&placasGeneradas=${placasGeneradas}`,
    });



  } catch (error) {
    console.error('Error al guardar las placas en lotes:', error);
    res.status(500).json({ success: false, message: 'Error al guardar las placas' });
  }
});




router.post('/buscar-placa-inventario', async (req, res) => {
  const { placa } = req.body;

  console.log('Placa recibida:', placa);

  try {
    const placaInventario = await InventarioPlacas.findAll({ where: { placa } });

    if (placaInventario && placaInventario.length > 0) {
      res.json({ success: true, placaInventario });

    } else {
      res.json({ success: false, message: 'Placa no encontrada' });
    }
  } catch (error) {
    console.error('Error al consultar en la ruta:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});



router.post('/entregar-placa-inventario', async (req, res) => {
  const { id_funcionario, nombre_funcionario, nombre_puesto_funcionario, username, id_centro_matriculacion } = req.session.user;
  const { id_inventario, solicitante_tipo } = req.body;
  let { salida_fecha, id_usuario, nombre_usuario, salida_observacion, salida_acta } = req.body;

  let solicitante_id = id_usuario;
  let solicitante_nombre = nombre_usuario;

  solicitante_id = solicitante_id.toUpperCase();
  solicitante_nombre = solicitante_nombre.toUpperCase();
  salida_observacion = salida_observacion.toUpperCase();

  const estado = 'ENTREGADO';
  const salida_tipo_entrega = 'ENTREGA INDIVIDUAL';
  const salida_id_funcionario = id_funcionario;
  const salida_nombre_puesto_funcionario = nombre_puesto_funcionario;
  const salida_funcionario = nombre_funcionario;
  const salida_username_funcionario = username;

  let { ChangeDay } = getChangeDay(salida_fecha);
  salida_fecha = ChangeDay;

  try {
    const placaInventario = await InventarioPlacas.findOne({ where: { id_inventario } });

    await placaInventario.update({
      solicitante_tipo, solicitante_id, solicitante_nombre, salida_observacion, estado, salida_fecha, salida_id_funcionario,
      salida_funcionario, salida_nombre_puesto_funcionario,
      salida_username_funcionario, salida_fecha, salida_acta, salida_tipo_entrega
    });

    let numero_acta = salida_acta;
    const funcionario = await Funcionario.findOne({ where: { id_funcionario } });

    await funcionario.update({
      numero_acta
    });


    let fecha_ultimo_proceso = salida_fecha;

    console.log('  2 Verificando si el usuario ya existe... ');
    let usuario = await Usuario.findOne({ where: { id_usuario } });
    if (usuario) {
      await actualizarUsuario({
        id_usuario, nombre_usuario, fecha_ultimo_proceso, id_funcionario, username, id_centro_matriculacion
      });
    } else {
      await createUsuario({
        id_usuario, nombre_usuario, fecha_ultimo_proceso, id_funcionario, username, id_centro_matriculacion
      });
    }

    salida_fecha = `${salida_fecha}:00`;;

    res.redirect(`/inventario-placas/entrega-placas/placa-entregada?salida_id_funcionario=${salida_id_funcionario}&salida_fecha=${salida_fecha}&salida_tipo_entrega=${salida_tipo_entrega}&solicitante_id=${solicitante_id}&salida_nombre_puesto_funcionario=${salida_nombre_puesto_funcionario}&salida_acta=${salida_acta}`);

  } catch (error) {
    console.error('Error al buscar vehículo en la ruta:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

router.post('/entregar-placa-grupal', async (req, res) => {
  const { id_funcionario, nombre_funcionario, nombre_puesto_funcionario, username, id_centro_matriculacion } = req.session.user;
  const { id_inventario, solicitante_tipo } = req.body;
  let { salida_fecha, id_usuario, nombre_usuario, salida_observacion, salida_acta } = req.body;

  const inventarios = Array.isArray(id_inventario) ? id_inventario : (id_inventario ? [id_inventario] : []);

  id_usuario = id_usuario ? id_usuario.toUpperCase() : '';
  nombre_usuario = nombre_usuario ? nombre_usuario.toUpperCase() : '';
  salida_observacion = salida_observacion ? salida_observacion.toUpperCase() : '';

  const estado = 'ENTREGADO';
  const salida_tipo_entrega = 'ENTREGA GRUPAL';
  const salida_id_funcionario = id_funcionario;
  const salida_nombre_puesto_funcionario = nombre_puesto_funcionario;
  const salida_funcionario = nombre_funcionario;
  const salida_username_funcionario = username;
  let solicitante_id = id_usuario;

  let { ChangeDay } = getChangeDay(salida_fecha);
  salida_fecha = ChangeDay;

  try {

    for (const id of inventarios) {
      const placaInventario = await InventarioPlacas.findOne({ where: { id_inventario: id } });

      if (!placaInventario) {
        throw new Error(`Placa con id_inventario ${id} no encontrada.`);
      }

      await placaInventario.update({
        solicitante_tipo, solicitante_id, solicitante_nombre: nombre_usuario, salida_observacion, estado, salida_fecha,
        salida_id_funcionario, salida_funcionario, salida_nombre_puesto_funcionario, salida_username_funcionario,
        salida_acta, salida_tipo_entrega
      });

      const funcionario = await Funcionario.findOne({ where: { id_funcionario } });

      if (funcionario) {
        await funcionario.update({ numero_acta: salida_acta });
      }

      let fecha_ultimo_proceso = salida_fecha;

      let usuario = await Usuario.findOne({ where: { id_usuario } });
      if (usuario) {
        await actualizarUsuario({ id_usuario, nombre_usuario, fecha_ultimo_proceso, id_funcionario, username, id_centro_matriculacion });
      } else {
        await createUsuario({ id_usuario, nombre_usuario, fecha_ultimo_proceso, id_funcionario, username, id_centro_matriculacion });
      }

    }

    salida_fecha = `${salida_fecha}:00`;;

    res.redirect(`/inventario-placas/entrega-placas/placa-entregada?salida_id_funcionario=${salida_id_funcionario}&salida_fecha=${salida_fecha}&salida_tipo_entrega=${salida_tipo_entrega}&solicitante_id=${solicitante_id}&salida_nombre_puesto_funcionario=${salida_nombre_puesto_funcionario}&salida_acta=${salida_acta}`);

   
  } catch (error) {
    console.error('Error al entregar placas grupales:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});





module.exports = router;
