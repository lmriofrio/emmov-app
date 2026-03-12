const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('--- [MULTER MATRICULACION] INICIANDO subida ---');

    const ahora = new Date();
    const anio = ahora.getFullYear().toString();
    const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
    const dia = ahora.getDate().toString().padStart(2, '0');

    // Ahora incluimos 'matriculacion' en la ruta
    const ruta = path.join(__dirname, '../uploads/matriculacion', anio, mes, dia);

    try {
      if (!fs.existsSync(ruta)) {

        fs.mkdirSync(ruta, { recursive: true });

      } else {

      }
      cb(null, ruta);
    } catch (error) {
      console.error('[MULTER ERROR] Error al gestionar directorios:', error);
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    const nombreLimpio = file.originalname.replace(/\s+/g, '-').toLowerCase();
    const nombreFinal = `${Date.now()}-${nombreLimpio}`;
    cb(null, nombreFinal);
  }
});

const uploadArchivosMatriculacion = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});

module.exports = {
  uploadArchivosMatriculacion
};