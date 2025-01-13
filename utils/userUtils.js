

const PermisosUsuarios = require('../models/PermisosUsuarios');

async function obtenerPermisosUsuario(id_funcionario) {
  try {

    const permisos = await PermisosUsuarios.findAll({
      where: { id_funcionario },
      attributes: ['id_modulo', 'acceso'],
    });

    const permisosSimplificados = permisos.map(({ id_modulo, acceso }) => ({
      id_modulo,
      acceso: acceso === 'true',
    }));

    return { success: true, permisos: permisosSimplificados };
  } catch (error) {
    console.error('Error al obtener los permisos del usuario:', error);
    return { success: false, message: 'Error interno del servidor' };
  }
}

module.exports = { obtenerPermisosUsuario};
