const puppeteer = require('puppeteer');

async function pdfGenerator() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Cargar tu vista HTML en la página
    await page.setContent(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>PDF Generado</title>
            </head>
            <body>
                <!-- Tu tabla y otros elementos aquí -->
                <div class="table-responsive">
                    <table class="table table-striped table-bordered">
                        <!-- Contenido de tu tabla -->
                    </table>
                </div>
            </body>
        </html>
    `);

    // Generar el PDF
    await page.pdf({ path: 'output.pdf', format: 'A4' });

    await browser.close();
}

module.exports = pdfGenerator;


