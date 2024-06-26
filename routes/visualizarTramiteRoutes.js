const express = require('express');
const router = express.Router();
const Vehiculo = require('../models/Tramite');

router.post('/visualizar-tramite', async (req, res) => {
    

    try {
        

      
    } catch (error) {
        console.error('Error al buscar vehículo:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

module.exports = router;
