const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PermisosUsuarios = sequelize.define('registro-permisos-funcionarios', {
  id_permiso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  id_funcionario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'funcionarios',
      key: 'id_funcionario',
    },
  },
  id_modulo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'registro-modulos',
      key: 'id_modulo',
    },
  },
  acceso: {
    type: DataTypes.STRING(5),
    defaultValue: 'true',
  },
  asignado_por: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  fecha_asignacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'registro-permisos-funcionarios',
  timestamps: false,
  indexes: [],
});

module.exports = PermisosUsuarios;

