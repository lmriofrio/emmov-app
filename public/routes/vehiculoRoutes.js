

const express = require('express');
const router = express.Router();
const Vehiculo = require('../../models/Vehiculo');

router.post('/buscar-vehiculo', async (req, res) => {
    const { placa } = req.body;

    try {
        const vehiculo = await Vehiculo.findOne({ where: { placa } });

        if (vehiculo) {
            res.json({ success: true, vehiculo });
        } else {
            res.json({ success: false, message: 'Vehículo no encontrado' });
        }
    } catch (error) {
        console.error('Error al buscar vehículo:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

module.exports = router;

