const { DataTypes } = require('sequelize');
const db = require('../config/db'); 

const RegistroVehiculos = db.define('registro-vehiculos', {
  placa: {
    type: DataTypes.STRING(13),
    allowNull: false,
    primaryKey: true,
  },
  clase_vehiculo: {
    type: DataTypes.STRING(45),
    allowNull: true 
  },
  clase_transporte: {
    type: DataTypes.STRING(45),
    allowNull: true 
  },
  id_usuario: {
    type: DataTypes.STRING(13),
    allowNull: false 
  },
  nombre_usuario: {
    type: DataTypes.STRING(45),
    allowNull: false 
  },
  canton_usuario: {
    type: DataTypes.STRING(100),
    allowNull: true 
  },
  celular_usuario: {
    type: DataTypes.STRING(10),
    allowNull: true 
  },
  email_usuario: {
    type: DataTypes.STRING(50),
    allowNull: true 
  },
  fecha_ultimo_proceso: {
    type: DataTypes.STRING(100),
    allowNull: true 
  },
  id_funcionario: {
    type: DataTypes.STRING(10),
    allowNull: true 
  },
  id_centro_matriculacion: {
    type: DataTypes.STRING(50),
    allowNull: true 
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: true 
  },


}, {
  tableName: 'registro-vehiculos',
  timestamps: false,
  indexes: []
});

module.exports = RegistroVehiculos;
