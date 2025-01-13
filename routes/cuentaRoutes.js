const express = require('express');
const router = express.Router();
const Funcionario = require('../models/Funcionario');


router.post('/conf-AsigTramites', async (req, res) => {
    try {
        const { id_funcionario } = req.session.user;
        
        if (!id_funcionario) {
            return res.status(400).send('Error: ID de funcionario no encontrado.');
        }

        const { tipo_ASIGNACION, oficina_ASIGNACION, usuario_ASIGNACION } = req.body;

        console.log(id_funcionario, tipo_ASIGNACION, oficina_ASIGNACION, usuario_ASIGNACION);

        await Funcionario.update(
            { tipo_ASIGNACION, oficina_ASIGNACION, usuario_ASIGNACION },
            { where: { id_funcionario } }
        );

        const updatedUser = await Funcionario.findOne({ where: { id_funcionario } });

        req.session.user = {
            ...req.session.user,
            tipo_ASIGNACION: updatedUser.tipo_ASIGNACION,
            oficina_ASIGNACION: updatedUser.oficina_ASIGNACION,
            usuario_ASIGNACION: updatedUser.usuario_ASIGNACION,
        };

        console.log('Asignación actualizada correctamente');
        return res.status(200).send('success');

    } catch (error) {
        console.error('Error al actualizar la asignación del funcionario:', error.message);
        return res.status(500).send('Error interno del servidor.');
    }
});

router.post('/conf-RecepcionTramites', async (req, res) => {
    try {
        const { id_funcionario } = req.session.user;
        const { recepcion_tramites } = req.body;

        await Funcionario.update(
            { recepcion_tramites },
            { where: { id_funcionario } }
        );

        // Actualizar la información del usuario en la sesión
        const updatedUser = await Funcionario.findOne({ where: { id_funcionario } });
        req.session.user.recepcion_tramites = updatedUser.recepcion_tramites;

        return res.status(200).send('success');

    } catch (error) {
        console.error('Error al actualizar la asignación del funcionario:', error.message);
        return res.status(500).send('Error interno del servidor.');
    }
});

router.post('/modificar-recepcion-tramites', async (req, res) => {
    try {
        const { id_funcionario } = req.session.user;
        const { recepcion_tramites } = req.body;

        await Funcionario.update(
            { recepcion_tramites },
            { where: { id_funcionario } }
        );

        const updatedUser = await Funcionario.findOne({ where: { id_funcionario } });
        req.session.user.recepcion_tramites = updatedUser.recepcion_tramites;

        res.json({ success: true, message: 'Estado actualizado correctamente.' });
    } catch (error) {
        console.error('Error al actualizar el estado de recepción de trámites:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar el estado' });
    }
});


router.post('/conf-NumeroActa', async (req, res) => {
    try {
        const { id_funcionario } = req.session.user;
        const { numero_acta } = req.body;

        await Funcionario.update(
            { numero_acta },
            { where: { id_funcionario } }
        );

        const updatedUser = await Funcionario.findOne({ where: { id_funcionario } });
        req.session.user.numero_acta = updatedUser.numero_acta;

        return res.status(200).send('success');

    } catch (error) {
        console.error('Error al actualizar la asignación del funcionario:', error.message);
        return res.status(500).send('Error interno del servidor.');
    }
});


router.post('/conf-NombreCorto', async (req, res) => {
    try {
        const { id_funcionario } = req.session.user;
        const { nombre_funcionario_corto  } = req.body;

        await Funcionario.update(
            { nombre_funcionario_corto  },
            { where: { id_funcionario } }
        );

        const updatedUser = await Funcionario.findOne({ where: { id_funcionario } });
        req.session.user.nombre_funcionario_corto  = updatedUser.nombre_funcionario_corto ;

        return res.status(200).send('success');

    } catch (error) {
        console.error('Error al actualizar la asignación del funcionario:', error.message);
        return res.status(500).send('Error interno del servidor.');
    }
});


module.exports = router;
