const express = require('express');
const router = express.Router();
const Tramite = require('../models/Tramite');
const TramitesAtencion = require('../models/TramitesAtencion');
const ConceptoPago = require('../models/ConceptoPago');
const TituloCredito = require('../models/TituloCredito');
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
            'id_documento_informacion',
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


        const tramitesPendientesEmpresa = await Tramite.findAll({
            attributes: columnas,
            where: {
                estado_tramite: 'En proceso',
                id_empresa: id_empresa,
            },
            order: [['fecha_ingreso_INFORMACION', 'ASC']]
        });

       
        res.json({ success: true, tramitesUsuario, tramitesGeneral, tramitesPendientesEmpresa });

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
            'id_documento_informacion',
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
            /*
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
            })*/
        ]);

        res.json({ success: true, tramitesHoy });

    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

router.get('/visualizar-turnos-home', async (req, res) => {
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
                    fecha_ingreso_INFORMACION: {
                        [Op.between]: [startOfDay, endOfDay]
                    }
                },
                order: [['fecha_ingreso_INFORMACION', 'ASC']]
            }),
            Tramite.findAll({
                attributes: columnas,
                where: {
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
            'resultado_final_RTV',
            'id_documento_informacion',
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
            'resultado_final_RTV',
            'id_documento_informacion',
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


router.get('/visualizar-turnos-matriculacion-en-atencion', async (req, res) => {
    try {


        const tramitesEnAtencion = await TramitesAtencion.findAll({
            attributes: [
                'id_funcionario',
                'nombre_funcionario_corto',
                'placa_en_atención',
                'id_tramite_en_atención',
                'estado_en_atención',
            ],
            where: {
                estado_funcionario: 'ACTIVO',
            },
            order: [['nombre_funcionario_corto', 'ASC']]
        });
        res.json({
            success: true,
            data: tramitesEnAtencion
        });

    } catch (error) {
        console.error('Error al visualizar trámites en atención:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});



router.get('/visualizar-titulos-credito-filtro', async (req, res) => {
    try {

        if (!req.session.user) {
            return res.status(401).json({ success: false, message: 'No autorizado' });
        }

        const { placa } = req.query;

        if (!placa) {
            return res.status(400).json({ success: false, message: 'Debe proporcionar una placa' });
        }

        const placaBusqueda = placa.toUpperCase();

        const titulosCredito = await TituloCredito.findAll({

            attributes: [
                'id_titulos_credito',
                'id_tramite',
                'placa',
                'nombre_concepto',
                'cantidad_concepto',
                'valor_unitario_concepto',
                'subtotal_concepto',
                'fecha_titulo_credito',
                'estado_titulo_credito',
                'nombre_usuario',
                'id_usuario'
            ],

            where: {
                placa: placaBusqueda
            },

            order: [['fecha_titulo_credito', 'DESC']]

        });



        res.json({
            success: true,
            titulosCredito
        });

    } catch (error) {

        console.error('Error al buscar títulos de crédito:', error);

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });

    }
});

module.exports = router;
