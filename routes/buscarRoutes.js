const express = require('express');
const router = express.Router();
const Tramite = require('../models/Tramite');
const Usuario = require('../models/Usuario');
const Vehiculo = require('../models/Vehiculo');
const InventarioPlacas = require('../models/InventarioPlacas');
const FuncionarioTTHH = require('../models/FuncionarioTTHH');
const FaltaAsistenciasTTHH = require('../models/FaltaAsistenciasTTHH');
const TurnoBasico = require('../models/TurnoBasico');
const axios = require('axios');
const { Op } = require('sequelize');
const { getCurrentDay, getRangeCurrentDay } = require('../utils/dateUtils');

router.get('/buscar-tramite', async (req, res) => {
    const { placa } = req.query;

    console.log('----  ROUTER:   Buscar tramite:', placa);

    try {
        const tramites = await Tramite.findAll({
            where: { placa },
            order: [['fecha_ingreso', 'ASC']],
        });

        if (tramites.length > 0) {
            res.json({ success: true, tramites });
        } else {
            res.json({ success: false, message: 'Trámites no encontrados' });
        }
    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

router.get('/buscar-tramite-filtro', async (req, res) => {

    const { placa } = req.query;

    const usernameSesion = req.session.user.username;

    console.log('----  ROUTER:   Buscar tramite filtro:', placa);

    try {
        const tramites = await Tramite.findAll({
            where: {
                placa,
                estado_tramite: { [Op.or]: ['En proceso', 'Finalizado'] },
            },
            order: [['fecha_final_PRESENTACION', 'DESC']]
        });

        if (tramites.length > 0) {
            res.json({ success: true, tramites, usernameSesion });
        } else {
            res.json({ success: false, message: 'Trámites no encontrados' });
        }
    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

router.get('/buscar-tramite-filtro-seleccionado', async (req, res) => {

    const { tipoIdBusqueda, filtro } = req.query;

    console.log('----  ROUTER:   Buscar tramite filtro seleccionado:', tipoIdBusqueda, filtro);

    if (tipoIdBusqueda === 'PLACA') {

        const tramites = await Tramite.findAll({
            where: {
                placa: filtro,
            },
            order: [['fecha_final_PRESENTACION', 'DESC']]
        });

        res.json({ success: true, tramites });

    } else if (tipoIdBusqueda === 'USUARIO') {

        const tramites = await Tramite.findAll({
            where: {
                id_funcionario: filtro,
            },
            order: [['fecha_final_PRESENTACION', 'DESC']]
        });

        res.json({ success: true, tramites });

    } else if (tipoIdBusqueda === 'CÉDULA') {

        const tramites = await Tramite.findAll({
            where: {
                id_usuario: filtro,
            },
            order: [['fecha_final_PRESENTACION', 'DESC']]
        });

        res.json({ success: true, tramites });

    } else {
        res.status(400).json({ message: 'Filtro no válido' });
    }

});

router.get('/buscar-tramite-id', async (req, res) => {
    const { idTramite } = req.query;

    console.log('----  ROUTER:   Buscar tramite id:', idTramite);

    try {
        const tramite = await Tramite.findByPk(idTramite);

        if (tramite !== null) {
            res.json({ success: true, tramite });
        } else {
            res.json({ success: false, message: 'Trámite no encontrado' });
        }
    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

router.get('/buscar-tramite-filtro-opt', async (req, res) => {

    const { placa } = req.query;

    const usernameSesion = req.session.user.username;

    console.log('----  ROUTER:   Buscar tramite filtro opt:', placa);

    try {
        const tramites = await Tramite.findAll({
            attributes: [
                'id_tramite',
                'fecha_final_PRESENTACION',
                'placa',
                'tipo_tramite',
                'id_usuario',
                'nombre_usuario',
                'estado_tramite',
                'username',
                'username_funcionario_asignado_INFORMACION',
                'id_documento_informacion'],
            where: {
                placa,
                estado_tramite: { [Op.or]: ['En proceso', 'Finalizado'] },
            },
            order: [['fecha_final_PRESENTACION', 'DESC']]
        });

        if (tramites.length > 0) {
            res.json({ success: true, tramites, usernameSesion });
        } else {
            res.json({ success: false, message: 'Trámites no encontrados' });
        }
    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

////////////////////////////////////
///// ==      USUARIO    ==     ////
////////////////////////////////////

router.post('/buscar-usuario', async (req, res) => {
    const { id_usuario } = req.body;

    console.log('----  ROUTER:   Buscar usuario:', id_usuario);

    try {
        const usuario = await Usuario.findOne({ where: { id_usuario } });

        if (usuario) {
            res.json({ success: true, usuario });
        } else {
            res.json({ success: false, message: 'usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al buscar el usuario:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});


////////////////////////////////////
///// ==      VEHICULO    ==    ////
////////////////////////////////////



router.post('/buscar-vehiculo', async (req, res) => {
    const { placa } = req.body;

    console.log('----  ROUTER:   Buscar vehiculo:', placa);

    try {
        const vehiculo = await Vehiculo.findOne({ where: { placa } });

        if (vehiculo) {
            console.log('                Vehiculo encontrado en /buscar-vehiculo:', vehiculo.placa);
            //console.log('Placa recibida:', vehiculo);
            res.json({ success: true, vehiculo });
        } else {
            console.log('Vehiculo no encontrado:');
            res.json({ success: false, message: 'Vehículo no encontrado' });
        }
    } catch (error) {
        console.error('Error al buscar vehículo en la ruta:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});


router.post('/buscar-vehiculo-sri', async (req, res) => {
    const { id_vehiculo } = req.body;

    console.log('----  ROUTER:   Buscar vehiculo SRI:', id_vehiculo);
    console.log('                Placa que se va a enviar hacia el SRI:', id_vehiculo);

    try {

        const response = await axios.get(`https://srienlinea.sri.gob.ec/movil-servicios/api/v1.0/matriculacion/valor/${id_vehiculo}`);

        const vehiculo = response.data;
        //console.log('Datos recibidos:', vehiculo);

        if (vehiculo) {
            return res.json({ success: true, data: vehiculo });
        } else {

            return res.json({ success: false, message: 'Vehículo no encontrado' });

        }
    } catch (error) {

        if (error.response && error.response.status === 404) {
            return res.json({ success: false, message: 'Vehículo no encontrado en SRI' });
        }

        if (error.response && error.response.status === 503) {
            return res.status(503).json({ success: false, message: 'Servicio del SRI no disponible' });
        }

        console.error('Error al consultar la API del SRI:', error.message);
        return res.status(500).json({ success: false, message: 'Error en la consulta.', error: error.message });
    }
});

////////////////////////////////////
///// ==      PLACA EN EL INVENTARIO   ==    ////
////////////////////////////////////

router.get('/buscar-placa-id_inventario', async (req, res) => {
    const { id_inventario } = req.query;

    console.log('----  ROUTER:   Buscar placa ID INVENTARIO:', id_inventario);

    try {
        const placaInventario = await InventarioPlacas.findOne({ where: { id_inventario } });

        if (placaInventario) {
            res.json({ success: true, placaInventario });
        } else {
            res.json({ success: false, message: 'Trámite no encontrado' });
        }
    } catch (error) {
        console.error('Error al buscar trámite:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});


////////////////////////////////////
///// ==      Funcionario TTHH   ==    ////
////////////////////////////////////

router.get('/buscar-funcionario-TTHH', async (req, res) => {
    const { idFuncionario } = req.query;

    console.log('----  ROUTER:   Buscar funcionario TTHH:', idFuncionario);

    try {
        const funcionarioTTHH = await FuncionarioTTHH.findByPk(idFuncionario);

        if (funcionarioTTHH !== null) {
            //console.log('nombre_funcionario', funcionarioTTHH)
            res.json({ success: true, funcionarioTTHH });
        } else {
            res.json({ success: false, message: 'Funcionario no encontrado' });
        }
    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

router.get('/buscar-falta-asistencia', async (req, res) => {
    const { id_registro } = req.query;

    console.log('----  ROUTER:   Buscar falta asistencia:', id_registro);

    try {
        const faltaAsistenciasTTHH = await FaltaAsistenciasTTHH.findByPk(id_registro);

        if (faltaAsistenciasTTHH !== null) {
            //console.log('nombre_funcionario', faltaAsistenciasTTHH)
            res.json({ success: true, faltaAsistenciasTTHH });
        } else {
            res.json({ success: false, message: 'Funcionario no encontrado' });
        }
    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

//////////////////////////////////////////
///// ==      TRAMITES DE RTV   ==    ////
//////////////////////////////////////////

router.get('/buscar-tramite-rtv', async (req, res) => {
    const { placa } = req.query;

    console.log('----  ROUTER:   Buscar tramite RTV:', placa);

    try {
        const tramites = await Tramite.findAll({
            where: { placa },
            order: [['fecha_ingreso', 'ASC']],
        });

        if (tramites.length > 0) {
            res.json({ success: true, tramites });
        } else {
            res.json({ success: false, message: 'Trámites no encontrados' });
        }
    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});


////////////////////////////////////
///// ==      GENERAR TURNO BASICO   ==    ////
////////////////////////////////////


router.post('/generar-turno-basico', async (req, res) => {
    const { placa, servicio, tramite } = req.body;
    console.log('----  ROUTER:   GENERAR TURNO BÁSICO ---');

    try {
        const placaUpper = placa ? placa.toUpperCase().trim() : '';
        
        // Usamos tus utilidades de fecha
        const { currentDay } = getCurrentDay(); 
        const { startOfDay, endOfDay } = getRangeCurrentDay();

        console.log(`                Buscando vehículo para placa:`, placaUpper);
        const vehiculo = await Vehiculo.findOne({ where: { placa: placaUpper } });

        // Si no hay vehículo, inicializamos valores vacíos para que no falle el .create
        const datosUsuario = {
            id_usuario: vehiculo ? vehiculo.id_usuario : '',
            nombre_usuario: vehiculo ? vehiculo.nombre_usuario : 'USUARIO NO REGISTRADO'
        };

        if (!vehiculo) {
            console.warn(`                Vehículo [${placaUpper}] no encontrado. Continuando con datos vacíos.`);
        }

        // 2. Buscamos el último turno del día usando el rango de tu utilidad
        const ultimoTurno = await TurnoBasico.findOne({ 
            where: { 
                fecha_creacion: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            },
            order: [['id', 'DESC']] 
        });

        const proximoNumero = ultimoTurno && ultimoTurno.numero_turno ? parseInt(ultimoTurno.numero_turno) + 1 : 1;
        const numeroTurnoFinal = proximoNumero.toString();

        console.log('                Guardando en registro-turnos-basicos');
        const nuevoTurno = await TurnoBasico.create({
            numero_turno: numeroTurnoFinal,
            placa: placaUpper,
            servicio: servicio || 'MATRICULACIÓN',
            tramite: tramite,
            identificacion_propietario: datosUsuario.id_usuario,
            nombre_propietario: datosUsuario.nombre_usuario,
            fecha_creacion: currentDay
        });

        res.json({
            success: true,
            turno: nuevoTurno
        });

        console.log(`                Turno ${numeroTurnoFinal} generado exitosamente.`);

    } catch (error) {
        console.error('!!! [ERROR] !!!', error);
        res.status(500).json({ success: false, message: 'Error de servidor', error: error.message });
    }
});


//////////////////////////////////////////
///// ==      PARA AGREGAR EL PDF DE ARCHIVO GENERAL   ==    ////
//////////////////////////////////////////


router.get('/buscar-tramite-agregar-archivo-general', async (req, res) => {



    const { placa } = req.query;
    const usernameSesion = req.session.user.username;

    console.log('----  ROUTER:   Buscar tramite para agregar archivo general, placa:', placa);

    try {
        const tramites = await Tramite.findAll({
            attributes: [
                'id_tramite',
                'fecha_final_PRESENTACION',
                'placa',
                'tipo_tramite',
                'id_usuario',
                'nombre_usuario',
                'estado_tramite',
                'username',
                'username_funcionario_asignado_INFORMACION',
                'id_documento_informacion'],
            where: {
                placa,
                estado_tramite: { [Op.or]: ['En proceso', 'Finalizado'] },
            },
            order: [['fecha_final_PRESENTACION', 'DESC']]
        });

        if (tramites.length > 0) {
            console.log('                trámite NO encontrado');
            res.json({ success: true, tramites, usernameSesion });
        } else {
            console.log('                trámite encontrado');
            res.json({ success: false, message: 'Trámites no encontrados' });
        }
    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});




module.exports = router;