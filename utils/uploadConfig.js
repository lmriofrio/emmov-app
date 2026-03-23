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

        const ruta = path.join(__dirname, '../uploads', subCarpeta, anio, mes, dia);

        // Crear directorios de forma segura
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
        // Mejoramos la limpieza: quitamos tildes, eñes y caracteres especiales
        const nombreLimpio = file.originalname
            .normalize("NFD") // Descompone caracteres acentuados
            .replace(/[\u0300-\u036f]/g, "") // Quita los acentos
            .replace(/[^a-zA-Z0-9.]/g, "-") // Cambia todo lo que no sea letra/número por guion
            .toLowerCase();
            
        const nombreFinal = `${Date.now()}-${nombreLimpio}`;
        cb(null, nombreFinal);
    }
});

const uploadArchivosPDF = (carpeta, limiteMB = 5) => {
    const upload = multer({
        storage: storage,
        limits: { fileSize: limiteMB * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            // Verificación estricta de MIME y extensión
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
                        mensaje = `El archivo es muy pesado para esta sección. Máximo permitido: ${limiteMB}MB`;
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