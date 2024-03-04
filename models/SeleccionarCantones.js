const { DataTypes } = require('sequelize');
const sequelize = require('../db');

class SeleccionarCantones {
  obtenerTiposCantones(callback) {
    const query = 'SELECT * FROM `registro-cantones`';
    sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
      .then(results => {
        callback(null, results);
      })
      .catch(err => {
        console.error('Error al obtener los catones:', err);
        callback(err, null);
      });
  }
}

module.exports = SeleccionarCantones;
