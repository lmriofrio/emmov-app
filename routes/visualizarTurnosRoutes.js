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

        const tramitesUsuario = await Tramite.findAll({
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
        const username = req.session.user.username;
        const id_empresa = req.session.user.id_empresa;
        const estado_tramite = ('En proceso');

        const { startOfDay, endOfDay } = getRangeCurrentDay();
        
        const tramitesHoy = await Tramite.findAll({
            where: {
                estado_tramite: { [Op.or]: ['En proceso', 'Finalizado'] },
                username_funcionario_asignado_INFORMACION: username,
                fecha_ingreso_INFORMACION: {
                    [Op.and]: [
                        { [Op.gte]: startOfDay },
                        { [Op.lte]: endOfDay }
                    ]
                }
            },
            order: [['fecha_ingreso_INFORMACION', 'ASC']]
        });

        const tramitesPendientes = await Tramite.findAll({
            where: {
                username_funcionario_asignado_INFORMACION: username,
                estado_tramite: estado_tramite,
            },
            order: [['fecha_ingreso_INFORMACION', 'ASC']]
        });

        const tramitesPendientesEmpresa = await Tramite.findAll({
            where: {
                id_empresa: id_empresa,
                estado_tramite: estado_tramite,
            },
            order: [['fecha_ingreso_INFORMACION', 'ASC']]
        });

        
            res.json({ success: true, tramitesHoy, tramitesPendientes, tramitesPendientesEmpresa });
      
    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

module.exports = router;
