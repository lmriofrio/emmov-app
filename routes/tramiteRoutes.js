const express = require('express');
const router = express.Router();
const Tramite = require('../models/Tramite');

router.get('/buscar-tramite', async (req, res) => {
    const { placa } = req.query;

    try {
        const tramites = await Tramite.findAll({ where: { placa } });

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

module.exports = router;

