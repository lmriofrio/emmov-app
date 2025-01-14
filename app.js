const express = require('express');
const session = require('express-session');
const favicon = require('serve-favicon');
const bcryptjs = require('bcryptjs');
const bodyParser = require('body-parser');
const config = require('./config');
const path = require('path');
const connection = require('./config/db');
const $ = require('jquery');
const fs = require('fs');
// Declarar los modelos
const Funcionario = require('./models/Funcionario');
const Tramite = require('./models/Tramite');
const Vehiculo = require('./models/Vehiculo');
const Usuario = require('./models/Usuario');
const CentroMatriculacion = require('./models/CentroMatriculacion');
const Empresa = require('./models/Empresa');
const Modulos = require('./models/Modulos');
const PermisosUsuarios = require('./models/PermisosUsuarios');
const InventarioPlacas = require('./models/InventarioPlacas');
const SeleccionarTipoTramites = require('./models/SeleccionarTipoTramites');

const util = require('util');

// Declarar funciones para poder utilizarlas
const { getRangeCurrentDay, getCurrentDay, getCurrentDaySimple, getChangeDate, getChangeDay } = require('./utils/dateUtils');
const { updateVehiculo, createVehiculo, createUsuario, actualizarUsuario, createTramite, updateTramite_placa, updateTramite_id_usuario, updateVehiculo_DateSRI } = require('./utils/saveUtils');
const { obtenerPermisosUsuario } = require('./utils/userUtils');

const cuentaRoutes = require('./routes/cuentaRoutes');
const reportesRoutes = require('./routes/reportesRoutes');
const guardarTramiteRoutes = require('./routes/guardarTramiteRoutes');
const visualizarTurnosRoutes = require('./routes/visualizarTurnosRoutes');
const gestionTramiteRoutes = require('./routes/gestionTramiteRoutes');
const buscarRoutes = require('./routes/buscarRoutes');
const gestionInventarioRoutes = require('./routes/gestionInventarioRoutes');

// Declarar los archivos de la carpeta utlils
const dateUtils = require('./utils/dateUtils');

const { Op, literal, Sequelize } = require('./config/db');

// Reorganizar por la funcionalidad dateUtils
const formatDate = dateString => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Guayaquil' };
  return date.toLocaleDateString('es-EC', options);
};
// Reorganizar por la funcionalidad dateUtils
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
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuración de Express para las seciones de los usuarios
app.use(session({
  secret: 't]nTsLU38>9v',
  resave: true,
  saveUninitialized: true
}));

// Sincronización de la base de datos
connection.sync()
  .then(() => {
    console.log('Base de datos sincronizada');
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  });


// Configuración de Express para servir los archivos estáticos desde 'node_modules y otras carpetas publicas'
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules'), { index: false, extensions: ['js'] }))
app.use('/routes', express.static(path.join(__dirname, 'routes'), { index: false, extensions: ['js'] }))
app.use('/public', express.static(path.join(__dirname, 'public'), { index: false, extensions: ['js'] }))
app.use('/utils', express.static(path.join(__dirname, 'utils'), { index: false, extensions: ['js'] }))

// Favicon.ico
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Inicio de la aplicacion web
app.listen(app.get('port'), () => {
  console.log('Aplicación ejecutándose en el puerto:', app.get('port'));
});

// Declaracion de rutas
app.use('/', cuentaRoutes);
app.use('/', reportesRoutes);
app.use('/', guardarTramiteRoutes);
app.use('/', visualizarTurnosRoutes);
app.use('/', gestionTramiteRoutes);
app.use('/', buscarRoutes);
app.use('/', buscarRoutes);
app.use('/', gestionInventarioRoutes);


// Traer los datos del json cantones
const cantonesPath = path.join(__dirname, 'data/cantones.json');
const cantonesData = fs.readFileSync(cantonesPath, 'utf8');
const cantones = JSON.parse(cantonesData);

// 3.- RUTAS                     
// Página de inicio (login)
// Se procesa la solicitud GET en la ruta raíz '/'

app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/home');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    try {
      const user = await Funcionario.findOne({ where: { username: username } });

      if (!user || !(await bcryptjs.compare(password, user.password))) {

        return res.json({ message: 'CREDENCIALES INCORRECTAS' });
      }
      if (user) {
        const userData = {
          id_funcionario: user.id_funcionario,
          username: user.username,
          nombre_funcionario: user.nombre_funcionario,
          nombre_funcionario_corto: user.nombre_funcionario_corto,
          rol_funcionario: user.rol_funcionario,
          nombre_puesto_funcionario: user.nombre_puesto_funcionario,
          jefatura_departamento: user.jefatura_departamento,
          area_laboral: user.area_laboral,
          id_empresa: user.id_empresa,
          nombre_empresa: user.nombre_empresa,
          nombre_corto_empresa: user.nombre_corto_empresa,
          nombre_empresa_logo: user.nombre_empresa_logo,
          provincia_empresa: user.provincia_empresa,
          canton_empresa: user.canton_empresa,
          estado_empresa: user.estado_empresa,
          id_centro_matriculacion: user.id_centro_matriculacion,
          nombre_centro_matriculacion: user.nombre_centro_matriculacion,
          canton_centro_matriculacion: user.canton_centro_matriculacion,
          recepcion_tramites: user.recepcion_tramites,
          tipo_ASIGNACION: user.tipo_ASIGNACION,
          oficina_ASIGNACION: user.oficina_ASIGNACION,
          usuario_ASIGNACION: user.usuario_ASIGNACION,
        };
        req.session.user = userData;

        const result = await obtenerPermisosUsuario(user.id_funcionario);

        req.session.permisos = result.permisos;

        return res.json({ success: true });
      }
    } catch (error) {
      console.error('Error al autenticar el usuario:', error);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  } else {
    return res.status(400).json({ success: false, message: 'Nombre de usuario y contraseña requeridos' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
    } else {
      res.render('login');
    }
  });
});


////////////////////////////////////////////////
//////////   MODULO DE MATRICULACION ///////////
////////////////////////////////////////////////

app.get('/matriculacion/reportes/reporte-diario', (req, res) => {
  if (req.session.user, req.session.permisos) {
    res.render('matriculacion/reportes/reporte-diario', { userData: req.session.user, permisos: req.session.permisos });
  } else {
    res.redirect('/login');
  }
});
app.post('/matriculacion/reportes/reporte-diario-pdf', (req, res) => {
  if (req.session.user, req.session.permisos) {
    const fecha_finalizacion_pdf = req.body.fecha_finalizacion_pdf;
    console.log('fecha_finalizacion_pdf:', fecha_finalizacion_pdf);
    res.render('matriculacion/reportes/reporte-diario-pdf', { userData: req.session.user, fecha_finalizacion_pdf, permisos: req.session.permisos });
  } else {
    res.redirect('/login');
  }
});

app.get('/matriculacion/reportes/reporte-especies', (req, res) => {
  if (req.session.user, req.session.permisos) {
    res.render('matriculacion/reportes/reporte-especies', { userData: req.session.user, permisos: req.session.permisos });
  } else {
    res.redirect('/login');
  }
});
app.post('/matriculacion/reportes/reporte-especies-pdf', (req, res) => {
  if (req.session.user, req.session.permisos) {
    const fecha_ingreso_PDF = req.body.fecha_ingreso_pdf;
    const fecha_final_PDF = req.body.fecha_final_pdf;

    res.render('matriculacion/reportes/reporte-especies-pdf', { userData: req.session.user, fecha_ingreso_PDF, fecha_final_PDF, permisos: req.session.permisos });
  } else {
    res.redirect('/login');
  }
});

app.get('/matriculacion/reportes/reporte-tipo-vehiculo', (req, res) => {
  if (req.session.user, req.session.permisos) {
    res.render('matriculacion/reportes/reporte-tipo-vehiculo', { userData: req.session.user, permisos: req.session.permisos });
  } else {
    res.redirect('/login');
  }
});
app.post('/matriculacion/reportes/reporte-tipo-vehiculo-pdf', (req, res) => {
  if (req.session.user, req.session.permisos) {
    const fecha_ingreso_PDF = req.body.fecha_ingreso_pdf;
    const fecha_final_PDF = req.body.fecha_final_pdf;

    res.render('matriculacion/reportes/reporte-tipo-vehiculo-pdf', { userData: req.session.user, fecha_ingreso_PDF, fecha_final_PDF, permisos: req.session.permisos });
  } else {
    res.redirect('/login');
  }
});

app.get('/matriculacion/reportes/reporte-domicilio', (req, res) => {
  if (req.session.user, req.session.permisos) {
    res.render('matriculacion/reportes/reporte-domicilio', { userData: req.session.user, permisos: req.session.permisos });
  } else {
    res.redirect('/login');
  }
});
app.post('/matriculacion/reportes/reporte-domicilio-pdf', (req, res) => {
  if (req.session.user, req.session.permisos) {
    const fecha_ingreso_PDF = req.body.fecha_ingreso_pdf;
    const fecha_final_PDF = req.body.fecha_final_pdf;

    res.render('matriculacion/reportes/reporte-domicilio-pdf', { userData: req.session.user, fecha_ingreso_PDF, fecha_final_PDF, permisos: req.session.permisos });
  } else {
    res.redirect('/login');
  }
});

app.get('/matriculacion/reportes/reporte-tramites', (req, res) => {
  if (req.session.user, req.session.permisos) {
    res.render('matriculacion/reportes/reporte-tramites', { userData: req.session.user, permisos: req.session.permisos });
  } else {
    res.redirect('/login');
  }
});
app.post('/matriculacion/reportes/reporte-tramites-pdf', (req, res) => {
  if (req.session.user, req.session.permisos) {
    const fecha_ingreso_PDF = req.body.fecha_ingreso_pdf;
    const fecha_final_PDF = req.body.fecha_final_pdf;

    res.render('matriculacion/reportes/reporte-tramites-pdf', { userData: req.session.user, fecha_ingreso_PDF, fecha_final_PDF, permisos: req.session.permisos });
  } else {
    res.redirect('/login');
  }
});


app.get('/matriculacion/registro-por-turno', async (req, res) => {
  try {

    if (req.session.user) {

      mostrarModal = true;

      const idTramite = req.query.id_tramite;

      // Busca el trámite por su ID
      const tramite = await Tramite.findByPk(idTramite);

      const username = req.session.user.username;

      const registrosTabla1 = await Tramite.findAll({
        where: {
          username,
          tipo_tramite: {
            [Sequelize.Op.notIn]: [
              'DUPLICADO DEL DOCUMENTO DE LA MATRICULA',
              'ESPECIE ANULADA',
              'TRANSFERENCIA DE DOMINIO',
              'CERTIFICADO UNICO VEHICULAR',
              'DUPLICADO DE PLACAS',
              'CERTIFICADO DE POSEER VEHICULO',
              'BLOQUEO DE VEHÍCULO',
              'DESBLOQUEO DE VEHÍCULO',
              'ACTUALIZACIÓN DE DATOS DEL VEHÍCULO'
            ]
          }
        },
        order: [['id_tramite', 'DESC']],
        limit: 5
      });

      registrosTabla1.forEach(tramite => {
        const fechaOriginal = tramite.fecha_ingreso;
        const fecha = new Date(fechaOriginal);
        fecha.setHours(fecha.getHours() + 5)
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const año = fecha.getFullYear();
        const fechaFormateada = `${dia}-${mes}-${año}`;
        tramite.fecha_ingreso = fechaFormateada;
      });


      const registrosTabla2 = await Tramite.findAll({
        where: {
          username,
          tipo_tramite: {
            [Sequelize.Op.notIn]: [
              'ADHESIVO ANULADO',
              'DUPLICADO DEL DOCUMENTO ANUAL DE CIRCULACION',
              'EMISION DEL DOCUMENTO ANUAL DE CIRCULACION',
              'CERTIFICADO UNICO VEHICULAR',
              'DUPLICADO DE PLACAS',
              'CERTIFICADO DE POSEER VEHICULO',
              'BLOQUEO DE VEHÍCULO',
              'DESBLOQUEO DE VEHÍCULO',
              'ACTUALIZACIÓN DE DATOS DEL VEHÍCULO'
            ]
          }
        },
        order: [['id_tramite', 'DESC']],
        limit: 5
      });

      registrosTabla2.forEach(tramite => {
        const fechaOriginal = tramite.fecha_ingreso;
        const fecha = new Date(fechaOriginal);
        fecha.setHours(fecha.getHours() + 5)
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const año = fecha.getFullYear();
        const fechaFormateada = `${dia}-${mes}-${año}`;
        tramite.fecha_ingreso = fechaFormateada;
      });

      const registrosTabla4 = await Tramite.findAll({
        where: {
          username,
          tipo_tramite: {
            [Sequelize.Op.in]: [
              'CERTIFICADO UNICO VEHICULAR',
              'DUPLICADO DE PLACAS',
              'CERTIFICADO DE POSEER VEHICULO',
              'BLOQUEO DE VEHÍCULO',
              'DESBLOQUEO DE VEHÍCULO',
              'ACTUALIZACIÓN DE DATOS DEL VEHÍCULO'
            ]
          }
        },
        order: [['id_tramite', 'DESC']],
        limit: 5
      });

      registrosTabla4.forEach(tramite => {
        const fechaOriginal = tramite.fecha_ingreso;
        const fecha = new Date(fechaOriginal);
        fecha.setHours(fecha.getHours() + 5)
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const año = fecha.getFullYear();
        const fechaFormateada = `${dia}-${mes}-${año}`;
        tramite.fecha_ingreso = fechaFormateada;
      });

      const currentDate = new Date();
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate();
      const currentDay = currentDate.getDate();
      //console.log('el año actual:', currentsYear);

      const tramitesAnual = await Tramite.count({
        where: {
          username,
          fecha_ingreso: {
            [Sequelize.Op.between]: [`${currentYear}-01-01`, `${currentYear}-12-31`]
          }
        }
      });

      const tramitesMensuales = await Tramite.count({
        where: {
          username,
          fecha_ingreso: {
            [Sequelize.Op.and]: [
              { [Sequelize.Op.gte]: `${currentYear}-${currentMonth}-01` },
              { [Sequelize.Op.lte]: `${currentYear}-${currentMonth}-${lastDayOfMonth}` }
            ]
          }
        }
      })

      const tramitesDiarios = await Tramite.count({
        where: {
          username,
          fecha_ingreso: {
            [Sequelize.Op.and]: [
              { [Sequelize.Op.gte]: `${currentYear}-${currentMonth}-${currentDay}` },
              { [Sequelize.Op.lte]: `${currentYear}-${currentMonth}-${currentDay} 23:59:59` }
            ]
          }
        }
      });

      const selectorTramites = new SeleccionarTipoTramites();
      const obtenerTiposTramitesAsync = util.promisify(selectorTramites.obtenerTiposTramites.bind(selectorTramites));
      const tiposTramites = await obtenerTiposTramitesAsync();

      //console.log('REGISTROS DE LA TABLA 1:', registrosTabla1);

      res.render('matriculacion/registro-por-turno', {
        tiposTramites, cantones, registrosTabla1, registrosTabla2, registrosTabla4, tramitesAnual, tramitesMensuales,
        tramitesDiarios, userData: req.session.user, tramite, permisos: req.session.permisos
      });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
});

app.get('/matriculacion/registro-diario', async (req, res) => {
  try {

    if (req.session.user, req.session.permisos) {

      mostrarModal = true;

      const username = req.session.user.username;

      const registrosTabla1 = await Tramite.findAll({
        where: {
          username,
          tipo_tramite: {
            [Sequelize.Op.notIn]: [
              'DUPLICADO DEL DOCUMENTO DE LA MATRICULA',
              'ESPECIE ANULADA',
              'TRANSFERENCIA DE DOMINIO',
              'CERTIFICADO UNICO VEHICULAR',
              'DUPLICADO DE PLACAS',
              'CERTIFICADO DE POSEER VEHICULO',
              'BLOQUEO DE VEHÍCULO',
              'DESBLOQUEO DE VEHÍCULO',
              'ACTUALIZACIÓN DE DATOS DEL VEHÍCULO'
            ]
          }
        },
        order: [['id_tramite', 'DESC']],
        limit: 5
      });

      registrosTabla1.forEach(tramite => {
        const fechaOriginal = tramite.fecha_ingreso;
        console.log(fechaOriginal);
        const fecha = new Date(fechaOriginal);
        fecha.setHours(fecha.getHours() + 5)
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const año = fecha.getFullYear();
        const fechaFormateada = `${dia}-${mes}-${año}`;
        tramite.fecha_ingreso = fechaFormateada;
      });


      const registrosTabla2 = await Tramite.findAll({
        where: {
          username,
          tipo_tramite: {
            [Sequelize.Op.notIn]: [
              'ADHESIVO ANULADO',
              'DUPLICADO DEL DOCUMENTO ANUAL DE CIRCULACION',
              'EMISION DEL DOCUMENTO ANUAL DE CIRCULACION',
              'CERTIFICADO UNICO VEHICULAR',
              'DUPLICADO DE PLACAS',
              'CERTIFICADO DE POSEER VEHICULO',
              'BLOQUEO DE VEHÍCULO',
              'DESBLOQUEO DE VEHÍCULO',
              'ACTUALIZACIÓN DE DATOS DEL VEHÍCULO'
            ]
          }
        },
        order: [['id_tramite', 'DESC']],
        limit: 5
      });

      registrosTabla2.forEach(tramite => {
        const fechaOriginal = tramite.fecha_ingreso;
        const fecha = new Date(fechaOriginal);
        fecha.setHours(fecha.getHours() + 5)
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const año = fecha.getFullYear();
        const fechaFormateada = `${dia}-${mes}-${año}`;
        tramite.fecha_ingreso = fechaFormateada;
      });

      const registrosTabla4 = await Tramite.findAll({
        where: {
          username,
          tipo_tramite: {
            [Sequelize.Op.in]: [
              'CERTIFICADO UNICO VEHICULAR',
              'DUPLICADO DE PLACAS',
              'CERTIFICADO DE POSEER VEHICULO',
              'BLOQUEO DE VEHÍCULO',
              'DESBLOQUEO DE VEHÍCULO',
              'ACTUALIZACIÓN DE DATOS DEL VEHÍCULO'
            ]
          }
        },
        order: [['id_tramite', 'DESC']],
        limit: 5
      });

      registrosTabla4.forEach(tramite => {
        const fechaOriginal = tramite.fecha_ingreso;
        const fecha = new Date(fechaOriginal);
        fecha.setHours(fecha.getHours() + 5)
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const año = fecha.getFullYear();
        const fechaFormateada = `${dia}-${mes}-${año}`;
        tramite.fecha_ingreso = fechaFormateada;
      });

      const currentDate = new Date();
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate();
      const currentDay = currentDate.getDate();

      const tramitesAnual = await Tramite.count({
        where: {
          username,
          fecha_ingreso: {
            [Sequelize.Op.between]: [`${currentYear}-01-01`, `${currentYear}-12-31`]
          }
        }
      });

      const tramitesMensuales = await Tramite.count({
        where: {
          username,
          fecha_ingreso: {
            [Sequelize.Op.and]: [
              { [Sequelize.Op.gte]: `${currentYear}-${currentMonth}-01` },
              { [Sequelize.Op.lte]: `${currentYear}-${currentMonth}-${lastDayOfMonth}` }
            ]
          }
        }
      })

      const tramitesDiarios = await Tramite.count({
        where: {
          username,
          fecha_ingreso: {
            [Sequelize.Op.and]: [
              { [Sequelize.Op.gte]: `${currentYear}-${currentMonth}-${currentDay}` },
              { [Sequelize.Op.lte]: `${currentYear}-${currentMonth}-${currentDay} 23:59:59` }
            ]
          }
        }
      });

      const selectorTramites = new SeleccionarTipoTramites();

      const tiposExcluir = ['ADHESIVO ANULADO', 'ESPECIE ANULADA', 'ESPECIE Y ADHESIVO ANULADO'];

      const obtenerTiposTramitesAsync = util.promisify(selectorTramites.obtenerTiposTramites.bind(selectorTramites));
      let tiposTramites = await obtenerTiposTramitesAsync();

      tiposTramites = tiposTramites.filter(tipo => !tiposExcluir.includes(tipo.tipo_tramite));

      res.render('matriculacion/registro-diario', {
        tiposTramites, cantones, registrosTabla1, registrosTabla2, registrosTabla4, tramitesAnual, tramitesMensuales,
        tramitesDiarios, userData: req.session.user, permisos: req.session.permisos
      });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
});

app.get('/matriculacion/registro-especie-anulada', async (req, res) => {
  try {

    if (req.session.user, req.session.permisos) {

      mostrarModal = true;

      const username = req.session.user.username;

      const registrosTabla4 = await Tramite.findAll({
        where: {
          username,
          tipo_tramite: {
            [Sequelize.Op.in]: [
              'ESPECIE ANULADA',
              'ESPECIE Y ADHESIVO ANULADO',
            ]
          }
        },
        order: [['id_tramite', 'DESC']],
        limit: 5
      });

      registrosTabla4.forEach(tramite => {
        const fechaOriginal = tramite.fecha_ingreso;
        const fecha = new Date(fechaOriginal);
        fecha.setHours(fecha.getHours() + 5)
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const año = fecha.getFullYear();
        const fechaFormateada = `${dia}-${mes}-${año}`;
        tramite.fecha_ingreso = fechaFormateada;
      });


      const selectorTramites = new SeleccionarTipoTramites();
      const obtenerTiposTramitesAsync = util.promisify(selectorTramites.obtenerTiposTramites.bind(selectorTramites));
      const tiposExcluir = ['ADHESIVO ANULADO', 'ESPECIE ANULADA', 'ESPECIE Y ADHESIVO ANULADO'];

      let tiposTramites = await obtenerTiposTramitesAsync();

      tiposTramites = tiposTramites.filter(tipo => tiposExcluir.includes(tipo.tipo_tramite));

      res.render('matriculacion/registro-especie-anulada', {
        tiposTramites, cantones, registrosTabla4, userData: req.session.user, permisos: req.session.permisos
      });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
});

app.get('/matriculacion/tramite-registrado', async (req, res) => {
  try {
    if (req.session.user, req.session.permisos) {
      const idTramite = req.query.id_tramite;

      const tramite = await Tramite.findByPk(idTramite);

      const fechaOriginal = tramite.fecha_ingreso;
      const fecha = new Date(fechaOriginal);
      fecha.setHours(fecha.getHours() + 5);
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const año = fecha.getFullYear();
      const hora = fecha.getHours().toString().padStart(2, '0');
      const minutos = fecha.getMinutes().toString().padStart(2, '0');

      const fecha_ingresoETC = `${dia}-${mes}-${año} ${hora}:${minutos}`;

      res.render('matriculacion/tramite-registrado', {
        userData: req.session.user, tramite, fecha_ingresoETC, permisos: req.session.permisos
      });

    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
});

app.get('/matriculacion/especie-anulada', async (req, res) => {
  try {
    if (req.session.user) {
      const idTramite = req.query.id_tramite;

      const tramite = await Tramite.findByPk(idTramite);

      const fechaOriginal = tramite.fecha_ingreso;
      const fecha = new Date(fechaOriginal);
      fecha.setHours(fecha.getHours() + 5);
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const año = fecha.getFullYear();
      const hora = fecha.getHours().toString().padStart(2, '0');
      const minutos = fecha.getMinutes().toString().padStart(2, '0');

      const fecha_ingresoETC = `${dia}-${mes}-${año} ${hora}:${minutos}`;

      res.render('matriculacion/especie-anulada', {
        userData: req.session.user, tramite, fecha_ingresoETC, permisos: req.session.permisos
      });

    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
});

app.get('/matriculacion/gestion-tramite/edicion-tramite', async (req, res) => {
  try {
    if (req.session.user) {
      const idTramite = req.query.id_tramite;

      const tramite = await Tramite.findByPk(idTramite);
      let fecha_ingreso = tramite.fecha_ingreso;
      let fecha_finalizacion = tramite.fecha_finalizacion;

      let fecha_inicial = fecha_ingreso;
      let { ChangeDay: fecha_ingreso_actualizada } = getChangeDay(fecha_inicial);
      fecha_ingreso = fecha_ingreso_actualizada;
      
      fecha_inicial = fecha_finalizacion;
      let { ChangeDay: fecha_final_actualizada } = getChangeDay(fecha_inicial);
      fecha_finalizacion = fecha_final_actualizada;
      
      //console.log('Trámite no encontrado', ChangeDay);

      const selectorTramites = new SeleccionarTipoTramites();
      const obtenerTiposTramitesAsync = util.promisify(selectorTramites.obtenerTiposTramites.bind(selectorTramites));
      const tiposTramites = await obtenerTiposTramitesAsync();

      if (tramite) {

        res.render('matriculacion/gestion-tramite/edicion-tramite', { userData: req.session.user, permisos: req.session.permisos, tramite, tiposTramites, cantones, fecha_ingreso, fecha_finalizacion });
      } else {

        res.status(404).json({ error: 'Trámite no encontrado' });
      }
    } else {

      res.redirect('/');
    }
  } catch (error) {
    console.error('Error al obtener el trámite por ID:', error);
    res.status(500).send('Error al obtener el trámite por ID');
  }
});
app.get('/matriculacion/gestion-tramite/registrar-pago-placas', async (req, res) => {
  try {
    if (req.session.user, req.session.permisos) {
      const idTramite = req.query.id_tramite;

      const tramite = await Tramite.findByPk(idTramite);

      let valor;
      let pago_placas_newservicio;

      if (tramite.clase_vehiculo_tipo === 'VEHICULO') {
        valor = '23.00';
      } else if (tramite.clase_vehiculo_tipo === 'MOTOCICLETA') {
        valor = '13.00';
      }

      if (tramite.clase_transporte === 'COMERCIAL') {
        pago_placas_newservicio = 'PUBLICO';
      } else if (tramite.clase_transporte === 'PUBLICO') {
        pago_placas_newservicio = 'PUBLICO';
      } else if (tramite.clase_transporte === 'PARTICULAR') {
        pago_placas_newservicio = 'PARTICULAR';
      } else if (tramite.clase_transporte === 'ESTATAL') {
        pago_placas_newservicio = 'ESTATAL';
      } else if (tramite.clase_transporte === 'MUNICIPAL') {
        pago_placas_newservicio = 'MUNICIPAL';
      }

      res.render('matriculacion/gestion-tramite/registrar-pago-placas', {
        userData: req.session.user, permisos: req.session.permisos, tramite, valor, pago_placas_newservicio
      });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error al obtener el trámite:', error);
    res.status(500).send('Error al obtener el trámite.');
  }
});



////////////////////////////////////////////////
//////////   MODULO DE INFORMACION ///////////
////////////////////////////////////////////////

app.get('/matriculacion/informacion/consulta-valor-matricula', async (req, res) => {
  try {

    if (req.session.user) {




      res.render('matriculacion/informacion/consulta-valor-matricula', {
        userData: req.session.user, permisos: req.session.permisos
      });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
});

app.get('/matriculacion/informacion/vista-turnos', async (req, res) => {
  try {

    if (req.session.user, req.session.permisos) {

      const { currentDaySimple } = getCurrentDaySimple();

      const usernameSesion = req.session.user.username;
      const idEmpresa = req.session.user.id_empresa;
      const estadoFuncionario = 'ACTIVO';

      //const recepcionTramites = 'HABILITADO';

      const funcionariosActivos = await Funcionario.findAll({
        where: { id_empresa: idEmpresa, estado_funcionario: estadoFuncionario },
        attributes: ['id_funcionario', 'nombre_funcionario']
      });


      res.render('matriculacion/informacion/vista-turnos', {
        usernameSesion, userData: req.session.user, funcionariosActivos, currentDaySimple, permisos: req.session.permisos
      });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
});

app.get('/matriculacion/agenda-turnos', async (req, res) => {
  try {

    if (req.session.user) {

      const { currentDaySimple } = getCurrentDaySimple();

      const usernameSesion = req.session.user.username;
      const idEmpresa = req.session.user.id_empresa;
      const estadoFuncionario = 'ACTIVO';
      //const recepcionTramites = 'HABILITADO';

      const funcionariosActivos = await Funcionario.findAll({
        where: { id_empresa: idEmpresa, estado_funcionario: estadoFuncionario },
        attributes: ['id_funcionario', 'nombre_funcionario']
      });


      res.render('matriculacion/agenda-turnos', {
        usernameSesion, userData: req.session.user, permisos: req.session.permisos, funcionariosActivos, currentDaySimple
      });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
});

app.get('/matriculacion/informacion/agregar-turno', async (req, res) => {
  try {
    if (req.session.user, req.session.permisos) {

      const selectorTramites = new SeleccionarTipoTramites();

      const obtenerTiposTramitesAsync = util.promisify(selectorTramites.obtenerTiposTramites.bind(selectorTramites));
      let tiposTramites = await obtenerTiposTramitesAsync();
      const tiposExcluir = ['ADHESIVO ANULADO', 'ESPECIE ANULADA', 'ESPECIE Y ADHESIVO ANULADO'];
      tiposTramites = tiposTramites.filter(tipo => !tiposExcluir.includes(tipo.tipo_tramite));

      const idEmpresa = req.session.user.id_empresa;
      const centrosMatriculacion = await CentroMatriculacion.findAll({
        where: { id_empresa: idEmpresa },
        attributes: ['id_centro_matriculacion', 'nombre_centro_matriculacion']
      });

      const estadoFuncionario = 'ACTIVO';

      const funcionariosActivos = await Funcionario.findAll({
        where: { id_empresa: idEmpresa, estado_funcionario: estadoFuncionario },
        attributes: ['id_funcionario', 'nombre_funcionario']
      });

      res.render('matriculacion/informacion/agregar-turno', {
        cantones, tiposTramites, centrosMatriculacion, funcionariosActivos, userData: req.session.user, permisos: req.session.permisos
      });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
});

app.get('/matriculacion/informacion/editar-turno', async (req, res) => {
  try {
    if (req.session.user) {

      const selectorTramites = new SeleccionarTipoTramites();

      const obtenerTiposTramitesAsync = util.promisify(selectorTramites.obtenerTiposTramites.bind(selectorTramites));

      const tiposTramites = await obtenerTiposTramitesAsync();

      const idTramite = req.query.id_tramite;

      const tramite = await Tramite.findByPk(idTramite);

      const idEmpresa = req.session.user.id_empresa;

      const centrosMatriculacion = await CentroMatriculacion.findAll({
        where: { id_empresa: idEmpresa },
        attributes: ['id_centro_matriculacion', 'nombre_centro_matriculacion']
      });

      const estadoFuncionario = 'ACTIVO';
      //const recepcionTramites = 'HABILITADO';

      const funcionariosActivos = await Funcionario.findAll({
        where: { id_empresa: idEmpresa, estado_funcionario: estadoFuncionario },
        attributes: ['id_funcionario', 'nombre_funcionario']
      });

      console.log(tramite)


      res.render('matriculacion/informacion/editar-turno', {
        tiposTramites,
        centrosMatriculacion, funcionariosActivos,
        userData: req.session.user,
        tramite,
        permisos: req.session.permisos
      });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
});


app.get('/matriculacion/informacion/turno-agregado', async (req, res) => {
  try {

    if (req.session.user, req.session.permisos) {

      const idTramite = req.query.id_tramite;
      const tramite = await Tramite.findByPk(idTramite);

      res.render('matriculacion/informacion/turno-agregado', {
        userData: req.session.user, tramite, permisos: req.session.permisos
      });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
});

app.get('/matriculacion/informacion/turno-pdf', async (req, res) => {
  try {
    if (req.session.user, req.session.permisos) {
      const idTramite = req.query.id_tramite;

      if (!idTramite) {
        return res.status(400).send('ID del trámite no proporcionado.');
      }

      const tramite = await Tramite.findByPk(idTramite);

      res.render('matriculacion/informacion/turno-pdf', {
        userData: req.session.user, permisos: req.session.permisos,
        tramite
      });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
});

app.get('/matriculacion/informacion/solicitud-pdf', async (req, res) => {
  try {
    if (req.session.user, req.session.permisos) {


      const id_empresa = req.session.user.id_empresa;
      const empresa = await Empresa.findByPk(id_empresa);

      const idTramite = req.query.id_tramite;

      if (!idTramite) {
        return res.status(400).send('ID del trámite no proporcionado.');
      }

      const tramite = await Tramite.findByPk(idTramite);

      res.render('matriculacion/informacion/solicitud-pdf', {
        userData: req.session.user, tramite, empresa, permisos: req.session.permisos
      });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
});

app.get('/matriculacion/informacion/reportes/reporte-informacion', async (req, res) => {
  try {

    if (req.session.user) {


      res.render('matriculacion/informacion/reportes/reporte-informacion', {
        userData: req.session.user, permisos: req.session.permisos
      });


    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
});
app.post('/matriculacion/informacion/reportes/reporte-informacion-pdf', async (req, res) => {
  try {

    if (req.session.user) {

      const fecha_ingreso_PDF = req.body.fecha_ingreso_pdf;
      const fecha_final_PDF = req.body.fecha_final_pdf;

      res.render('matriculacion/informacion/reportes/reporte-informacion-pdf', {
        userData: req.session.user, fecha_final_PDF, fecha_ingreso_PDF, permisos: req.session.permisos
      });


    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
});
app.post('/matriculacion/informacion/reportes/reporte-informacion-detalle', async (req, res) => {
  try {

    if (req.session.user) {

      const fecha_ingreso_PDF = req.body.fecha_ingreso_pdf;
      const fecha_final_PDF = req.body.fecha_final_pdf;

      res.render('matriculacion/informacion/reportes/reporte-informacion-detalle', {
        userData: req.session.user, fecha_final_PDF, fecha_ingreso_PDF, permisos: req.session.permisos
      });


    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
});





////////////////////////////////////////////////
//////////   REPORTES GENERALES ///////////
////////////////////////////////////////////////


app.get('/matriculacion/reportes-generales/reporte-general-tramites', async (req, res) => {
  if (req.session.user) {


    const selectorTramites = new SeleccionarTipoTramites();

    const obtenerTiposTramitesAsync = util.promisify(selectorTramites.obtenerTiposTramites.bind(selectorTramites));

    let tiposTramites = await obtenerTiposTramitesAsync();

    const tiposExcluir = ['ADHESIVO ANULADO', 'ESPECIE ANULADA', 'ESPECIE Y ADHESIVO ANULADO'];

    tiposTramites = tiposTramites.filter(tipo => !tiposExcluir.includes(tipo.tipo_tramite));

    const idEmpresa = req.session.user.id_empresa;

    const centrosMatriculacion = await CentroMatriculacion.findAll({
      where: { id_empresa: idEmpresa },
      attributes: ['id_centro_matriculacion', 'nombre_centro_matriculacion']
    });


    const funcionarios = await Funcionario.findAll({
      where: { id_empresa: idEmpresa },
      attributes: ['id_funcionario', 'nombre_funcionario']
    });
    res.render('matriculacion/reportes-generales/reporte-general-tramites', { userData: req.session.user, tiposTramites, centrosMatriculacion, funcionarios, permisos: req.session.permisos });
  } else {
    res.redirect('/login');
  }
});
app.post('/matriculacion/reportes-generales/reporte-general-tramites-pdf', async (req, res) => {
  if (req.session.user) {

    const funcionarioSeleccionado_pdf = req.body.funcionarioSeleccionado_pdf;
    const tipo_tramite_pdf = req.body.tipo_tramite_pdf;
    const fecha_ingreso_PDF = req.body.fecha_ingreso_pdf;
    const fecha_final_PDF = req.body.fecha_final_pdf;

    res.render('matriculacion/reportes-generales/reporte-general-tramites-pdf', { userData: req.session.user, fecha_ingreso_PDF, fecha_final_PDF, funcionarioSeleccionado_pdf, tipo_tramite_pdf, permisos: req.session.permisos });
  } else {
    res.redirect('/login');
  }
});

app.get('/matriculacion/reportes-generales/reporte-pago-placas', async (req, res) => {

  if (req.session.user, req.session.permisos) {

    const idEmpresa = req.session.user.id_empresa;

    const funcionarios = await Funcionario.findAll({
      where: { id_empresa: idEmpresa },
      attributes: ['id_funcionario', 'nombre_funcionario']
    });


    try {
      res.render('matriculacion/reportes-generales/reporte-pago-placas', {
        userData: req.session.user, funcionarios, permisos: req.session.permisos
      });
    } catch (error) {
      console.error('Error al obtener los trámites:', error);
      res.status(500).send('Error al obtener los trámites');
    }
  } else {
    res.redirect('/login');
  }
});






app.get('/perfil/configuracion-cuenta', async (req, res) => {
  if (req.session.user, req.session.permisos) {


    const usuarioAsignacion = req.session.user.usuario_ASIGNACION;

    const idFuncionario = req.session.user.id_funcionario;
    const idEmpresa = req.session.user.id_empresa;
    const estadoFuncionario = 'ACTIVO';

    const centrosMatriculacion = await CentroMatriculacion.findAll({
      where: { id_empresa: idEmpresa },
      attributes: ['id_centro_matriculacion', 'nombre_centro_matriculacion']
    });

    const funcionario = await Funcionario.findOne({
      where: { id_funcionario: idFuncionario }
    });

    console.log('funcionario', funcionario.numero_acta);

    const funcionariosActivos = await Funcionario.findAll({
      where: { id_empresa: idEmpresa, estado_funcionario: estadoFuncionario },
      attributes: ['id_funcionario', 'nombre_funcionario']
    });

    res.render('perfil/configuracion-cuenta', { userData: req.session.user, funcionario, centrosMatriculacion, funcionariosActivos, permisos: req.session.permisos });
  } else {
    res.redirect('/login');
  }
});



////////////////////////////////////////////////
//////////   MODULO DE CONSULTAS ///////////
////////////////////////////////////////////////



app.get('/consultar/consulta-vehiculo', async (req, res) => {

  if (req.session.user, req.session.permisos) {


    res.render('consultar/consulta-vehiculo', {

      userData: req.session.user, permisos: req.session.permisos
    });
  } else {

    res.redirect('/login');
  }
});
app.get('/consultar/consulta-persona', async (req, res) => {

  if (req.session.user, req.session.permisos) {


    res.render('consultar/consulta-persona', {

      userData: req.session.user, permisos: req.session.permisos
    });
  } else {

    res.redirect('/login');
  }
});
app.get('/consultar/consulta-tramite', async (req, res) => {

  if (req.session.user, req.session.permisos) {

    const funcionarios = await Funcionario.findAll({
    });
    res.render('consultar/consulta-tramite', {

      userData: req.session.user, funcionarios, permisos: req.session.permisos
    });

  } else {

    res.redirect('/login');
  }
});


app.get('/home', async (req, res) => {
  if (req.session.user, req.session.permisos) {


    res.render('home', { userData: req.session.user, permisos: req.session.permisos });
  } else {
    res.redirect('/');
  }
});



app.get('/agenda/ingreso-constitucion-juridica', (req, res) => {
  if (req.session.user) {
    res.render('agenda/ingreso-constitucion-juridica', { userData: req.session.user });
  } else {
    res.redirect('/login');
  }
});


//////////////////////////////////////////////////////////
//////////   MODULO DE INVENTARIO DE PLACAS   ///////////
/////////////////////////////////////////////////////////

app.get('/inventario-placas/inventario', (req, res) => {
  if (req.session.user, req.session.permisos) {
    res.render('inventario-placas/inventario', { userData: req.session.user, permisos: req.session.permisos });
  } else {
    res.redirect('/login');
  }
});

app.get('/inventario-placas/ingreso-placas/registro-placas-individual', async (req, res) => {
  if (req.session.user, req.session.permisos) {
    res.render('inventario-placas/ingreso-placas/registro-placas-individual', { userData: req.session.user, permisos: req.session.permisos });
  } else {
    res.redirect('/login');
  }
});

app.get('/inventario-placas/ingreso-placas/registro-placas-por-lotes-motocicleta', async (req, res) => {
  if (req.session.user, req.session.permisos) {
    res.render('inventario-placas/ingreso-placas/registro-placas-por-lotes-motocicleta', { userData: req.session.user, permisos: req.session.permisos });
  } else {
    res.redirect('/login');
  }
});

app.get('/inventario-placas/entrega-placas/seleccion-individual', (req, res) => {
  if (req.session.user, req.session.permisos) {
    res.render('inventario-placas/entrega-placas/seleccion-individual', { userData: req.session.user, permisos: req.session.permisos });
  } else {
    res.redirect('/login');
  }
});
app.get('/inventario-placas/entrega-placas/entregar-placa-individual', async (req, res) => {
  try {

    if (req.session.user && req.session.permisos) {

      const { id_inventario } = req.query;
      const id_funcionario = req.session.user.id_funcionario;

      let numeroActa = (await Funcionario.findOne({
        where: { id_funcionario: id_funcionario },
        attributes: ['numero_acta']
      }))?.get('numero_acta') || 0;

      numeroActa = Number(numeroActa) + 1;

      console.log(numeroActa);


      if (!id_inventario) {

        return res.status(400).send('El parámetro id_inventario es obligatorio');
      }

      const placaInventario = await InventarioPlacas.findOne({ where: { id_inventario } });

      let fecha_inicial = placaInventario.ingreso_fecha;

      let { ChangeDay } = getChangeDay(fecha_inicial);

      let fecha_formateada = ChangeDay;

      console.log('fecha', fecha_formateada);

      if (!placaInventario) {

        return res.status(404).send('No se encontró el inventario con el ID proporcionado');
      }


      res.render('inventario-placas/entrega-placas/entregar-placa-individual', {
        userData: req.session.user,
        permisos: req.session.permisos,
        placaInventario, numeroActa, fecha_formateada
      });
    } else {

      res.redirect('/login');
    }
  } catch (error) {

    console.error('Error al procesar la solicitud:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/inventario-placas/entrega-placas/entregar-placa-grupal', async (req, res) => {
  try {

    if (req.session.user && req.session.permisos) {


      const id_funcionario = req.session.user.id_funcionario;

      let numeroActa = (await Funcionario.findOne({
        where: { id_funcionario: id_funcionario },
        attributes: ['numero_acta']
      }))?.get('numero_acta') || 0;

      numeroActa = Number(numeroActa) + 1;

      console.log(numeroActa);



      res.render('inventario-placas/entrega-placas/entregar-placa-grupal', {
        userData: req.session.user,
        permisos: req.session.permisos,
        numeroActa
      });
    } else {

      res.redirect('/login');
    }
  } catch (error) {

    console.error('Error al procesar la solicitud:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/inventario-placas/entrega-placas/acta-entrega-pdf', async (req, res) => {
  try {

    if (req.session.user && req.session.permisos) {

      const { salida_id_funcionario, salida_fecha, salida_tipo_entrega, solicitante_id, salida_acta, salida_nombre_puesto_funcionario } = req.query;

      const funcionario = await Funcionario.findOne({ where: { id_funcionario: salida_id_funcionario } });

      const usuario = await Usuario.findOne({ where: { id_usuario: solicitante_id } });

      const placaInventario = await InventarioPlacas.findAll({
        where: {
          salida_id_funcionario: salida_id_funcionario,
          salida_tipo_entrega: salida_tipo_entrega,
          solicitante_id: solicitante_id,
          salida_acta: salida_acta,
          salida_fecha: {
            [Sequelize.Op.and]: [
              { [Sequelize.Op.gte]: salida_fecha },
              { [Sequelize.Op.lte]: salida_fecha }
            ]
          },
        }
      });

      const placaInventarioPlain = placaInventario.map(placa => placa.get({ plain: true }));

      res.render('inventario-placas/entrega-placas/acta-entrega-pdf', {
        userData: req.session.user,
        permisos: req.session.permisos,
        placaInventario: placaInventarioPlain,
        salida_id_funcionario,
        salida_fecha,
        solicitante_id,
        funcionario,
        usuario,
        salida_nombre_puesto_funcionario,
        salida_acta,
        salida_tipo_entrega
      });



    } else {

      res.redirect('/login');
    }
  } catch (error) {

    console.error('Error al procesar la solicitud:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/inventario-placas/ingreso-placas/placa-ingresada-unidad', async (req, res) => {
  try {

    if (req.session.user && req.session.permisos) {

      const idInventario = req.query.id_inventario;

      const placaInventario = await InventarioPlacas.findByPk(idInventario);

      const fechaOriginal = placaInventario.ingreso_fecha;
      const fecha = new Date(fechaOriginal);
      fecha.setHours(fecha.getHours() + 5);
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const año = fecha.getFullYear();
      const hora = fecha.getHours().toString().padStart(2, '0');
      const minutos = fecha.getMinutes().toString().padStart(2, '0');

      const fecha_ingresoETC = `${dia}-${mes}-${año} ${hora}:${minutos}`;

      res.render('inventario-placas/ingreso-placas/placa-ingresada-unidad', {
        userData: req.session.user,
        permisos: req.session.permisos,
        placaInventario,
        fecha_ingresoETC

      });
    } else {

      res.redirect('/login');
    }
  } catch (error) {

    console.error('Error al procesar la solicitud:', error);
    res.status(500).send('Error interno del servidor');
  }
});
app.get('/inventario-placas/ingreso-placas/placa-ingresada-lotes', async (req, res) => {
  try {

    if (req.session.user && req.session.permisos) {

      const { clase_vehiculo, clase_transporte, ubicacion, nombre_corto_empresa, ingreso_username, ingreso_fecha, cantidad, cantidadGenerar, placasGeneradas } = req.query;

      res.render('inventario-placas/ingreso-placas/placa-ingresada-lotes', {
        userData: req.session.user,
        permisos: req.session.permisos,
        clase_vehiculo,
        clase_transporte,
        ubicacion,
        ingreso_nombre_corto_empresa: nombre_corto_empresa,
        ingreso_username,
        ingreso_fecha,
        cantidad,
        cantidadGenerar,
        placasGeneradas

      });
    } else {

      res.redirect('/login');
    }
  } catch (error) {

    console.error('Error al procesar la solicitud:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/inventario-placas/entrega-placas/placa-entregada', async (req, res) => {
  try {

    if (req.session.user && req.session.permisos) {

      const { salida_id_funcionario, salida_fecha, salida_tipo_entrega, solicitante_id, salida_acta, salida_nombre_puesto_funcionario } = req.query;

      const funcionario = await Funcionario.findOne({ where: { id_funcionario: salida_id_funcionario } });

      const usuario = await Usuario.findOne({ where: { id_usuario: solicitante_id } });

      const placaInventario = await InventarioPlacas.findAll({
        where: {
          salida_id_funcionario: salida_id_funcionario,
          salida_tipo_entrega: salida_tipo_entrega,
          solicitante_id: solicitante_id,
          salida_acta: salida_acta,
          salida_fecha: {
            [Sequelize.Op.and]: [
              { [Sequelize.Op.gte]: salida_fecha },
              { [Sequelize.Op.lte]: salida_fecha }
            ]
          },
        }
      });

      const placaInventarioPlain = placaInventario.map(placa => placa.get({ plain: true }));

      res.render('inventario-placas/entrega-placas/placa-entregada', {
        userData: req.session.user,
        permisos: req.session.permisos,
        placaInventario: placaInventarioPlain,
        salida_id_funcionario,
        salida_fecha,
        solicitante_id,
        funcionario,
        usuario,
        salida_nombre_puesto_funcionario,
        salida_acta,
        salida_tipo_entrega

      });
    } else {

      res.redirect('/login');
    }
  } catch (error) {

    console.error('Error al procesar la solicitud:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/inventario-placas/ingreso-placas/seleccion', async (req, res) => {
  try {

    if (req.session.user && req.session.permisos) {



      res.render('inventario-placas/ingreso-placas/seleccion', {
        userData: req.session.user,
        permisos: req.session.permisos,


      });
    } else {

      res.redirect('/login');
    }
  } catch (error) {

    console.error('Error al procesar la solicitud:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/inventario-placas/modificar-registro', async (req, res) => {
  if (req.session.user, req.session.permisos) {
    res.render('inventario-placas/modificar-registro', { userData: req.session.user, permisos: req.session.permisos });
  } else {
    res.redirect('/login');
  }
});

app.get('/inventario-placas/seleccion-individual', (req, res) => {
  if (req.session.user, req.session.permisos) {
    res.render('inventario-placas/seleccion-individual', { userData: req.session.user, permisos: req.session.permisos });
  } else {
    res.redirect('/login');
  }
});
app.get('/inventario-placas/seleccion-grupal', (req, res) => {
  if (req.session.user, req.session.permisos) {
    res.render('inventario-placas/seleccion-grupal', { userData: req.session.user, permisos: req.session.permisos });
  } else {
    res.redirect('/login');
  }
});



//////////////////////////////////////////////////////////
//////////   SERVICIOS WEB                    ///////////
/////////////////////////////////////////////////////////

app.get('/servicios/consulta-placas-inventario', async (req, res) => {



  res.render('servicios/consulta-placas-inventario', {});

});



app.get('/node_modules/@tabler/icons/dist/cjs/tabler-icons.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'node_modules', '@tabler', 'icons', 'dist', 'cjs', 'tabler-icons.js'));
});