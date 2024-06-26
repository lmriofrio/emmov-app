const express = require('express');
const router = express.Router();
const { Op, Sequelize } = require('sequelize');
const Tramite = require('../models/Tramite');

router.get('/generar-reporte-placas', async (req, res) => {
    const { fecha_ingreso, fecha_final, cons_tipo_tramite, cons_clase_vehiculo } = req.query;

    console.log('Fecha de ingreso recibida:', fecha_ingreso);
    console.log('Fecha final recibida:', fecha_final);
    console.log('Tipo de trámite recibido:', cons_tipo_tramite);

    if (!fecha_ingreso || !fecha_final) {
        return res.status(400).json({ success: false, message: 'Por favor ingresa fechas válidas.' });
    }

    try {
        const whereClause = {
            fecha_ingreso: {
                [Op.between]: [fecha_ingreso, fecha_final]
            }
        };

        if (cons_tipo_tramite) {
            if (cons_tipo_tramite === 'EMISION DE MATRICULA POR PRIMERA VEZ') {
                whereClause.tipo_tramite = 'EMISION DE MATRICULA POR PRIMERA VEZ';
            } else if (cons_tipo_tramite === 'DUPLICADO DE PLACAS') {
                whereClause.tipo_tramite = 'DUPLICADO DE PLACAS';
            } else if (cons_tipo_tramite.startsWith('CAMBIO DE SERVICIO')) {
                whereClause.tipo_tramite = { [Op.like]: 'CAMBIO DE SERVICIO%' };
            } else if (cons_tipo_tramite === 'TODOS') {
                whereClause.tipo_tramite = {
                    [Op.or]: [
                        'EMISION DE MATRICULA POR PRIMERA VEZ',
                        'DUPLICADO DE PLACAS',
                        { [Op.like]: 'CAMBIO DE SERVICIO%' }
                    ]
                };
            } else {
                return res.status(400).json({ success: false, message: 'error en el ingreso del tipo de trámite.' });
            }
        }


        if (cons_clase_vehiculo) {
            if (cons_clase_vehiculo === 'VEHICULO') {
                whereClause.clase_vehiculo = 'VEHICULO';
            } else if (cons_clase_vehiculo === 'MOTOCICLETA') {
                whereClause.clase_vehiculo = 'MOTOCICLETA';
            } else if (cons_clase_vehiculo !== 'TODOS') {
                return res.status(400).json({ success: false, message: 'Error en el ingreso de la clase del vehículo.' });
            }

        }

        const tramites = await Tramite.findAll({
            where: whereClause
        });

        const count = tramites.length;

        //console.log('Numero de tramites:', count);

        if (count > 0) {
            res.json({ success: true, tramites, fecha_ingreso, fecha_final, cons_tipo_tramite, cons_clase_vehiculo });
        } else {
            res.json({ success: false, message: 'Trámites no encontrados' });
        }

    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

module.exports = router;
