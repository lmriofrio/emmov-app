const express = require('express');
const router = express.Router();
const { Op,Sequelize } = require('sequelize');
const Tramite = require('../models/Tramite');

router.get('/generar-reporte-tipo-vehiculo', async (req, res) => {
    const { fecha_ingreso, fecha_final, username } = req.query;

    console.log('Fecha de ingreso recibida:', fecha_ingreso); 
    console.log('Fecha final recibida:', fecha_final); 

    try {
        const tramites = await Tramite.findAll({ 
            where: { 
                fecha_ingreso: { 
                    [Sequelize.Op.between]: [fecha_ingreso, fecha_final] 
                },
                username 
            } 
        }); 

        if (tramites.length > 0) {
            res.json({ success: true, tramites, fecha_ingreso, fecha_final });
        } else {
            res.json({ success: false, message: 'Trámites no encontrados' });
        }
    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

module.exports = router;
