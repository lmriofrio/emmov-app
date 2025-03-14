const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Email = sequelize.define('registro-empresa-email', {


  id_empresa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  email_empresa_tthh: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  password_empresa_tthh: {
    type: DataTypes.STRING(120),
    allowNull: true
  },
  email_host_tthh: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  email_port_tthh: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
}, {

  tableName: 'registro-empresa-email',
  timestamps: false,
  indexes: []
});

module.exports = Email;

