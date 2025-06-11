const express = require('express');
const router = express.Router();
const Tramite = require('../models/Tramite');
const { Op } = require('sequelize');
const { getRangeCurrentDay } = require('../utils/dateUtils');

router.get('/visualizar-turnos', async (req, res) => {
    try {
        const username = req.session.user.username;
        const id_empresa = req.session.user.id_empresa;

        const { startOfDay, endOfDay } = getRangeCurrentDay();


        const columnas = [
            'id_tramite',
            'placa',
            'tipo_tramite',
            'fecha_ingreso_INFORMACION',
            'fecha_finalizacion',
            'numero_turno_matriculacion_INFORMACION',
            'estado_tramite',
            'username_funcionario_INFORMACION',
            'username_funcionario_asignado_INFORMACION'];

        const tramitesUsuario = await Tramite.findAll({
            attributes: columnas,
            where: {
                estado_tramite: { [Op.or]: ['En proceso', 'Finalizado'] },
                username_funcionario_INFORMACION: username,
                fecha_ingreso_INFORMACION: {
                    [Op.and]: [
                        { [Op.gte]: startOfDay },
                        { [Op.lte]: endOfDay }
                    ]
                }
            },
            order: [['fecha_ingreso_INFORMACION', 'ASC']]
        });


        const tramitesGeneral = await Tramite.findAll({
            attributes: columnas,
            where: {
                estado_tramite: { [Op.or]: ['En proceso', 'Finalizado'] },
                id_empresa: id_empresa,
                fecha_ingreso_INFORMACION: {
                    [Op.and]: [
                        { [Op.gte]: startOfDay },
                        { [Op.lte]: endOfDay }
                    ]
                }
            },
            order: [['fecha_ingreso_INFORMACION', 'ASC']]
        });

        res.json({ success: true, tramitesUsuario, tramitesGeneral });

    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

router.get('/visualizar-turnos-agenda', async (req, res) => {
    try {
        const { username, id_empresa } = req.session.user;
        const { startOfDay, endOfDay } = getRangeCurrentDay();

        const columnas = [
            'id_tramite',
            'placa',
            'tipo_tramite',
            'fecha_ingreso_INFORMACION',
            'fecha_finalizacion',
            'numero_turno_matriculacion_INFORMACION',
            'estado_tramite',
            'username_funcionario_INFORMACION',
            'username_funcionario_asignado_INFORMACION'];

        const [tramitesHoy, tramitesPendientes, tramitesPendientesEmpresa] = await Promise.all([
            Tramite.findAll({
                attributes: columnas,
                where: {
                    estado_tramite: { [Op.or]: ['En proceso', 'Finalizado'] },
                    username_funcionario_asignado_INFORMACION: username,
                    fecha_ingreso_INFORMACION: {
                        [Op.between]: [startOfDay, endOfDay]
                    }
                },
                order: [['fecha_ingreso_INFORMACION', 'ASC']]
            }),
            Tramite.findAll({
                attributes: columnas,
                where: {
                    username_funcionario_asignado_INFORMACION: username,
                    estado_tramite: 'En proceso'
                },
                order: [['fecha_ingreso_INFORMACION', 'ASC']]
            }),
            Tramite.findAll({
                attributes: columnas,
                where: {
                    id_empresa,
                    estado_tramite: 'En proceso'
                },
                order: [['fecha_ingreso_INFORMACION', 'ASC']]
            })
        ]);

        res.json({ success: true, tramitesHoy, tramitesPendientes, tramitesPendientesEmpresa });

    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});


router.get('/visualizar-turnos-rtv', async (req, res) => {
    try {
        

        const { startOfDay, endOfDay } = getRangeCurrentDay();

        const columnas = [
            'id_tramite',
            'placa',
            'tipo_tramite',
            'fecha_turno_RTV',
            'numero_turno_rtv_INFORMACION',
            'estado_tramite',
            'username_funcionario_asignado_INFORMACION',
            'revision_tecnica_vehicular_TURNO',
            'verificacion_improntas_TURNO',
            'cambio_servicio_TURNO',
            'cambio_color_TURNO',
            'resultado_final_RTV'
        ];

        const tramitesUsuario = await Tramite.findAll({
            attributes: columnas,
            where: {
                estado_tramite: { [Op.or]: ['En proceso', 'Finalizado'] },
                fecha_turno_RTV: {
                    [Op.and]: [
                        { [Op.gte]: startOfDay },
                        { [Op.lte]: endOfDay }
                    ]
                },
                [Op.or]: [
                    { revision_tecnica_vehicular_TURNO: 'SI' },
                    { verificacion_improntas_TURNO: 'SI' },
                    { cambio_servicio_TURNO: 'SI' },
                    { cambio_color_TURNO: 'SI' }
                ]
            },
            order: [['fecha_turno_RTV', 'ASC']]
        });

        const tramitesProcesados = tramitesUsuario.map(tramite => ({
            ...tramite.toJSON(),
            revision_tecnica_vehicular_TURNO: tramite.revision_tecnica_vehicular_TURNO === 'SI' ? 'SI' : '',
            verificacion_improntas_TURNO: tramite.verificacion_improntas_TURNO === 'SI' ? 'SI' : '',
            cambio_servicio_TURNO: tramite.cambio_servicio_TURNO === 'SI' ? 'SI' : '',
            cambio_color_TURNO: tramite.cambio_color_TURNO === 'SI' ? 'SI' : '',
        }));


        res.json({ success: true, tramitesUsuario: tramitesProcesados });

    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});



router.get('/visualizar-turnos-rtv-filtro', async (req, res) => {
    try {
        const username = req.session.user.username;
        const { placa } = req.query;


        const { startOfDay, endOfDay } = getRangeCurrentDay();

        const columnas = [
            'id_tramite',
            'placa',
            'tipo_tramite',
            'fecha_turno_RTV',
            'numero_turno_rtv_INFORMACION',
            'estado_tramite',
            'username_funcionario_asignado_INFORMACION',
            'revision_tecnica_vehicular_TURNO',
            'verificacion_improntas_TURNO',
            'cambio_servicio_TURNO',
            'cambio_color_TURNO',
            'resultado_final_RTV'
        ];

        const tramitesUsuario = await Tramite.findAll({
            attributes: columnas,
            where: {
                estado_tramite: { [Op.or]: ['En proceso', 'Finalizado'] },
                placa,
                [Op.or]: [
                    { revision_tecnica_vehicular_TURNO: 'SI' },
                    { verificacion_improntas_TURNO: 'SI' },
                    { cambio_servicio_TURNO: 'SI' },
                    { cambio_color_TURNO: 'SI' }
                ]
            },
            order: [['fecha_turno_RTV', 'ASC']]
        });

        const tramitesProcesados = tramitesUsuario.map(tramite => ({
            ...tramite.toJSON(),
            revision_tecnica_vehicular_TURNO: tramite.revision_tecnica_vehicular_TURNO === 'SI' ? 'SI' : '',
            verificacion_improntas_TURNO: tramite.verificacion_improntas_TURNO === 'SI' ? 'SI' : '',
            cambio_servicio_TURNO: tramite.cambio_servicio_TURNO === 'SI' ? 'SI' : '',
            cambio_color_TURNO: tramite.cambio_color_TURNO === 'SI' ? 'SI' : '',
        }));

        res.json({ success: true, tramitesUsuario: tramitesProcesados });

    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});




module.exports = router;
