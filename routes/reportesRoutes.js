const express = require('express');
const router = express.Router();
const Tramite = require('../models/Tramite');
const Funcionario = require('../models/Funcionario');
const { Op, Sequelize } = require('sequelize');
const { getChangeDate } = require('../utils/dateUtils');
const XLSX = require('xlsx');


router.get('/generar-reporte-diario', async (req, res) => {
    const { fecha_finalizacion, username } = req.query;

    const fecha_inicial = fecha_finalizacion
    const fecha_final = fecha_finalizacion

    // Obtener el cambio de fecha a travez de la funcionalidad utlisDate
    const { startOfDay, endOfDay } = getChangeDate(fecha_inicial, fecha_final);

    console.log('startOfDay',startOfDay);
    console.log('endOfDay',endOfDay);


    try {
        const tramites = await Tramite.findAll({
            where: {
                username,
                fecha_finalizacion: {
                    [Op.and]: [
                        { [Op.gte]: startOfDay },
                        { [Op.lte]: endOfDay }
                    ]
                }
            },
        });



        if (tramites.length > 0) {
            res.json({ success: true, tramites });
        } else {
            res.json({ success: false, message: 'Trámites no encontrados' });
        }
    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

router.get('/generar-reporte-especies', async (req, res) => {
    const { fecha_ingreso, fecha_final, username } = req.query;

    const fecha_inicial = fecha_ingreso;

    // Obtener el cambio de fecha a travez de la funcionalidad utlisDate
    const { startOfDay, endOfDay } = getChangeDate(fecha_inicial, fecha_final);
    try {
        const tramites = await Tramite.findAll({
            where: {
                fecha_ingreso: {
                    [Op.and]: [
                        { [Op.gte]: startOfDay },
                        { [Op.lte]: endOfDay }
                    ]
                },
                username
            }
        });

        if (tramites.length > 0) {
            res.json({ success: true, tramites, fecha_ingreso, fecha_final });
        } else {
            res.json({ success: false, message: 'Trámites no encontrados' });
        }
    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

router.get('/generar-reporte-tipo-vehiculo', async (req, res) => {
    const { fecha_ingreso, fecha_final, username } = req.query;

    const fecha_inicial = fecha_ingreso;

    // Obtener el cambio de fecha a travez de la funcionalidad utlisDate
    const { startOfDay, endOfDay } = getChangeDate(fecha_inicial, fecha_final);

    try {
        const tramites = await Tramite.findAll({
            where: {
                fecha_ingreso: {
                    [Sequelize.Op.between]: [startOfDay, endOfDay]
                },
                username
            }
        });

        if (tramites.length > 0) {
            res.json({ success: true, tramites, fecha_ingreso, fecha_final });
        } else {
            res.json({ success: false, message: 'Trámites no encontrados' });
        }
    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

router.get('/generar-reporte-tramites', async (req, res) => {
    const { fecha_ingreso, fecha_final, username } = req.query;

    const fecha_inicial = fecha_ingreso;

    // Obtener el cambio de fecha a travez de la funcionalidad utlisDate
    const { startOfDay, endOfDay } = getChangeDate(fecha_inicial, fecha_final);

    try {
        const tramites = await Tramite.findAll({
            where: {
                fecha_ingreso: {
                    [Sequelize.Op.between]: [startOfDay, endOfDay]
                },
                username
            }
        });

        if (tramites.length > 0) {
            res.json({ success: true, tramites, fecha_ingreso, fecha_final });
        } else {
            res.json({ success: false, message: 'Trámites no encontrados' });
        }
    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

router.get('/generar-reporte-domicilio', async (req, res) => {
    const { fecha_ingreso, fecha_final, username } = req.query;

    const fecha_inicial = fecha_ingreso;

    // Obtener el cambio de fecha a travez de la funcionalidad utlisDate
    const { startOfDay, endOfDay } = getChangeDate(fecha_inicial, fecha_final);

    try {
        const tramites = await Tramite.findAll({
            where: {
                fecha_ingreso: {
                    [Sequelize.Op.between]: [startOfDay, endOfDay]
                },
                username
            }
        });

        if (tramites.length > 0) {
            res.json({ success: true, tramites, fecha_ingreso, fecha_final });
        } else {
            res.json({ success: false, message: 'Trámites no encontrados' });
        }
    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

router.get('/generar-reporte-tramitesInformacion', async (req, res) => {
    const { fecha_inicial, fecha_final, username } = req.query;

    const username_funcionario_INFORMACION = username;

    // Obtener el cambio de fecha a travez de la funcionalidad utlisDate
    const { startOfDay, endOfDay } = getChangeDate(fecha_inicial, fecha_final,);


    try {
        const tramites = await Tramite.findAll({
            where: {
                username_funcionario_INFORMACION: username_funcionario_INFORMACION,
                fecha_ingreso_INFORMACION: {
                    [Sequelize.Op.between]: [startOfDay, endOfDay]
                },

            }
        });

        const tramitesDetalle = await Tramite.findAll({
            where: {
                username_funcionario_INFORMACION: username_funcionario_INFORMACION,
                fecha_ingreso_INFORMACION: {
                    [Sequelize.Op.between]: [startOfDay, endOfDay]
                },
            },
            order: [['fecha_ingreso_INFORMACION', 'ASC']]
        });

        res.json({ success: true, tramites, tramitesDetalle, fecha_inicial, fecha_final });

    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

router.get('/generar-reporte-general-tramites', async (req, res) => {

    const { id_empresa } = req.session.user;
    const { funcionarioSeleccionado, tipo_tramite, fecha_inicial, fecha_final, estado_tramite } = req.query;


    const { startOfDay, endOfDay } = getChangeDate(fecha_inicial, fecha_final,);

    const where = {
        id_empresa: id_empresa,
        fecha_ingreso: {
            [Op.and]: [
                { [Op.gte]: startOfDay },
                { [Op.lte]: endOfDay }
            ]
        }
    };

    if (funcionarioSeleccionado && funcionarioSeleccionado !== "TODOS") {
        where.id_funcionario = funcionarioSeleccionado;
    }

    if (tipo_tramite && tipo_tramite !== "TODOS") {
        where.tipo_tramite = tipo_tramite;
    }

    if (estado_tramite && estado_tramite !== "TODOS") {
        where.estado_tramite = estado_tramite;
    }

    try {
        const tramites = await Tramite.findAll({ where });
        const tramitesDetalle = await Tramite.findAll({ where });

        res.json({ success: true, tramites, tramitesDetalle });
    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

router.get('/generar-reporte-placas', async (req, res) => {
    const { fecha_inicial, fecha_final, cons_tipo_tramite, cons_clase_vehiculo, cons_funcionario } = req.query;

    let funcionario;

    const { startOfDay, endOfDay } = getChangeDate(fecha_inicial, fecha_final,);

    try {
        const whereClause = {
            fecha_ingreso: {
                [Op.between]: [startOfDay, endOfDay]
            }
        };

        if (cons_tipo_tramite) {
            if (cons_tipo_tramite === 'EMISION DE MATRICULA POR PRIMERA VEZ') {
                whereClause.tipo_tramite = 'EMISION DE MATRICULA POR PRIMERA VEZ';
            } else if (cons_tipo_tramite === 'DUPLICADO DE PLACAS') {
                whereClause.tipo_tramite = 'DUPLICADO DE PLACAS';
            } else if (cons_tipo_tramite.startsWith('CAMBIO DE SERVICIO')) {
                whereClause.tipo_tramite = { [Op.like]: 'CAMBIO DE SERVICIO%' };
            } else if (cons_tipo_tramite === 'TODOS') {
                whereClause.tipo_tramite = {
                    [Op.or]: [
                        'EMISION DE MATRICULA POR PRIMERA VEZ',
                        'DUPLICADO DE PLACAS',
                        { [Op.like]: 'CAMBIO DE SERVICIO%' }
                    ]
                };
            } else {
                return res.status(400).json({ success: false, message: 'error en el ingreso del tipo de trámite.' });
            }
        }

        if (cons_clase_vehiculo) {
            if (cons_clase_vehiculo === 'VEHICULO') {
                whereClause.clase_vehiculo_tipo = 'VEHICULO';
            } else if (cons_clase_vehiculo === 'MOTOCICLETA') {
                whereClause.clase_vehiculo_tipo = 'MOTOCICLETA';
            } else if (cons_clase_vehiculo !== 'TODOS') {
                return res.status(400).json({ success: false, message: 'Error en el ingreso de la clase del vehículo.' });
            }

        }

        if (cons_funcionario) {
            if (cons_funcionario !== 'TODOS') {
                whereClause.id_funcionario = cons_funcionario;
                funcionario = await Funcionario.findOne({
                    where: { id_funcionario: cons_funcionario },
                    attributes: ['nombre_funcionario']
                });
            } else {
                funcionario = 'TODOS';
            }

        }

        const tramites = await Tramite.findAll({
            where: whereClause
        });

        const count = tramites.length;

        if (count > 0) {
            res.json({ success: true, tramites, fecha_inicial, fecha_final, cons_tipo_tramite, cons_clase_vehiculo, funcionario });
        } else {
            res.json({ success: false, message: 'Trámites no encontrados' });
        }

    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});


router.get('/exportar-datos', async (req, res) => {
    const { fecha_inicial, fecha_final, cons_tipo_tramite, cons_clase_vehiculo, cons_funcionario } = req.query;

    console.log('Entro a la ruta de exportar');
    console.log('Fecha de ingreso recibida:', fecha_inicial);
    console.log('Fecha final recibida:', fecha_final);
    console.log('Tipo de trámite recibido:', cons_tipo_tramite);
    console.log('Tipo de vehiculo:', cons_clase_vehiculo);

    if (!fecha_inicial || !fecha_final) {
        return res.status(400).json({ success: false, message: 'Por favor ingresa fechas válidas.' });
    }

    const { startOfDay, endOfDay } = getChangeDate(fecha_inicial, fecha_final);

    try {
        const whereClause = {
            fecha_ingreso: { [Op.between]: [startOfDay, endOfDay] }
        };

        if (cons_tipo_tramite) {
            if (cons_tipo_tramite === 'EMISION DE MATRICULA POR PRIMERA VEZ') {
                whereClause.tipo_tramite = 'EMISION DE MATRICULA POR PRIMERA VEZ';
            } else if (cons_tipo_tramite === 'DUPLICADO DE PLACAS') {
                whereClause.tipo_tramite = 'DUPLICADO DE PLACAS';
            } else if (cons_tipo_tramite.startsWith('CAMBIO DE SERVICIO')) {
                whereClause.tipo_tramite = { [Op.like]: 'CAMBIO DE SERVICIO%' };
            } else if (cons_tipo_tramite === 'TODOS') {
                whereClause.tipo_tramite = {
                    [Op.or]: [
                        { [Op.eq]: 'EMISION DE MATRICULA POR PRIMERA VEZ' },
                        { [Op.eq]: 'DUPLICADO DE PLACAS' },
                        { [Op.like]: 'CAMBIO DE SERVICIO%' }
                    ]
                };
            } else {
                return res.status(400).json({ success: false, message: 'Error en el ingreso del tipo de trámite.' });
            }
        }

        if (cons_clase_vehiculo) {
            if (cons_clase_vehiculo === 'VEHICULO') {
                whereClause.clase_vehiculo_tipo = 'VEHICULO';
            } else if (cons_clase_vehiculo === 'MOTOCICLETA') {
                whereClause.clase_vehiculo_tipo = 'MOTOCICLETA';
            } else if (cons_clase_vehiculo !== 'TODOS') {
                return res.status(400).json({ success: false, message: 'Error en el ingreso de la clase del vehículo.' });
            }
        }

        if (cons_funcionario) {
            if (cons_funcionario !== 'TODOS') {
                whereClause.id_funcionario = cons_funcionario;
            }

        }

        const tramites = await Tramite.findAll({
            attributes: ['id_tramite_axis', 'tipo_tramite', 'id_usuario', 'nombre_usuario', 'placa', 'clase_vehiculo_tipo', 'clase_transporte', 'id_funcionario', 'nombre_funcionario', 'username', 'fecha_ingreso', 'pago_placas_entidad_bancaria', 'pago_placas_fecha', 'pago_placas_comprobante', 'pago_placas_valor', 'pago_placas_newservicio'],
            where: whereClause
        });

        const tramiteData = tramites.map(tramite => tramite.toJSON());

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(tramiteData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tramites');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        res.setHeader('Content-Disposition', 'attachment; filename="Pagos-de-placas.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);

    } catch (error) {
        console.error('Error al buscar trámites:', error.message, error.stack);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});


module.exports = router;



