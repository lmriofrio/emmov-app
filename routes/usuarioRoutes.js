const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

router.post('/buscar-usuario', async (req, res) => {
    const { id_usuario } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { id_usuario } });

        if (usuario) {
            res.json({ success: true, usuario });
        } else {
            res.json({ success: false, message: 'usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al buscar usuario:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

module.exports = router;
