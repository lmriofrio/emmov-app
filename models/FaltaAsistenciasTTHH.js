////////////////////////////////////
///// ==    ACTUALIZADO ==      ////
////////////////////////////////////


const { DataTypes } = require('sequelize');
const db = require('../config/db');

const FaltaAsistenciasTTHH = db.define('registro-faltas-asistencia', {
  id_registro: {
    type: DataTypes.INTEGER(15),
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  id_funcionario: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  nombre_funcionario: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  motivo: {
    type: DataTypes.STRING(90),
    allowNull: true
  },
  tiempo_descuento: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  id_funcionarioTTHH: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  nombre_funcionarioTTHH: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  fecha_registroTTHH: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  username_TTHH: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  notificado_email: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  email_notificado: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  fecha_notificación: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  fecha_justificacion: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  motivo_justificacion: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  observación_justificacion: {
    type: DataTypes.STRING(45),
    allowNull: true
  },


  fecha_eliminacion: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  observacion_eliminacion: {
    type: DataTypes.STRING(90),
    allowNull: true
  },
  id_funcionarioTTHH_eliminacion: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  nombre_funcionarioTTHH_eliminacion: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  username_TTHH_eliminacion: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  eliminado: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  id_funcionarioTTHH_justificacion: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  nombre_funcionarioTTHH_justificacion: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  username_TTHH_justificacion: {
    type: DataTypes.STRING(15),
    allowNull: true
  },

}, {
  tableName: 'registro-faltas-asistencia',
  timestamps: false,
  indexes: []
});

module.exports = FaltaAsistenciasTTHH; 
