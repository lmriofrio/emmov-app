// Importación de módulos
const moment = require('moment-timezone');

// Establecer la zona horaria de Node.js a Ecuador
moment.tz.setDefault('America/Guayaquil');

// Ahora, cuando necesites obtener la fecha actual en la zona horaria de Ecuador, puedes hacerlo así:
const fecha_actual_ecuador = moment().format();

const toastr = require('toastr');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const config = require('./config');
const path = require('path');
const db = require('./db');
const $ = require('jquery');
const Funcionario = require('./models/Funcionario');
const Vehiculo = require('./models/Vehiculo');
const Usuario = require('./models/Usuario');
const Canton = require('./models/Canton');
const CentroMatriculacion = require('./models/CentroMatriculacion');
const Tramite = require('./models/Tramite');
const favicon = require('serve-favicon');

const RegistroTramites = require('./models/RegistroTramites');
const RegistroVehiculos = require('./models/RegistroVehiculos');
const RegistroUsuarios = require('./models/RegistroUsuarios');
const PayOrder = require('./models/payOrder');
const SeleccionarTipoTramites = require('./models/SeleccionarTipoTramites');
const SeleccionarCantones = require('./models/SeleccionarCantones');
const util = require('util');
const { jsPDF } = require("jspdf");

const puppeteer = require('puppeteer');
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const tramiteRoutes = require('./routes/tramiteRoutes');
const reportesRoutes = require('./routes/reportesRoutes');
const placasRoutes = require('./routes/placasRoutes');

const MAX_ITEMS = 8;
const { Op, literal } = require('sequelize');


const formatDate = dateString => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Guayaquil' };
  return date.toLocaleDateString('es-EC', options);
};
const fechaHoraServidor = new Date();
console.log(fechaHoraServidor);



// Configuración de Express

const app = express();
module.exports = app;
app.set('port', config.app.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/js', express.static(__dirname + '/js'));

// Middleware para procesar datos en formularios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Configuración de Express para sesiones de usuario
app.use(session({
  secret: 't]nTsLU38>9v',
  resave: true,
  saveUninitialized: true
}));

// Sincronización de la base de datos
db.sync()
  .then(() => {
    console.log('Base de datos sincronizada');
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  });

// Configuración de Express para servir archivos estáticos desde 'node_modules'
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules'), { index: false, extensions: ['js'] }))
app.use('/routes', express.static(path.join(__dirname, 'routes'), { index: false, extensions: ['js'] }))
app.use('/public', express.static(path.join(__dirname, 'public'), { index: false, extensions: ['js'] }))
// Middleware para servir el favicon.ico
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Inicio de la app a travez del puerto
app.listen(app.get('port'), () => {
  console.log('Listening on port', app.get('port'));
});

// Usar la ruta para consultar vehiculos
app.use('/', vehiculoRoutes);
app.use('/', placasRoutes);
app.use('/', usuarioRoutes);
app.use('/', tramiteRoutes);
app.use('/', reportesRoutes);


//3.- RUTAS                     
// Página de inicio (login)
// Maneja la solicitud GET en la ruta raíz '/'
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/home');
  } else {
    res.redirect('/login');
  }
});

// Renderiza la página de inicio de sesión
app.get('/login', (req, res) => {
  res.render('login');
});

// En tu archivo app.js o donde configures tus rutas
app.post('/logout', (req, res) => {
  // Destruir la sesión
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
    } else {
      res.render('login');
    }
  });
});

app.get('/reportes-web', (req, res) => {
  res.render('reportes-web');
});
app.get('/reporte-diario', (req, res) => {

  if (req.session.user) {

    res.render('reporte-diario', { userData: req.session.user });
  } else {

    res.redirect('/login');
  }
});

app.get('/reporte-diario2', (req, res) => {

  if (req.session.user) {

    res.render('reporte-diario2', { userData: req.session.user });
  } else {

    res.redirect('/login');
  }
});



app.get('/configuracion-cuenta', (req, res) => {
  // Verificar si hay un usuario en sesión
  if (req.session.user) {
    // Renderizar la vista y pasar los datos del usuario
    res.render('configuracion-cuenta', { userData: req.session.user });
  } else {
    // Si no hay un usuario en sesión, redirigir a la página de inicio de sesión
    res.redirect('/login');
  }
});



app.get('/tramite-registrado', (req, res) => {

  if (req.session.user) {
    // Obtener los parámetros de consulta (si los hay)
    const { placa, tipo_tramite, id_tramite, id_usuario, nombre_usuario, clase_vehiculo, clase_transporte, numero_adhesivo, numero_matricula, username, fecha_ingreso, nombre_corto_empresa } = req.query;

    // Renderizar la vista y pasar los datos del usuario y los parámetros de consulta
    res.render('tramite-registrado', { userData: req.session.user, placa, id_tramite, tipo_tramite, id_usuario, nombre_usuario, clase_vehiculo, clase_transporte, numero_adhesivo, numero_matricula, username, fecha_ingreso, nombre_corto_empresa });
  } else {
    // Si no hay un usuario en sesión, redirigir a la página de inicio de sesión
    res.redirect('/login');
  }
});



app.get('/edicion-tramites', async (req, res) => {
  try {
    if (req.session.user) {
      const idTramite = req.query.id_tramite;

      // Busca el trámite por su ID utilizando Sequelize
      const tramite = await RegistroTramites.findByPk(idTramite);

      // Instanciar el selector de tipos de trámites
      const selectorTramites = new SeleccionarTipoTramites();
      const selectorCantones = new SeleccionarCantones();
      // Obtener tipos de trámites y cantones utilizando promisify para hacerlo compatible con async/await
      const obtenerTiposTramitesAsync = util.promisify(selectorTramites.obtenerTiposTramites.bind(selectorTramites));
      const obtenerCantonesAsync = util.promisify(selectorCantones.obtenerTiposCantones.bind(selectorCantones)); // Corregido el nombre de la función
      const tiposTramites = await obtenerTiposTramitesAsync();
      const tiposCantones = await obtenerCantonesAsync(); // Corregido el nombre de la variable
      // Renderizar la página registro-diario y pasar los tipos de trámites y MAX_ITEMS como datos

      if (tramite) {
        // Renderizar la vista edicion-tramites y pasar los datos necesarios como contexto
        res.render('edicion-tramites', { userData: req.session.user, tramite, tiposTramites, tiposCantones, });
      } else {
        // Si no se encuentra el trámite, redirigir con un mensaje de error
        res.status(404).json({ error: 'Trámite no encontrado' });
      }
    } else {
      // Si no hay sesión activa, redirigir a la página de inicio de sesión
      res.redirect('/');
    }
  } catch (error) {
    console.error('Error al obtener el trámite por ID:', error);
    res.status(500).send('Error al obtener el trámite por ID');
  }
});


app.get('/registrar-pago-placas', (req, res) => {
  // Verificar si hay un usuario en sesión
  if (req.session.user) {
    // Obtener los parámetros de consulta (si los hay)
    const { placa, tipo_tramite, id_tramite, id_usuario, nombre_usuario, clase_vehiculo, clase_transporte } = req.query;

    // Renderizar la vista y pasar los datos del usuario y los parámetros de consulta
    res.render('registrar-pago-placas', { userData: req.session.user, placa, id_tramite, tipo_tramite, id_usuario, nombre_usuario, clase_vehiculo, clase_transporte });
  } else {
    // Si no hay un usuario en sesión, redirigir a la página de inicio de sesión
    res.redirect('/login');
  }
});



app.get('/listado-tramites', async (req, res) => {

  if (req.session.user) {

    const usernameSesion = req.session.user.username;
    const totalRecords = await Tramite.count();
    const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

    // Página actual (obtenida de la consulta o predeterminada a 1)
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const offset = (page - 1) * PAGE_SIZE;

    const tramites = await Tramite.findAll({
      limit: PAGE_SIZE,
      offset: offset
    });

    console.log(' USERNAME EN SECION:  ', usernameSesion);

    res.render('listado-tramites', {
      usernameSesion,
      tramites,
      pageNum: page,
      totalPages: totalPages,
      formatDate
    });
  } else {

    res.redirect('/login');
  }
});


const PAGE_SIZE = 10;



app.get('/report-plate', async (req, res) => {
  try {
    const currentYear = moment().year(); // Obtener el año actual

    // Construir objeto de filtro para tipos de trámite y año actual
    const filter = {
      [Op.and]: [
        {
          tipo_tramite: {
            [Op.or]: [
              "CAMBIO DE SERVICIO DE COMERCIAL A PARTICULAR",
              "CAMBIO DE SERVICIO DE COMERCIAL A PUBLICO",
              "CAMBIO DE SERVICIO DE COMERCIAL A USO DE CUENTA PROPIA",
              "CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A COMERCIAL",
              "CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A PARTICULAR",
              "CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A PUBLICO",
              "CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A USO DE CUENTA PROPIA",
              "CAMBIO DE SERVICIO DE PARTICULAR A COMERCIAL",
              "CAMBIO DE SERVICIO DE PARTICULAR A ESTATAL U OFICIAL",
              "CAMBIO DE SERVICIO DE PARTICULAR A PUBLICO",
              "CAMBIO DE SERVICIO DE PARTICULAR A USO DE CUENTA PROPIA",
              "CAMBIO DE SERVICIO DE PARTICULAR A USO DIPLOMATICO U ORGANISMOS INTERNACIONALES",
              "CAMBIO DE SERVICIO DE PUBLICO A COMERCIAL",
              "CAMBIO DE SERVICIO DE PUBLICO A PARTICULAR",
              "CAMBIO DE SERVICIO DE PUBLICO A USO DE CUENTA PROPIA",
              "CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A COMERCIAL",
              "CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A PARTICULAR",
              "CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A PUBLICO",
              "DUPLICADO DE PLACAS",
              "EMISION DE MATRICULA POR PRIMERA VEZ"

            ]
          }
        },
        
        literal(`YEAR(fecha_ingreso) = ${currentYear}`)
      ]
    };

    
    const totalRecords = await Tramite.count({ where: filter });

    
    const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

    
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const offset = (page - 1) * PAGE_SIZE; 

    
    const tramites = await Tramite.findAll({
      where: filter,
      limit: PAGE_SIZE,
      offset: offset
    });

    res.render('report-plate', {
      tramites,
      pageNum: page,
      totalPages: totalPages,
      formatDate
    });
  } catch (error) {
    console.error('Error al obtener los datos de los trámites:', error);
    res.status(500).send('Error al obtener los datos de los trámites');
  }
});



app.get('/calcular-valores', async (req, res) => {
  try {
    // Obtener todos los registros de trámites
    const registros = await RegistroTramites.findAll();
    // Instanciar el selector de tipos de trámites
    const selectorTramites = new SeleccionarTipoTramites();
    // Obtener tipos de trámites utilizando promisify para hacerlo compatible con async/await
    const obtenerTiposTramitesAsync = util.promisify(selectorTramites.obtenerTiposTramites.bind(selectorTramites));
    const tiposTramites = await obtenerTiposTramitesAsync();
    // Renderizar la página calcular-valores y pasar los tipos de trámites como datos
    res.render('calcular-valores', { resultados: null, tiposTramites });
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
});
app.post('/calcular-valores', async (req, res) => {
  try {
    const { tramite, placa } = req.body;
    // Crear una instancia de la clase PayOrder
    const payOrder = new PayOrder(placa);
    // Calcular valores según el trámite
    payOrder.calcularValores(tramite);
    // Obtener y renderizar el reporte
    const resultados = payOrder.resultados;
    // Obtiene los tipos de trámites usando el modelo
    const seleccionarTipoTramites = new SeleccionarTipoTramites();
    // Obtener tipos de trámites utilizando promisify para hacerlo compatible con async/await
    const obtenerTiposTramitesAsync = util.promisify(seleccionarTipoTramites.obtenerTiposTramites.bind(seleccionarTipoTramites));
    const tiposTramites = await obtenerTiposTramitesAsync();
    // Renderiza la vista con los datos
    res.render('calcular-valores', { resultados, placa, tiposTramites });
  } catch (error) {
    console.error('Error :', error);
    res.status(500).send('Error ');
  }
});


app.get('/registro-diario', async (req, res) => {
  try {
    let mostrarModal = false;
    if (req.session.user) {
      mostrarModal = true;

      const username = req.session.user.username;

      const registros = await RegistroTramites.findAll({ where: { username } });

      // Filtrar los registros según los tipos de trámites deseados
      const registrosTabla1 = registros.filter(registro =>
        registro.tipo_tramite !== 'DUPLICADO DEL DOCUMENTO DE LA MATRICULA' &&
        registro.tipo_tramite !== 'ESPECIE ANULADA' &&
        registro.tipo_tramite !== 'TRANSFERENCIA DE DOMINIO' &&
        registro.tipo_tramite !== 'CERTIFICADO UNICO VEHICULAR' &&
        registro.tipo_tramite !== 'DUPLICADO DE PLACAS' &&
        registro.tipo_tramite !== 'CERTIFICADO DE POSEER VEHICULO' &&
        registro.tipo_tramite !== 'BLOQUEO DE VEHÍCULO' &&
        registro.tipo_tramite !== 'DESBLOQUEO DE VEHÍCULO' &&
        registro.tipo_tramite !== 'ACTUALIZACIÓN DE DATOS DEL VEHÍCULO'
      );

      const registrosTabla2 = registros.filter(registro =>
        registro.tipo_tramite !== 'ADHESIVO ANULADO' &&
        registro.tipo_tramite !== 'DUPLICADO DEL DOCUMENTO ANUAL DE CIRCULACION' &&
        registro.tipo_tramite !== 'EMISION DEL DOCUMENTO ANUAL DE CIRCULACION' &&
        registro.tipo_tramite !== 'CERTIFICADO UNICO VEHICULAR' &&
        registro.tipo_tramite !== 'DUPLICADO DE PLACAS' &&
        registro.tipo_tramite !== 'CERTIFICADO DE POSEER VEHICULO' &&
        registro.tipo_tramite !== 'BLOQUEO DE VEHÍCULO' &&
        registro.tipo_tramite !== 'DESBLOQUEO DE VEHÍCULO' &&
        registro.tipo_tramite !== 'ACTUALIZACIÓN DE DATOS DEL VEHÍCULO'
      );

      const registrosTabla3 = registros.filter(registro =>
        registro.tipo_tramite == 'CERTIFICADO UNICO VEHICULAR' ||
        registro.tipo_tramite == 'DUPLICADO DE PLACAS' ||
        registro.tipo_tramite == 'CERTIFICADO DE POSEER VEHICULO' ||
        registro.tipo_tramite == 'BLOQUEO DE VEHÍCULO' ||
        registro.tipo_tramite == 'DESBLOQUEO DE VEHÍCULO' ||
        registro.tipo_tramite == 'ACTUALIZACIÓN DE DATOS DEL VEHÍCULO'
      );

      // Selector
      const selectorTramites = new SeleccionarTipoTramites();
      const selectorCantones = new SeleccionarCantones();
      // Obtener tipos de trámites y cantones 
      const obtenerTiposTramitesAsync = util.promisify(selectorTramites.obtenerTiposTramites.bind(selectorTramites));
      const obtenerCantonesAsync = util.promisify(selectorCantones.obtenerTiposCantones.bind(selectorCantones));
      const tiposTramites = await obtenerTiposTramitesAsync();
      const tiposCantones = await obtenerCantonesAsync();

      //console.log('REGISTROS DE LA TABLA 1:', registrosTabla1);

      res.render('registro-diario', { registros, tiposTramites, tiposCantones, MAX_ITEMS, mostrarModal, registrosTabla1, registrosTabla2, registrosTabla3 });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
});


app.post('/guardar-tramite', async (req, res) => {
  try {

    const { id_funcionario, username, nombre_funcionario, id_empresa, nombre_empresa, nombre_corto_empresa, estado_empresa, provincia_empresa, canton_empresa, id_centro_matriculacion, nombre_centro_matriculacion, canton_centro_matriculacion } = req.session.user;

    const { placa, tipo_tramite, id_usuario, nombre_usuario, celular_usuario, email_usuario, canton_usuario, clase_vehiculo, clase_transporte, fecha_ingreso, numero_fojas, numero_adhesivo, numero_matricula } = req.body;

    // Ajustar la fecha de ingreso al huso horario de Ecuador

    if (placa.length >= 8) {
      $('#modalPlacaExtensa').modal('show');
      return;
    }

    // Guardar el nuevo trámite 
    const nuevoTramite = await RegistroTramites.create({
      placa, tipo_tramite, id_usuario, nombre_usuario, celular_usuario, email_usuario, canton_usuario, clase_vehiculo, clase_transporte, numero_fojas, numero_adhesivo, numero_matricula,
      id_funcionario, username, nombre_funcionario, id_empresa, nombre_empresa, nombre_corto_empresa, estado_empresa, provincia_empresa, canton_empresa, fecha_ingreso,
      fecha_finalizacion: fecha_ingreso, id_centro_matriculacion, nombre_centro_matriculacion, canton_centro_matriculacion
    });
    const id_tramite = nuevoTramite.id_tramite;

    console.log(' Nuevo trámite:', nuevoTramite);

    // Verificar si el vehículo ya existe 
    let vehiculo = await RegistroVehiculos.findOne({ where: { placa } });

    if (vehiculo) {
      // Si el vehículo ya existe, actualizar 
      await vehiculo.update({
        id_usuario, nombre_usuario, canton_usuario, celular_usuario, email_usuario, clase_vehiculo, clase_transporte,
        fecha_ultimo_proceso: fecha_ingreso, id_funcionario, username, id_centro_matriculacion
      });
    } else {
      // Si el vehículo no existe, crear 
      vehiculo = await RegistroVehiculos.create({
        placa, id_usuario, nombre_usuario, canton_usuario, celular_usuario, email_usuario, clase_vehiculo, clase_transporte,
        fecha_ultimo_proceso: fecha_ingreso, id_funcionario, username, id_centro_matriculacion
      });
    }

    // Verificar si el usuario ya existe
    let usuario = await RegistroUsuarios.findOne({ where: { id_usuario } });

    if (usuario) {
      // Si el usuario ya existe, actualizar 
      await usuario.update({
        nombre_usuario, canton_usuario, celular_usuario, email_usuario,
        fecha_ultimo_proceso: fecha_ingreso, id_funcionario, username, id_centro_matriculacion
      });
    } else {
      // Si el usuario no existe, crear 
      usuario = await RegistroUsuarios.create({
        id_usuario, nombre_usuario, canton_usuario, celular_usuario, email_usuario,
        fecha_ultimo_proceso: fecha_ingreso, id_funcionario, username, id_centro_matriculacion
      });
    }

    // Renderizar la vista con la informacion
    if (tipo_tramite === "CAMBIO DE SERVICIO DE COMERCIAL A PARTICULAR" ||
      tipo_tramite === "CAMBIO DE SERVICIO DE COMERCIAL A PUBLICO" ||
      tipo_tramite === "CAMBIO DE SERVICIO DE COMERCIAL A USO DE CUENTA PROPIA" ||
      tipo_tramite === "CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A COMERCIAL" ||
      tipo_tramite === "CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A PARTICULAR" ||
      tipo_tramite === "CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A PUBLICO" ||
      tipo_tramite === "CAMBIO DE SERVICIO DE ESTATAL U OFICIAL A USO DE CUENTA PROPIA" ||
      tipo_tramite === "CAMBIO DE SERVICIO DE PARTICULAR A COMERCIAL" ||
      tipo_tramite === "CAMBIO DE SERVICIO DE PARTICULAR A ESTATAL U OFICIAL" ||
      tipo_tramite === "CAMBIO DE SERVICIO DE PARTICULAR A PUBLICO" ||
      tipo_tramite === "CAMBIO DE SERVICIO DE PARTICULAR A USO DE CUENTA PROPIA" ||
      tipo_tramite === "CAMBIO DE SERVICIO DE PARTICULAR A USO DIPLOMATICO U ORGANISMOS INTERNACIONALES" ||
      tipo_tramite === "CAMBIO DE SERVICIO DE PUBLICO A COMERCIAL" ||
      tipo_tramite === "CAMBIO DE SERVICIO DE PUBLICO A PARTICULAR" ||
      tipo_tramite === "CAMBIO DE SERVICIO DE PUBLICO A USO DE CUENTA PROPIA" ||
      tipo_tramite === "CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A COMERCIAL" ||
      tipo_tramite === "CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A PARTICULAR" ||
      tipo_tramite === "CAMBIO DE SERVICIO DE USO DE CUENTA PROPIA A PUBLICO" ||
      tipo_tramite === "DUPLICADO DE PLACAS" ||
      tipo_tramite === "EMISION DE MATRICULA POR PRIMERA VEZ"
    ) {
      res.redirect(`/registrar-pago-placas?placa=${placa}&tipo_tramite=${tipo_tramite}&id_tramite=${id_tramite}&id_usuario=${id_usuario}&nombre_usuario=${nombre_usuario}&clase_vehiculo=${clase_vehiculo}&clase_transporte=${clase_transporte}&fecha_ingreso=${fecha_ingreso}&numero_adhesivo=${numero_adhesivo}&numero_matricula=${numero_matricula}&username=${username}&nombre_corto_empresa=${nombre_corto_empresa}`);
    } else {
      res.redirect(`/tramite-registrado?placa=${placa}&tipo_tramite=${tipo_tramite}&id_tramite=${id_tramite}&id_usuario=${id_usuario}&nombre_usuario=${nombre_usuario}&clase_vehiculo=${clase_vehiculo}&clase_transporte=${clase_transporte}&fecha_ingreso=${fecha_ingreso}&numero_adhesivo=${numero_adhesivo}&numero_matricula=${numero_matricula}&username=${username}&nombre_corto_empresa=${nombre_corto_empresa}`);
    }
  } catch (error) {
    console.error('Error al guardar el trámite:', error);
    res.status(500).send('Error al guardar el trámite');
  }
});

app.post('/reg-pago-placas', async (req, res) => {
  try {
    const { id_tramite, id_tramite_axis, pago_placas_entidad_bancaria, pago_placas_comprobante, pago_placas_fecha, pago_placas_valor, pago_placas_newservicio } = req.body;

    console.log('ID del trámite a actualizar:', id_tramite);
    console.log('Valores recibidos para actualizar:', {
      id_tramite_axis,
      pago_placas_entidad_bancaria,
      pago_placas_comprobante,
      pago_placas_fecha,
      pago_placas_valor,
      pago_placas_newservicio
    });

    // Verificar los valores recibidos en la solicitud
    console.log('Valores recibidos en la solicitud:', req.body);

    // Buscar el trámite por su ID
    console.log('Buscando el trámite por ID:', id_tramite);
    const tramite = await RegistroTramites.findOne({ where: { id_tramite } });

    if (tramite) {
      // Actualizar los campos del trámite con los nuevos valores
      console.log('Trámite encontrado. Actualizando campos...');
      tramite.id_tramite_axis = id_tramite_axis;
      tramite.pago_placas_entidad_bancaria = pago_placas_entidad_bancaria;
      tramite.pago_placas_comprobante = pago_placas_comprobante;
      tramite.pago_placas_newservicio = pago_placas_newservicio;

      const placa = tramite.placa;
      const tipo_tramite = tramite.tipo_tramite;
      const id_usuario = tramite.id_usuario;
      const nombre_usuario = tramite.nombre_usuario;
      const clase_vehiculo = tramite.clase_vehiculo;
      const clase_transporte = tramite.clase_transporte;
      const fecha_ingreso = tramite.fecha_ingreso;
      const numero_adhesivo = tramite.numero_adhesivo;
      const numero_matricula = tramite.numero_matricula;
      const username = tramite.username;
      const nombre_corto_empresa = tramite.nombre_corto_empresa;


      // Verificar si el valor de pago_placas_valor está vacío o no es un número válido
      if (!pago_placas_valor || isNaN(pago_placas_valor)) {
        // Si está vacío o no es un número válido, establecer el valor predeterminado a 0
        tramite.pago_placas_valor = 0;
      } else {
        // Si es un número válido, convertirlo a número decimal y asignarlo
        tramite.pago_placas_valor = parseFloat(pago_placas_valor);
      }


      // Verificar si la fecha de pago está presente y es válida
      if (pago_placas_fecha && pago_placas_fecha !== 'Invalid date') {
        tramite.pago_placas_fecha = pago_placas_fecha;
      } else {
        // Si no se proporciona una fecha válida, establecerla como null o cualquier otro valor predeterminado
        tramite.pago_placas_fecha = null; // O cualquier otro valor predeterminado que desees
      }

      tramite.pago_placas_valor = pago_placas_valor;

      // Guardar los cambios en la base de datos
      console.log('Guardando cambios en la base de datos...');
      await tramite.save();

      console.log('Trámite actualizado y guardado en la base de datos');

      // Redirigir a una página de éxito o mostrar un mensaje de éxito

      res.redirect(`/tramite-registrado?placa=${placa}&tipo_tramite=${tipo_tramite}&id_tramite=${id_tramite}&id_usuario=${id_usuario}&nombre_usuario=${nombre_usuario}&clase_vehiculo=${clase_vehiculo}&clase_transporte=${clase_transporte}&fecha_ingreso=${fecha_ingreso}&numero_adhesivo=${numero_adhesivo}&numero_matricula=${numero_matricula}&username=${username}&nombre_corto_empresa=${nombre_corto_empresa}`);
    } else {
      // Si no se encuentra el trámite, redirigir o mostrar un mensaje de error
      console.log('Trámite no encontrado');
      res.redirect('/error-tramite-no-encontrado');
    }
  } catch (error) {
    console.error('Error al actualizar el trámite:', error);
    res.status(500).send('Error al actualizar el trámite');
  }
});

app.post('/act-tramite', async (req, res) => {
  try {
    const { id_tramite, tipo_tramite, numero_adhesivo, numero_matricula, fecha_ingreso, numero_fojas, placa, clase_transporte, clase_vehiculo, id_usuario,
      nombre_usuario, canton_usuario, celular_usuario, email_usuario, pago_placas_entidad_bancaria, id_tramite_axis, pago_placas_comprobante, pago_placas_newservicio,
      pago_placas_valor, pago_placas_fecha, username, nombre_corto_empresa } = req.body;

    console.log('ID del trámite a actualizar:', id_tramite);
    console.log('Valores recibidos para actualizar:', {
      tipo_tramite, numero_adhesivo, numero_matricula, fecha_ingreso, numero_fojas, placa, clase_transporte, clase_vehiculo, id_usuario, nombre_usuario, canton_usuario,
      celular_usuario, email_usuario, pago_placas_entidad_bancaria, id_tramite_axis, pago_placas_comprobante, pago_placas_newservicio, pago_placas_valor, pago_placas_fecha,
      username, nombre_corto_empresa
    });

    // Verificar los valores recibidos en la solicitud
    console.log('Valores recibidos en la solicitud:', req.body);

    // Buscar el trámite por su ID
    console.log('Buscando el trámite por ID:', id_tramite);
    const tramite = await RegistroTramites.findOne({ where: { id_tramite } });

    if (tramite) {

      console.log('Trámite encontrado. Actualizando campos...');
      tramite.tipo_tramite = tipo_tramite;
      tramite.numero_adhesivo = numero_adhesivo;
      tramite.numero_matricula = numero_matricula;
      tramite.fecha_ingreso = fecha_ingreso;
      tramite.numero_fojas = numero_fojas;
      tramite.placa = placa;
      tramite.clase_transporte = clase_transporte;
      tramite.clase_vehiculo = clase_vehiculo;
      tramite.id_usuario = id_usuario;
      tramite.nombre_usuario = nombre_usuario;
      tramite.canton_usuario = canton_usuario;
      tramite.celular_usuario = celular_usuario;
      tramite.email_usuario = email_usuario;
      tramite.pago_placas_entidad_bancaria = pago_placas_entidad_bancaria;
      tramite.id_tramite_axis = id_tramite_axis;
      tramite.pago_placas_comprobante = pago_placas_comprobante;
      tramite.pago_placas_newservicio = pago_placas_newservicio;
      tramite.pago_placas_valor = pago_placas_valor;
      tramite.pago_placas_fecha = pago_placas_fecha;



      if (!pago_placas_valor || isNaN(pago_placas_valor)) {
        tramite.pago_placas_valor = 0;
      } else {
        tramite.pago_placas_valor = parseFloat(pago_placas_valor);
      }


      if (pago_placas_fecha && pago_placas_fecha !== 'Invalid date') {
        tramite.pago_placas_fecha = pago_placas_fecha;
      } else {
        tramite.pago_placas_fecha = null;
      }

      tramite.pago_placas_valor = pago_placas_valor;


      console.log('Guardando cambios en la base de datos...');
      await tramite.save();


      res.redirect(`/tramite-registrado?placa=${placa}&tipo_tramite=${tipo_tramite}&id_tramite=${id_tramite}&id_usuario=${id_usuario}&nombre_usuario=${nombre_usuario}&clase_vehiculo=${clase_vehiculo}&clase_transporte=${clase_transporte}&fecha_ingreso=${fecha_ingreso}&numero_adhesivo=${numero_adhesivo}&numero_matricula=${numero_matricula}&username=${username}&nombre_corto_empresa=${nombre_corto_empresa}`);
    } else {

      console.log('Trámite no encontrado');
      res.redirect('/error-tramite-no-encontrado');
    }
  } catch (error) {
    console.error('Error al actualizar el trámite:', error);
    res.status(500).send('Error al actualizar el trámite');
  }
});

app.post('/eliminar-tramite', async (req, res) => {
  try {
    const { id_tramite } = req.body;

    console.log('ID del trámite a eliminar:', id_tramite);

    // Buscar y eliminar el trámite por su ID
    console.log('Buscando el trámite por ID:', id_tramite);
    const tramite = await RegistroTramites.findByPk(id_tramite);

    if (tramite) {
      // Eliminar el trámite de la base de datos
      console.log('Trámite encontrado. Eliminando...');
      await tramite.destroy();

      console.log('Trámite eliminado');

      // Redirigir a una página de éxito o mostrar un mensaje de éxito
      res.render('home');
    } else {
      // Si no se encuentra el trámite, redirigir o mostrar un mensaje de error
      console.log('Trámite no encontrado');
      res.redirect('/error-tramite-no-encontrado');
    }
  } catch (error) {
    console.error('Error al eliminar el trámite:', error);
    res.status(500).send('Error al eliminar el trámite');
  }
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Funcionario.findOne({
      where: { username, password }
    });

    if (user) {
      // Obtener los datos del usuario
      const userData = {
        id_funcionario: user.id_funcionario,
        username: user.username,
        nombre_funcionario: user.nombre_funcionario,
        rol_funcionario: user.rol_funcionario,
        nombre_puesto_funcionario: user.nombre_puesto_funcionario,
        jefatura_departamento: user.jefatura_departamento,
        area_laboral: user.area_laboral,
        id_empresa: user.id_empresa,
        nombre_empresa: user.nombre_empresa,
        nombre_corto_empresa: user.nombre_corto_empresa,
        estado_empresa: user.estado_empresa,
        provincia_empresa: user.provincia_empresa,
        canton_empresa: user.canton_empresa,
        id_centro_matriculacion: user.id_centro_matriculacion,
        nombre_centro_matriculacion: user.nombre_centro_matriculacion,
        canton_centro_matriculacion: user.canton_centro_matriculacion,
      };
      req.session.user = userData;
      res.json({ success: true, user: userData });
    } else {
      // Mostrar notificación de error
      toastr.error('Inicio de sesión fallido. Verifica tus credenciales.');
      res.status(401).json({ success: false, message: 'Inicio de sesión fallido. Verifica tus credenciales.' });
    }
  } catch (error) {
    console.error('Error al autenticar el usuario:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

app.get('/home', (req, res) => {
  if (req.session.user) {
    // Si el usuario tiene una sesión activa, permite el acceso a home.html
    res.render('home');
  } else {
    // Si no hay sesión activa, redirige a la página de inicio de sesión
    res.redirect('/');
  }
});




app.get('/PDFreport-diario', (req, res) => {
  if (req.session.user) {

    res.render('PDFreport-diario', { userData: req.session.user });
  } else {

    res.redirect('/');
  }
});


app.get('/call-PDF-report-diario', (req, res) => {
  if (req.session.user) {
    // Llamar a la función generar-reporte-diario antes de renderizar la vista

    const fecha_ingresoPDF = req.query.fecha_ingreso;




    // Renderizar la vista PDFreport-diario con los datos del usuario
    res.render('reporte-diario2', { userData: req.session.user, fecha_ingresoPDF });
  } else {
    // Redirigir al inicio si no hay usuario en la sesión
    res.redirect('/');
  }
});




// Función para formatear la fecha
function obtenerFechaFormateada(fecha) {
  return new Date(fecha).toLocaleDateString();
}

// Ruta específica para servir tabler-icons.js
app.get('/node_modules/@tabler/icons/dist/cjs/tabler-icons.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'node_modules', '@tabler', 'icons', 'dist', 'cjs', 'tabler-icons.js'));
});