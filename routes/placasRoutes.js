const express = require('express');
const router = express.Router();
const Tramite = require('../models/Tramite');

router.get('/gen-report-placas', async (req, res) => {
    try {
        const tramites = await Tramite.findAll(); 

        res.json({ success: true, tramites });
    } catch (error) {
        console.error('Error al obtener trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

module.exports = router;
