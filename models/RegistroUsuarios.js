const { DataTypes } = require('sequelize');
const db = require('../db');

const RegistroUsuarios = db.define('registro-usuarios', {
  id_usuario: {
    type: DataTypes.STRING(13),
    primaryKey: true,
    autoIncrement: false,
  },
  tipo_id_usuario: {
    type: DataTypes.STRING(13),
    primaryKey: true,
    autoIncrement: false,
  },
  nombre_usuario: {
    type: DataTypes.STRING(45),
  },
  canton_usuario: {
    type: DataTypes.STRING(100),
  },
  celular_usuario: {
    type: DataTypes.STRING(10),
  },
  email_usuario: {
    type: DataTypes.STRING(10),
  },
  fecha_ultimo_proceso: {
    type: DataTypes.STRING(45),
  },
  id_funcionario: {
    type: DataTypes.STRING,
    allowNull: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true
  },
  id_centro_matriculacion: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  tableName: 'registro-usuarios',
  timestamps: false,
});

module.exports = RegistroUsuarios;
