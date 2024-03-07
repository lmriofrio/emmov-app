const express = require('express');
const router = express.Router();
const pdfGenerator = require('../models/pdfGenerator'); // Importa la función para generar el PDF

router.get('/generar-pdf', async (req, res) => {
    try {
        await pdfGenerator(); // Genera el PDF utilizando la función importada
        
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).send('Error interno del servidor al generar el PDF');
    }
});

module.exports = router;
