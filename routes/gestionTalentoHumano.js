const express = require('express');
const router = express.Router();
const Funcionario = require('../models/Funcionario');
const FuncionarioTTHH = require('../models/FuncionarioTTHH');
const FaltaAsistenciasTTHH = require('../models/FaltaAsistenciasTTHH');
const { getCurrentDay } = require('../utils/dateUtils');
const { createFaltaAsistencia, editarFaltaAsistencia } = require('../utils/saveUtils');
const { enviarEmail } = require('../utils/emailUtils');

router.get('/visualizar-FuncionarioTTHH', async (req, res) => {
    try {
        const username = req.session.user.username;
        const id_empresa = req.session.user.id_empresa;

        const columnas = [
            'id_funcionario',
            'nombre_funcionario',
            'estado_funcionario',
            'email_funcionario',
            'id_empresa',
            'nombre_corto_empresa'];

        const funcionariosTTHH = await FuncionarioTTHH.findAll({
            attributes: columnas,
            where: {
                id_empresa: id_empresa,
            },
            order: [['nombre_funcionario', 'ASC']]
        });

        res.json({ success: true, funcionariosTTHH });

    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

router.post('/crear-falta-asistencia', async (req, res) => {
    try {
        const { agg_id_funcionario, agg_fecha, agg_motivo, agg_tiempo_horas, agg_tiempo_minutos } = req.body;
        const id_funcionarioTTHH = req.session.user.id_funcionario;

        // Obtener la fecha actual
        const { currentDay } = getCurrentDay();

        const fecha = agg_fecha;
        const id_funcionario = agg_id_funcionario;
        const motivo = agg_motivo;
        const tiempo_descuento = agg_tiempo_horas + ':' + agg_tiempo_minutos;
        const fecha_registroTTHH = currentDay;

        console.log('/agregar-falta-asistencia', id_funcionario, fecha, motivo, tiempo_descuento, id_funcionarioTTHH, currentDay);

        const funcionarioFaltaAsistencia = await FuncionarioTTHH.findOne({
            where: { id_funcionario: id_funcionario }
        });

        const funcionarioTTHH = await Funcionario.findOne({
            where: { id_funcionario: id_funcionarioTTHH },
            attributes: ['nombre_funcionario', 'username']
        });

        // Guardar el nuevo registro
        const { id_registro } = await createFaltaAsistencia({
            fecha,
            id_funcionario,
            nombre_funcionario: funcionarioFaltaAsistencia.nombre_funcionario,
            motivo,
            tiempo_descuento,
            id_funcionarioTTHH,
            nombre_funcionarioTTHH: funcionarioTTHH.nombre_funcionario,
            fecha_registroTTHH,
            username_TTHH: funcionarioTTHH.username,
        });

        //console.log('id_registro', id_registro);
        //console.log('id_funcionario', id_funcionario);

        //  Enviar email de notificación
        const destinatario = funcionarioFaltaAsistencia.email_funcionario;
        const asunto = '(TEST) Notificación de falta de registro de asistencia';
        const mensaje = `
            <p>Estimado/a <b>${funcionarioFaltaAsistencia.nombre_funcionario}</b>,</p>
            <p>Por medio del presente, se notifica la falta de registro de asistencia laboral en el día:</p>
            <ul>
                <li><b>Fecha:</b> ${fecha}</li>
                <li><b>Motivo:</b> ${motivo}</li>
                <li><b>Tiempo de descuento:</b> ${agg_tiempo_horas} horas, ${agg_tiempo_minutos} minutos</li>
            </ul>
            <p>Atentamente,</p>
            <p>Departamento de Talento Humano de la EMMSZACH E.P.</p>
        `;

        const emailResponse = await enviarEmail(req.session.user.id_empresa, destinatario, asunto, mensaje);

        let estado = "Email enviado";

        if (!emailResponse.success) {
            console.error(' Error al enviar el correo:', emailResponse.message);
            estado = "Email no enviado";
        }

        // Actualizar la columna notificado_email en la base de datos
        await (async function actualizarEstadoNotificacion(id, estado) {
            return await FaltaAsistenciasTTHH.update(
                { notificado_email: estado },
                { where: { id_registro: id_registro } }
            );
        })(id_registro, estado);

        res.redirect(`/talento-humano/vista-funcionario?id_funcionario=${id_funcionario}`);

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.error('Error: Registro duplicado en la base de datos', error);
            res.status(400).json({ success: false, message: 'El registro con esta placa ya existe' });
        } else {
            console.error('Error al guardar el trámite en la ruta:', error);
            res.status(500).json({ success: false, message: 'Error al guardar el trámite' });
        }
    }
});

router.get('/visualizar-fatas-asistencia', async (req, res) => {
    try {

        const { idFuncionario } = req.query;
        const username = req.session.user.username;
        const id_empresa = req.session.user.id_empresa;

        const faltaAsistenciasTTHH = await FaltaAsistenciasTTHH.findAll({
            where: {
                id_funcionario: idFuncionario,
            },
            order: [['fecha', 'ASC']]
        });

        res.json({ success: true, faltaAsistenciasTTHH });

        //console.log('faltaAsistenciasTTHH', faltaAsistenciasTTHH)

    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

router.get('/visualizar-fatas-asistencia-act', async (req, res) => {
    try {

        const { idFuncionario } = req.query;

        const faltaAsistenciasTTHH = await FaltaAsistenciasTTHH.findAll({
            where: {
                id_funcionario: idFuncionario,
                eliminado: 'NO'
            },
            order: [['fecha', 'ASC']]
        });

        res.json({ success: true, faltaAsistenciasTTHH });

        //console.log('faltaAsistenciasTTHH', faltaAsistenciasTTHH)

    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

router.post('/editar-falta-asistencia', async (req, res) => {
    try {
        const {
            agg_id_registro,
            agg_fecha,
            agg_id_funcionario,
            agg_motivo,
            agg_tiempo_horas,
            agg_tiempo_minutos,
            agg_estado,
            agg_fecha_justificacion,
            agg_motivo_justificacion,
            agg_observación_justificacion } = req.body;


        let id_registro = agg_id_registro;

        const fecha = agg_fecha;
        const id_funcionario = agg_id_funcionario;
        const motivo = agg_motivo;
        const estado = agg_estado;
        const fecha_justificacion = agg_fecha_justificacion;
        const motivo_justificacion = agg_motivo_justificacion;
        const observación_justificacion = agg_observación_justificacion;

        const tiempo_descuento = agg_tiempo_horas + ':' + agg_tiempo_minutos;

        // Guardar el nuevo trámite 
        id_registro = await editarFaltaAsistencia({
            id_registro,
            fecha,
            id_funcionario,
            motivo,
            tiempo_descuento,
            estado,
            fecha_justificacion,
            motivo_justificacion,
            observación_justificacion,
        });

        console.log('id_registro', id_registro)
        console.log('id_funcionario', id_funcionario)

        res.redirect(`/talento-humano/vista-funcionario?id_funcionario=${id_funcionario}`);



    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.error('Error: Registro duplicado en la base de datos', error);
            res.status(400).json({ success: false, message: 'El registro con esta placa ya existe' });
        } else {
            console.error('Error al guardar el trámite en la ruta:', error);
            res.status(500).json({ success: false, message: 'Error al guardar el trámite' });
        }
    }
});

router.post('/eliminar-falta-asistencia', async (req, res) => {
    try {
        const { nombre_funcionario, username } = req.session.user;

        const id_funcionario_TH = req.session.user.id_funcionario;

        const { elm_id_registro, observacion_eliminacion } = req.body;

        const eliminado = 'SI';

        // Obtener la fecha actual a travez de la funcionalidad utlisDate

        const { currentDay } = getCurrentDay();

        const nombre_funcionarioTTHH_eliminacion = nombre_funcionario;
        const username_TTHH_eliminacion = username;

        const faltaAsistenciasTTHH = await FaltaAsistenciasTTHH.findByPk(elm_id_registro);

        await faltaAsistenciasTTHH.update({
            eliminado: eliminado,
            fecha_eliminacion: currentDay,
            observacion_eliminacion: observacion_eliminacion,
            id_funcionarioTTHH_eliminacion: id_funcionario_TH,
            nombre_funcionarioTTHH_eliminacion: nombre_funcionarioTTHH_eliminacion,
            username_TTHH_eliminacion: username_TTHH_eliminacion
        });

        const id_funcionario = faltaAsistenciasTTHH.id_funcionario;

        console.log('id_funcionario', id_funcionario)

        res.redirect(`/talento-humano/vista-funcionario?id_funcionario=${id_funcionario}`);



    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.error('Error: Registro duplicado en la base de datos', error);
            res.status(400).json({ success: false, message: 'El registro con esta placa ya existe' });
        } else {
            console.error('Error al guardar el trámite en la ruta:', error);
            res.status(500).json({ success: false, message: 'Error al guardar el trámite' });
        }
    }
});

router.post('/justificar-falta-asistencia', async (req, res) => {
    try {
        const { nombre_funcionario, username } = req.session.user;

        const id_funcionario_TH = req.session.user.id_funcionario;

        const { jtf_id_registro, jtf_motivo, observacion_justificacion, jtf_fecha } = req.body;

        const nombre_funcionarioTTHH_justificacion = nombre_funcionario;
        const username_TTHH_justificacion = username;

        const estado = 'JUSTIFICADO';

        const faltaAsistenciasTTHH = await FaltaAsistenciasTTHH.findByPk(jtf_id_registro);

        await faltaAsistenciasTTHH.update({
            estado: estado,
            fecha_justificacion: jtf_fecha,
            motivo_justificacion: jtf_motivo,
            observación_justificacion: observacion_justificacion,
            id_funcionarioTTHH_justificacion: id_funcionario_TH,
            nombre_funcionarioTTHH_justificacion: nombre_funcionarioTTHH_justificacion,
            username_TTHH_justificacion: username_TTHH_justificacion
        });

        const id_funcionario = faltaAsistenciasTTHH.id_funcionario;

        console.log('id_funcionario', id_funcionario)

        res.redirect(`/talento-humano/vista-funcionario?id_funcionario=${id_funcionario}`);



    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.error('Error: Registro duplicado en la base de datos', error);
            res.status(400).json({ success: false, message: 'El registro con esta placa ya existe' });
        } else {
            console.error('Error al guardar el trámite en la ruta:', error);
            res.status(500).json({ success: false, message: 'Error al guardar el trámite' });
        }
    }
});


router.get('/sumar-faltas-inasistencia', async (req, res) => {
    try {

        const { idFuncionario } = req.query;
        const id_empresa = req.session.user.id_empresa;

        //console.log('faltaAsistenciasTTHH', idFuncionario, id_empresa)

        const funcionario = await FuncionarioTTHH.findOne({
            where: {
                id_funcionario: idFuncionario,
            }
        });

        const faltaInasistencia = await FaltaAsistenciasTTHH.findAll({
            where: {
                id_funcionario: idFuncionario,
                estado: 'NO JUSTIFICADO',
                eliminado: 'NO',
            },
            order: [['fecha', 'ASC']]
        });

        const totalFaltas = await FaltaAsistenciasTTHH.count({
            where: {
                id_funcionario: idFuncionario,
                estado: 'NO JUSTIFICADO',
                eliminado: 'NO',
            }
        });

        const registros = await FaltaAsistenciasTTHH.findAll({
            where: {
                id_funcionario: idFuncionario,
                estado: 'NO JUSTIFICADO',
                eliminado: 'NO',
            },
            attributes: ['tiempo_descuento']
        });

        let totalHoras = 0;
        let totalMinutos = 0;

        registros.forEach(registro => {
            if (registro.tiempo_descuento) {
                const [horas, minutos] = registro.tiempo_descuento.split(':').map(Number);
                totalHoras += horas;
                totalMinutos += minutos;
            }
        });

        totalHoras += Math.floor(totalMinutos / 60);
        totalMinutos = totalMinutos % 60;

        const totalTiempo = `${String(totalHoras).padStart(2, '0')}:${String(totalMinutos).padStart(2, '0')}`;

        res.json({ success: true, faltaInasistencia, totalFaltas, totalTiempo, funcionario });

        //console.log('faltaAsistenciasTTHH', totalFaltas, totalTiempo)

    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});



module.exports = router;
