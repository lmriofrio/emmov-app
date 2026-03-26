const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TurnoBasico = sequelize.define('TurnoBasico', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  numero_turno: {
    type: DataTypes.STRING(10),
    allowNull: false
  },

  placa: {
    type: DataTypes.STRING(10),
    allowNull: false
  },

  servicio: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'MATRICULACION'
  },

  tramite: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  fecha_creacion: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: 'PENDIENTE'
  },
  identificacion_propietario: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  nombre_propietario: {
    type: DataTypes.STRING(200),
    allowNull: false
  },

}, {
  tableName: 'registro-turnos-basicos',
  timestamps: false
});

module.exports = TurnoBasico;