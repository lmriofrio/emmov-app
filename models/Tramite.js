

const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 

const Tramite = sequelize.define('registro-tramites', {



  id_tramite: {
    type: DataTypes.INTEGER (11),
    primaryKey: true,
    autoIncrement: true
  },
  id_tramite_axis: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  tipo_tramite: {
    type: DataTypes.STRING (200),
    allowNull: true
  },
  numero_adhesivo: {
    type: DataTypes.STRING (45),
    allowNull: true 
  },
  numero_matricula: {
    type: DataTypes.STRING (45),
    allowNull: true 
  },
  numero_fojas: {
    type: DataTypes.STRING (5),
    allowNull: true 
  },

  /////////////////////////////////////
  // ==  MODELO USUARIO      ==      //  
  /////////////////////////////////////


  id_usuario: {
    type: DataTypes.STRING(13),
    allowNull: true  
  },
  nombre_usuario: {
    type: DataTypes.STRING (100),
    allowNull: true
  },
  canton_usuario: {
    type: DataTypes.STRING (100),
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
    type: DataTypes.STRING (12),
    allowNull: true
  },
  clase_vehiculo: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  tipo_vehiculo: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  tipo_peso: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  clase_transporte: {
    type: DataTypes.STRING (45),
    allowNull: true
  },


  /////////////////////////////////////
  // ==  TABLA REGISTRO-TRAMITES ==  //  
  /////////////////////////////////////


  fecha_emision_matricula: {
    type: DataTypes.STRING (45),
    allowNull: true
  },  
  fecha_caducidad_matricula: {
    type: DataTypes.STRING (45),
    allowNull: true
  }, 
  fecha_ultima_revision: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  fecha_ingreso: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  fecha_finalizacion: {
    type: DataTypes.STRING (45),
    allowNull: true
  },


  /////////////////////////////////////
  // ==  TABLA REGISTRO-TRAMITES ==  //  
  /////////////////////////////////////

  id_tramite_axis: {
    type: DataTypes.STRING (60),
    allowNull: true
  },
  pago_placas_entidad_bancaria: {
    type: DataTypes.STRING (60),
    allowNull: true
  },
  pago_placas_comprobante: {
    type: DataTypes.STRING (60),
    allowNull: true
  },
  pago_placas_fecha: {
    type: DataTypes.STRING (60),
    allowNull: true
  },
  pago_placas_valor: {
    type: DataTypes.STRING (10),
    allowNull: true
  },
  pago_placas_newservicio: {
    type: DataTypes.STRING (45),
    allowNull: true
  },

  ////////////////////////////////////
  ///// ==  BD EMPRESA ==         ////
  ////////////////////////////////////

  id_empresa: {
    type: DataTypes.STRING (20),
    allowNull: true
  },
  nombre_empresa: {
    type: DataTypes.STRING (100),
    allowNull: true
  },
  nombre_corto_empresa: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  estado_empresa: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  provincia_empresa: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  canton_empresa: {
    type: DataTypes.STRING (45),
    allowNull: true
  },


  ////////////////////////////////////
  ///// ==  MODELO FUNCIONARIO == ////
  ////////////////////////////////////

  id_funcionario: {
    type: DataTypes.INTEGER(15),
    allowNull: true 
  },
  nombre_funcionario: {
    type: DataTypes.STRING (45),
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING (45),
    allowNull: false,
  },


  ////////////////////////////////////
  ///// ==  MODELO CENTROMATR  == ////
  ////////////////////////////////////

  id_centro_matriculacion: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  nombre_centro_matriculacion: {
    type: DataTypes.STRING (45),
    allowNull: true
  },
  canton_centro_matriculacion: {
    type: DataTypes.STRING (100),
    allowNull: true
  },



}, {
 
  tableName: 'registro-tramites',
  timestamps: false 
});

module.exports = Tramite;
