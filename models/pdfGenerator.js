const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const pdf = require('html-pdf');
const os = require('os');

async function generarPDF() {
    try {
        const rutaVistaEJS = path.join(__dirname, '..', 'views', 'PDFreport-diario.ejs'); // Declaración de la ruta de la vista
        const outputPath = path.join(os.homedir(), 'Downloads', 'informe-diario.pdf'); // Ruta de salida en la carpeta de descargas

        // Verificar si el archivo existe
        if (!fs.existsSync(rutaVistaEJS)) {
            throw new Error('El archivo PDFreport-diario.ejs no se encuentra en la ubicación especificada.');
        }

        // Renderizar la vista EJS a HTML
        let html = ejs.render(fs.readFileSync(rutaVistaEJS, 'utf8'), {});

        // Agregar los estilos de Bootstrap al HTML
        const bootstrapStyles = fs.readFileSync(path.join(__dirname, '..', 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.min.css'), 'utf8');
        html = `<style>${bootstrapStyles}</style>${html}`;

        // Configurar las opciones para la generación de PDF
        const options = {
            format: 'A4', // Tamaño del papel
            orientation: 'landscape', // Orientación horizontal
            border: {
                top: '0.5cm', // Márgenes superiores de 0.5cm
                right: '0.5cm', // Márgenes derechos de 0.5cm
                bottom: '0.5cm', // Márgenes inferiores de 0.5cm
                left: '0.5cm' // Márgenes izquierdos de 0.5cm
            }
        };

        // Generar el PDF
        pdf.create(html, options).toFile(outputPath, (err, res) => {
            if (err) throw err;
            console.log('PDF generado correctamente en:', outputPath);
        });
    } catch (error) {
        console.error('Error al generar el PDF:', error);
    }
}

module.exports = generarPDF;
