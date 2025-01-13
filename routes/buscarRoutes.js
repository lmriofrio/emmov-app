const express = require('express');
const router = express.Router();
const Tramite = require('../models/Tramite');
const Usuario = require('../models/Usuario');
const Vehiculo = require('../models/Vehiculo');
const InventarioPlacas = require('../models/InventarioPlacas');
const axios = require('axios');
const { Op } = require('sequelize');

router.get('/buscar-tramite', async (req, res) => {
    const { placa } = req.query;

    //console.log('Placa recibida:', placa);  
 
    try {
        const tramites = await Tramite.findAll({ 
            where: { placa },
            order: [['fecha_ingreso', 'ASC']], 
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

router.get('/buscar-tramite-filtro', async (req, res) => {
    
    const { placa } = req.query;

    const usernameSesion = req.session.user.username;

    //console.log('Placa recibida2:', placa);
    //console.log('Se realiza la consulta del vehiculo');  

    try {
        const tramites = await Tramite.findAll({
            where: {
                placa,
                estado_tramite: { [Op.or]: ['En proceso', 'Finalizado'] },
            },
            order: [['fecha_final_PRESENTACION', 'DESC']]
        });

        if (tramites.length > 0) {
            res.json({ success: true, tramites, usernameSesion});
        } else {
            res.json({ success: false, message: 'Trámites no encontrados' });
        }
    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

router.get('/buscar-tramite-filtro-seleccionado', async (req, res) => {
    
    const { tipoIdBusqueda, filtro } = req.query;

    console.log('tipoIdBusqueda:', tipoIdBusqueda); 
    console.log('filtro:', filtro); 
    
    if (tipoIdBusqueda === 'PLACA') {
        const tramites = await Tramite.findAll({
            where: {
                placa: filtro,
            },
            order: [['fecha_final_PRESENTACION', 'ASC']]
        });
       
        res.json({ success: true, tramites });

    } else if (tipoIdBusqueda === 'USUARIO') {

        console.log('tipoIdBusqueda:', tipoIdBusqueda); 

        const tramites = await Tramite.findAll({
            where: {
                id_funcionario: filtro,
            },
            order: [['fecha_final_PRESENTACION', 'ASC']]
        });
       
        res.json({ success: true, tramites });

    } else if (tipoIdBusqueda === 'CÉDULA') {

        console.log('tipoIdBusqueda:', tipoIdBusqueda); 

        const tramites = await Tramite.findAll({
            where: {
                id_usuario: filtro,
            },
            order: [['fecha_final_PRESENTACION', 'ASC']]
        });
       
        res.json({ success: true, tramites });

    } else {
        res.status(400).json({ message: 'Filtro no válido' });
    }
    
});

router.get('/buscar-tramite-id', async (req, res) => {
    const { idTramite } = req.query;

    try {
        const tramite = await Tramite.findByPk(idTramite);

        if (tramite !== null) {
            res.json({ success: true, tramite });
        } else {
            res.json({ success: false, message: 'Trámite no encontrado' });
        }
    } catch (error) {
        console.error('Error al buscar trámites:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

////////////////////////////////////
///// ==      USUARIO    ==     ////
////////////////////////////////////

router.post('/buscar-usuario', async (req, res) => {
    const { id_usuario } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { id_usuario } });

        if (usuario) {
            res.json({ success: true, usuario });
        } else {
            res.json({ success: false, message: 'usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al buscar el usuario:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});


////////////////////////////////////
///// ==      VEHICULO    ==    ////
////////////////////////////////////



router.post('/buscar-vehiculo', async (req, res) => {
    const { placa } = req.body;

    //console.log('Placa recibida:', placa);

    try {
        const vehiculo = await Vehiculo.findOne({ where: { placa } });

        if (vehiculo) {
            //console.log('Placa recibida:', vehiculo);
            res.json({ success: true, vehiculo });
        } else {
            res.json({ success: false, message: 'Vehículo no encontrado' });
        }
    } catch (error) {
        console.error('Error al buscar vehículo en la ruta:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});


router.post('/buscar-vehiculo-sri', async (req, res) => {
    const { id_vehiculo } = req.body;
    console.log('Placa que se va a enviar hacia el SRI:', id_vehiculo);

    try {

        const response = await axios.get(`https://srienlinea.sri.gob.ec/movil-servicios/api/v1.0/matriculacion/valor/${id_vehiculo}`);
        
        const vehiculo = response.data;
        //console.log('Datos recibidos:', vehiculo);

        if (vehiculo) {
            return res.json({ success: true, data: vehiculo });
        } else  {

            return res.json({ success: false, message: 'Vehículo no encontrado' });
            
        } 
    } catch (error) {

        if (error.response && error.response.status === 404) {
            return res.json({ success: false, message: 'Vehículo no encontrado en SRI' });
        }
        
        if (error.response && error.response.status === 503) {
            return res.status(503).json({ success: false, message: 'Servicio del SRI no disponible' });
        }

        console.error('Error al consultar la API del SRI:', error.message);
        return res.status(500).json({ success: false, message: 'Error en la consulta.', error: error.message });
    }
});

////////////////////////////////////
///// ==      PLACA EN EL INVENTARIO   ==    ////
////////////////////////////////////



router.get('/buscar-placa-id_inventario', async (req, res) => {
    const { id_inventario } = req.query; // Aquí cambias req.body por req.query porque es una solicitud GET
    console.log('ID de inventario recibido:', id_inventario);

    try {
        const placaInventario = await InventarioPlacas.findOne({ where: { id_inventario } });

        if (placaInventario) {
            res.json({ success: true, placaInventario });
        } else {
            res.json({ success: false, message: 'Trámite no encontrado' });
        }
    } catch (error) {
        console.error('Error al buscar trámite:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});





module.exports = router;