const express = require('express');
const router = express.Router();
const { uploadArchivosPDF } = require('../utils/uploadConfig');
const Documento = require('../models/Documento');
const { getCurrentDay } = require('../utils/dateUtils');
const { updateTramite_id_documento } = require('../utils/saveUtils');

router.post('/subir-documento-pdf', (req, res, next) => {

    const tipo = req.query.tipo || 'matriculacion';
    let carpeta = 'general';
    let limiteMB = 1;

    if (tipo === 'matriculacion') { carpeta = 'matriculacion'; limiteMB = 2; }
    else if (tipo === 'rtv')      { carpeta = 'rtv';           limiteMB = 1; }
    else if (tipo === 'archivo')  { carpeta = 'archivo';       limiteMB = 5; }

    console.log('----  ROUTER:   Subir documento pdf:', tipo, limiteMB);

    return uploadArchivosPDF(carpeta, limiteMB)(req, res, next);

}, async (req, res) => {
    const start = Date.now();
    
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No se cargó ningún archivo o el formato no es PDF' 
            });
        }

        const { id_funcionario } = req.session.user;
        const { currentDay } = getCurrentDay();
        
        const ahora = new Date();
        const anio = ahora.getFullYear().toString();
        const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
        const dia = ahora.getDate().toString().padStart(2, '0');

        // La carpeta principal viene de lo que configuramos arriba
        const carpetaBase = req.subCarpetaDestino || 'general';
        const rutaRelativa = `${carpetaBase}/${anio}/${mes}/${dia}`;

        console.log('                procesando pdf...');

        const nuevoRegistro = await Documento.create({
            nombre_original_documento: req.file.originalname,
            nombre_servidor_documento: req.file.filename,
            ruta_carpeta_documento: rutaRelativa,
            mimetype_documento: req.file.mimetype,
            tamano_documento: req.file.size,
            fecha_creacion_documento: currentDay,
            fecha_actualizacion_documento: currentDay,
            id_funcionario_documento: id_funcionario
        });

        console.log('                subida exitosa del pdf ID:', nuevoRegistro.id_documento);

        return res.json({
            success: true,
            message: 'Archivo cargado y registrado correctamente',
            id_documento: nuevoRegistro.id_documento
        });

    } catch (error) {
        console.error('[CRITICAL ERROR] Error en /subir-documento-pdf:', error.stack);
        return res.status(500).json({
            success: false,
            message: 'Error interno al procesar el registro del documento'
        });
    }
});


module.exports = router;
