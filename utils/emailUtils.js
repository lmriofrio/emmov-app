const nodemailer = require("nodemailer");
const Email = require('../models/Email');
const crypto = require('crypto');

function decrypt(encryptedText) {
    try {
        const SECRET_KEY = process.env.SECRET_KEY;
        
        // Separar el IV y el texto encriptado
        const [ivHex, encryptedHex] = encryptedText.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const encrypted = Buffer.from(encryptedHex, 'hex');
        
        const key = Buffer.from(SECRET_KEY, 'hex');
        
        // Crear el decipher con AES-256-CTR
        const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
        
        // Desencriptar
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        console.error('Error al desencriptar:', error);
        return null;
    }
}

async function enviarEmail(id_empresa, destinatario, asunto, mensaje) {
    try {


        console.log('----Entro a tratar de enviar');
        // Buscar la empresa en la base de datos
        const empresa = await Email.findOne({
            where: { id_empresa: id_empresa },
            attributes: ["email_empresa_tthh", "password_empresa_tthh", "email_host_tthh", "email_port_tthh"]
        });

        const emailPass = decrypt(empresa.password_empresa_tthh);

        // Configurar el transporte de nodemailer
        const transporter = nodemailer.createTransport({
            host: empresa.email_host_tthh,
            port: empresa.email_port_tthh,
            secure: true,
            auth: {
                user: empresa.email_empresa_tthh,
                pass: emailPass
            }
        });


        // Configurar el contenido del email
        const mailOptions = {
            from: `"${empresa.email_empresa_tthh}" <${empresa.email_empresa_tthh}>`,
            to: destinatario,
            subject: asunto,
            html: mensaje
        };
        
        // Enviar el email
        const info = await transporter.sendMail(mailOptions);
        console.log("📧 Email enviado:", info.response);
        return { success: true, message: "Email enviado correctamente" };

    } catch (error) {
        console.error("❌ Error al enviar el correo:", error);
        return { success: false, message: "Error al enviar el email" };
    }
}

module.exports = { enviarEmail, decrypt };
