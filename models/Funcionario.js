////////////////////////////////////
///// ==    ACTUALIZADO ==      ////
////////////////////////////////////


const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Funcionario = db.define('Funcionario', {
  id_funcionario: {
    type: DataTypes.INTEGER(15),
    primaryKey: true,
    autoIncrement: false
  },
  nombre_funcionario: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  nombre_funcionario_corto: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  estado_funcionario: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  rol_funcionario: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  nombre_puesto_funcionario: {
    type: DataTypes.STRING(45),
    allowNull: true
  },

  jefatura_departamento: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  area_laboral: {
    type: DataTypes.STRING(45),
    allowNull: true
  },

  username: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(60),
    allowNull: false
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
  },
  nombre_empresa_logo: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  estado_empresa: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  provincia_empresa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  canton_empresa: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  id_centro_matriculacion: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  nombre_centro_matriculacion: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  canton_centro_matriculacion: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  recepcion_tramites: {
    type: DataTypes.STRING(45),
    allowNull: true
  },

  ///// ==    ASIGNACION DE TRAMITES ==      ////
  
  tipo_ASIGNACION: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  oficina_ASIGNACION: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  usuario_ASIGNACION: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  indice_asignacion: {
    type: DataTypes.INTEGER(11),
    allowNull: true
  },


  numero_acta: {
    type: DataTypes.STRING(45),
    allowNull: true
  },


}, {
  tableName: 'registro-funcionarios',
  timestamps: false,
  indexes: []
});

module.exports = Funcionario; 
