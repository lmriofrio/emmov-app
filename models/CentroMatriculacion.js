////////////////////////////////////
///// ==    ACTUALIZADO ==      ////
////////////////////////////////////

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  

const CentroMatriculacion = sequelize.define('registro-centro-matriculacion', {
  id_centro_matriculacion: {
    type: DataTypes.STRING(45),
    primaryKey: true,
    autoIncrement: false
  },
  nombre_centro_matriculacion: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  canton_centro_matriculacion: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  id_empresa: {
    type: DataTypes.STRING(45),
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
  nombre_empresa_logo: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  provincia_empresa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  indice_asignacion: {
    type: DataTypes.INTEGER(11),
    allowNull: true
  },
  indice_ultima_actualizacion: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
 
  tableName: 'registro-centro-matriculacion',
  timestamps: false,
  indexes: []
});

module.exports = CentroMatriculacion;

