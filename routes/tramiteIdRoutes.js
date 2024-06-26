const express = require('express');
const router = express.Router();
const Tramite = require('../models/Tramite');

router.get('/buscar-tramite-id', async (req, res) => {
    const { idTramite } = req.query;
    const id_tramite = idTramite;


    try {
        const tramite = await Tramite.findByPk(id_tramite, { where: { id_tramite } });

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


module.exports = router;

