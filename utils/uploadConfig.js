const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const subCarpeta = req.subCarpetaDestino || 'general';
        
        const ahora = new Date();
        const anio = ahora.getFullYear().toString();
        const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
        const dia = ahora.getDate().toString().padStart(2, '0');

        // Usamos process.cwd() para asegurar que la ruta sea relativa a la raíz del proyecto
        const ruta = path.join(process.cwd(), 'uploads', subCarpeta, anio, mes, dia);

        try {
            if (!fs.existsSync(ruta)) {
                fs.mkdirSync(ruta, { recursive: true });
            }
            cb(null, ruta);
        } catch (error) {
            console.error('[MULTER ERROR] No se pudo crear la carpeta:', error);
            cb(new Error('Error en el servidor al preparar el directorio de subida'), null);
        }
    },
    filename: function (req, file, cb) {
        const nombreLimpio = file.originalname
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9.]/g, "-")
            .toLowerCase();
            
        const nombreFinal = `${Date.now()}-${nombreLimpio}`;
        cb(null, nombreFinal);
    }
});

/**
 * @param {string} carpeta - Nombre de la subcarpeta destino
 * @param {number} valorLimite - Valor numérico (ej: 5 o 499)
 * @param {boolean} esKB - Si es true, el valor se trata como KB. Si es false, como MB.
 */
const uploadArchivosPDF = (carpeta, valorLimite = 5, esKB = false) => {
    
    // CAMBIO SUSTANCIAL: Cálculo dinámico de bytes
    const factor = esKB ? 1024 : (1024 * 1024);
    const maxSizeBytes = Math.floor(valorLimite * factor);

    const upload = multer({
        storage: storage,
        limits: { fileSize: maxSizeBytes },
        fileFilter: (req, file, cb) => {
            const filetypes = /pdf/;
            const mimetype = filetypes.test(file.mimetype);
            const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

            if (mimetype && extname) {
                return cb(null, true);
            }
            cb(new Error('El archivo debe ser un formato PDF válido'));
        }
    }).single('archivo_pdf');

    return (req, res, next) => {
        req.subCarpetaDestino = carpeta;

        upload(req, res, (err) => {
            if (err) {
                let mensaje = 'Error al procesar el archivo';
                let codigoError = 'UPLOAD_ERROR';
                
                if (err instanceof multer.MulterError) {
                    codigoError = err.code;
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        // Mensaje dinámico según la unidad de medida
                        const unidad = esKB ? 'KB' : 'MB';
                        mensaje = `El archivo es muy pesado. Máximo permitido: ${valorLimite} ${unidad}`;
                    }
                } else {
                    mensaje = err.message;
                }

                return res.status(400).json({
                    success: false,
                    estadoSubida: 'error',
                    mensaje: mensaje,
                    detalles: codigoError
                });
            }
            next();
        });
    };
};

module.exports = { uploadArchivosPDF };