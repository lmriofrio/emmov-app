const express = require('express');
const router = express.Router();
const { uploadArchivosMatriculacion } = require('../utils/uploadConfig');
const Documento = require('../models/Documento');

router.post('/subir-documento-matriculacion', uploadArchivosMatriculacion.single('archivo_pdf'), async (req, res) => {
    const start = Date.now();
    console.log('--- INICIO DE PROCESO DE SUBIDA (MATRICULACIÓN) ---');
    
    try {
        if (!req.file) {
            console.warn('[WARN] Intento de subida sin archivo o formato no válido');
            return res.json({ success: false, message: 'No se cargó ningún archivo o el formato es incorrecto' });
        }

        const { id_referencia } = req.body;
        const ahora = new Date();
        const anio = ahora.getFullYear().toString();
        const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
        const dia = ahora.getDate().toString().padStart(2, '0');   // <-- añadimos el día

        // Ahora la ruta incluye año, mes y día
        const rutaRelativa = `matriculacion/${anio}/${mes}/${dia}`;

        console.log('----- Intentando crear registro en MySQL...');
        
        const nuevoRegistro = await Documento.create({
            nombre_original_documento: req.file.originalname,
            nombre_servidor_documento: req.file.filename,
            ruta_carpeta_documento: rutaRelativa,
            mimetype_documento: req.file.mimetype,
            tamano_documento: req.file.size,
            id_referencia_documento: (id_referencia && id_referencia !== "") ? id_referencia : null,
            fecha_creacion_documento: ahora,
            fecha_actualizacion__documento: ahora
        });

        const duration = Date.now() - start;

        if (nuevoRegistro) {
            console.log(`----- Registro de matriculación creado con ID: ${nuevoRegistro.id_documento}`);
            res.json({ 
                success: true, 
                message: 'Archivo cargado correctamente',
                id_documento: nuevoRegistro.id_documento
            });
        } else {
            console.error('[ERROR] El registro no se creó en la base de datos.');
            res.json({ success: false, message: 'No se pudo crear el registro en la base de datos' });
        }

    } catch (error) {
        console.error('[CRITICAL ERROR] Fallo en el flujo de subida de matriculación:');
        console.error(error.stack);
        
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor al procesar archivo de matriculación' 
        });
    }
});

module.exports = router;
