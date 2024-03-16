const { DataTypes } = require('sequelize');
const db = require('../db');

const RegistroTramites = db.define('registro-tramites', {
  id_tramite: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  tipo_tramite: {  
    type: DataTypes.STRING(200),
    allowNull: true 
  },
  id_usuario: {
    type: DataTypes.STRING(13),
    allowNull: true 
  },
  nombre_usuario: {
    type: DataTypes.STRING(100),
    allowNull: true 
  },
  celular_usuario: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  email_usuario: {
    type: DataTypes.STRING(10),
    allowNull: true 
  },
  canton_usuario: {
    type: DataTypes.STRING(100),
    allowNull: true 
  },
  placa: {
    type: DataTypes.STRING(8),
  },
  clase_vehiculo: {
    type: DataTypes.STRING(45),
    allowNull: true 
  },
  clase_transporte: {
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
  numero_fojas: {
    type: DataTypes.STRING(45),
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
  id_funcionario: {
    type: DataTypes.STRING(45),
    allowNull: true 
  },
  username: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  nombre_funcionario: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  id_empresa: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  nombre_empresa: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  nombre_corto_empresa: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  estado_empresa: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  provincia_empresa: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  canton_empresa: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  id_centro_matriculacion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  nombre_centro_matriculacion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  canton_centro_matriculacion: {
    type: DataTypes.STRING,
    allowNull: true
  },

  id_tramite_axis: {
    type: DataTypes.STRING (60),
    allowNull: true
  },
  pago_placas_entidad_bancaria: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pago_placas_comprobante: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pago_placas_fecha: {
    type: DataTypes.STRING,
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

  

}, {
  tableName: 'registro-tramites',
  timestamps: false,
});

module.exports = RegistroTramites;
