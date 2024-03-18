const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

class SeleccionarTipoTramites {
  obtenerTiposTramites(callback) {
    const query = 'SELECT * FROM `registro-tipo-tramites`';
    sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
      .then(results => {
        callback(null, results);
      })
      .catch(err => {
        console.error('Error al obtener tipos de trámites:', err);
        callback(err, null);
      });
  }
}

module.exports = SeleccionarTipoTramites;
