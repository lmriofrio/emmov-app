

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Tramite = sequelize.define('registro-tramites', {

  id_tramite: {
    type: DataTypes.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  id_tramite_axis: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  estado_tramite_axis: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  id_etapa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  estado_tramite: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  tipo_tramite: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  numero_adhesivo: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  numero_matricula: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  numero_certificacion: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  numero_fojas: {
    type: DataTypes.STRING(5),
    allowNull: true
  },

  ///////////////////////////////////////////////
  // ==  MODELO USUARIO     act 11-08-204      //  
  ///////////////////////////////////////////////


  id_usuario: {
    type: DataTypes.STRING(17),
    allowNull: true
  },
  tipo_id_usuario: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  nombre_usuario: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  provincia_usuario: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  canton_usuario: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  parroquia_usuario: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  direccion_usuario: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  celular_usuario: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  email_usuario: {
    type: DataTypes.STRING(100),
    allowNull: true
  },


  ////////////////////////////////////
  ///// ==  MODELO VEHICULO ==    ////
  ////////////////////////////////////

  placa: {
    type: DataTypes.STRING(12),
    allowNull: true
  },
  ramw: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  chasis: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  motor: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  pais_origen: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  marca: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  modelo: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  año_modelo: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  combustible: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  cilindraje: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  tipo_peso: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  clase_vehiculo_tipo: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  clase_vehiculo: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  tipo_vehiculo: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  clase_transporte: {
    type: DataTypes.STRING(45),
    allowNull: true
  },


  /////////////////////////////////////
  // ==  TABLA REGISTRO-TRAMITES ==  //  
  /////////////////////////////////////


  fecha_emision_matricula: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  fecha_caducidad_matricula: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  fecha_ultima_revision: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  fecha_ingreso: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  fecha_finalizacion: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  date_registraton: {
    type: DataTypes.STRING(45),
    allowNull: true
  },


  /////////////////////////////////////
  // ==  TABLA REGISTRO-TRAMITES ==  //  
  /////////////////////////////////////

  id_tramite_axis: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  pago_placas_entidad_bancaria: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  pago_placas_comprobante: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  pago_placas_fecha: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  pago_placas_valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  pago_placas_newservicio: {
    type: DataTypes.STRING(45),
    allowNull: true
  },

  ////////////////////////////////////
  ///// ==  BD EMPRESA ==         ////
  ////////////////////////////////////

  id_empresa: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  nombre_empresa: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  nombre_corto_empresa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  estado_empresa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  provincia_empresa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  canton_empresa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },

  ////////////////////////////////////
  ///// ==  MODELO FUNCIONARIO == ////
  ////////////////////////////////////

  entrega_informe_certificado_FINALIZACION: {
    type: DataTypes.STRING(10),
    allowNull: true 
  },
  id_funcionario: {
    type: DataTypes.INTEGER(15),
    allowNull: true
  },
  nombre_funcionario: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  username: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },

  ///////////////////////////////////////////////////////////////////////////
  ///// ==  MODELO FUNCIONARIO QUE INGRESA TRAMITES DESDE INFORMACION == ////
  ///////////////////////////////////////////////////////////////////////////

  solicitud_del_servicio_INFORMACION: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  numero_turno_INFORMACION: {
    type: DataTypes.INTEGER(11),
    allowNull: true,
  },
  id_funcionario_INFORMACION: {
    type: DataTypes.INTEGER(15),
    allowNull: true
  },
  username_funcionario_INFORMACION: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  nombre_funcionario_INFORMACION: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  fecha_ingreso_INFORMACION: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  valor_pago_INFORMACION: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
},
  observaciones_INFORMACION: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  id_funcionario_asignado_INFORMACION: {
    type: DataTypes.INTEGER(15),
    allowNull: true,
  },
  username_funcionario_asignado_INFORMACION: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  nombre_funcionario_asignado_INFORMACION: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  revision_tecnica_vehicular_TURNO: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  fecha_turno_RTV: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  verificacion_improntas_TURNO: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  cambio_servicio_TURNO: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  cambio_color_TURNO: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  cambio_motor_TURNO: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  observaciones_ELIMINACION: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  id_funcionario_ELIMINACION: {
    type: DataTypes.INTEGER(15),
    allowNull: true,
  },
  nombre_funcionario_ELIMINACION: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  username_funcionario_ELIMINACION: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },

  ////////////////////////////////////
  ///// ==  MODELO CENTROMATR  == ////
  ////////////////////////////////////

  id_centro_matriculacion: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  nombre_centro_matriculacion: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  canton_centro_matriculacion: {
    type: DataTypes.STRING(100),
    allowNull: true
  },

  //////////////////////////////////////////////////
  ///// ==  FECHA PARA PRESEMTAR EN LAS VISTAS == ////
  ///////////////////////////////////////////////////

  fecha_final_PRESENTACION: {
    type: DataTypes.STRING(45),
    allowNull: true
  },

  //////////////////////////////////////////////////
  ///// ==  MOTIVO DE ANULACIÓN DE ESPECIE ==   ////
  ///////////////////////////////////////////////////

  motivo_especie_anulada: {
    type: DataTypes.STRING(45),
    allowNull: true
  },

}, {

  tableName: 'registro-tramites',
  timestamps: false,
  indexes: []
});

module.exports = Tramite;



