////////////////////////////////////
///// ==    ACTUALIZADO ==      ////
////////////////////////////////////


const { DataTypes } = require('sequelize');
const db = require('../config/db');

const FuncionarioTTHH = db.define('Funcionario', {
  id_funcionario: {
    type: DataTypes.INTEGER(15),
    primaryKey: true,
    autoIncrement: false
  },
  nombre_funcionario: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  estado_funcionario: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  email_funcionario: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  id_empresa: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  nombre_empresa: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  nombre_corto_empresa: {
    type: DataTypes.STRING(45),
    allowNull: false
  }

}, {
  tableName: 'registro-funcionarios-tthh',
  timestamps: false,
  indexes: []
});

module.exports = FuncionarioTTHH; 
