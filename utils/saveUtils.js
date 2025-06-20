const Vehiculo = require('../models/Vehiculo');
const Tramite = require('../models/Tramite');
const Usuario = require('../models/Usuario');
const FaltaAsistenciasTTHH = require('../models/FaltaAsistenciasTTHH');
const InventarioPlacas = require('../models/InventarioPlacas');
const { Op } = require('sequelize');


// Listo
async function createVehiculo({
    placa,
    ramw,
    chasis,
    motor,
    pais_origen,
    marca,
    modelo,
    año_modelo,
    combustible,
    cilindraje,
    tipo_peso,
    clase_vehiculo_tipo,
    clase_vehiculo,
    tipo_vehiculo,
    clase_transporte,
    id_usuario,
    tipo_id_usuario,
    nombre_usuario,
    provincia_usuario,
    canton_usuario,
    parroquia_usuario,
    direccion_usuario,
    celular_usuario,
    email_usuario,
    fecha_ultimo_proceso,
    id_funcionario,
    username,
    id_empresa,
    nombre_corto_empresa,
    id_centro_matriculacion }) {

    console.log('------   Vehículo no encontrado, creando desde SaveUtils -------');

    const tipo_id_usuarioUpper = (tipo_id_usuario || 'CÉDULA').toUpperCase();
    const id_usuarioUpper = id_usuario.toUpperCase();
    const nombre_usuarioUpper = nombre_usuario.toUpperCase();
    const placaMayus = placa.toUpperCase();
    const RamwMayus = (ramw || '').toUpperCase();

    vehiculo = await Vehiculo.create({
        placa: placaMayus,
        ramw: RamwMayus,
        chasis,
        motor,
        pais_origen,
        marca,
        modelo,
        año_modelo,
        combustible,
        cilindraje,
        tipo_peso,
        clase_vehiculo_tipo,
        clase_vehiculo,
        tipo_vehiculo,
        clase_transporte,
        id_usuario: id_usuarioUpper,
        tipo_id_usuario: tipo_id_usuarioUpper,
        nombre_usuario: nombre_usuarioUpper,
        provincia_usuario,
        canton_usuario,
        parroquia_usuario,
        direccion_usuario,
        celular_usuario,
        email_usuario,
        fecha_ultimo_proceso,
        id_funcionario,
        username,
        id_empresa,
        nombre_corto_empresa,
        id_centro_matriculacion
    });

    return {};
}
// Listo
async function updateVehiculo({
    placa,
    ramw,
    chasis,
    motor,
    pais_origen,
    marca,
    modelo,
    año_modelo,
    combustible,
    cilindraje,
    tipo_peso,
    clase_vehiculo_tipo,
    clase_vehiculo,
    tipo_vehiculo,
    clase_transporte,
    id_usuario,
    tipo_id_usuario,
    nombre_usuario,
    provincia_usuario,
    canton_usuario,
    parroquia_usuario,
    direccion_usuario,
    celular_usuario,
    email_usuario,
    fecha_ultimo_proceso,
    id_funcionario,
    username,
    id_empresa,
    nombre_corto_empresa,
    id_centro_matriculacion }) {

    let vehiculo = await Vehiculo.findOne({ where: { placa } });

    const tipo_id_usuarioUpper = (tipo_id_usuario || vehiculo.tipo_id_usuario || 'CÉDULA').toUpperCase();
    const id_usuarioUpper = id_usuario.toUpperCase();
    const nombre_usuarioUpper = nombre_usuario.toUpperCase();
    const RamwMayus = (ramw || vehiculo.ramw || '').toUpperCase();

    if (vehiculo) {
        console.log('------   Vehículo encontrado, actualizando desde SaveUtils -------');
        await vehiculo.update({
            ramw: RamwMayus,
            chasis,
            motor,
            pais_origen,
            marca,
            modelo,
            año_modelo,
            combustible,
            cilindraje,
            tipo_peso,
            clase_vehiculo_tipo,
            clase_vehiculo,
            tipo_vehiculo,
            clase_transporte,
            id_usuario: id_usuarioUpper,
            tipo_id_usuario: tipo_id_usuarioUpper,
            nombre_usuario: nombre_usuarioUpper,
            provincia_usuario,
            canton_usuario,
            parroquia_usuario,
            direccion_usuario,
            celular_usuario,
            email_usuario,
            fecha_ultimo_proceso,
            id_funcionario,
            username,
            id_empresa,
            nombre_corto_empresa,
            id_centro_matriculacion
        });

    }

    return {};
}

// Listo
async function updateVehiculo_DateSRI({
    placa,
    result_camvCpn,
    result_cilindraje,
    result_marca,
    result_modelo,
    result_anioModelo,
    result_paisFabricacion
}) {
    let vehiculo = await Vehiculo.findOne({ where: { placa } });

    if (vehiculo) {
        console.log('------ Vehículo encontrado, actualizando desde SaveUtils con DATE SRI -------');

        const camposAct = {
            ...(result_camvCpn && { ramw: result_camvCpn }),
            ...(result_cilindraje && { cilindraje: result_cilindraje }),
            ...(result_marca && { marca: result_marca }),
            ...(result_modelo && { modelo: result_modelo }),
            ...(result_anioModelo && { año_modelo: result_anioModelo }),
            ...(result_paisFabricacion && { pais_origen: result_paisFabricacion })
        };

        if (Object.keys(camposAct).length > 0) {
            await vehiculo.update(camposAct);
        } else {
            console.log('No se actualizaron campos porque todos los valores estaban vacíos o eran inválidos.');
        }
    }

    return {};
}

async function createUsuario({
    tipo_id_usuario, id_usuario, nombre_usuario, provincia_usuario, canton_usuario, parroquia_usuario, celular_usuario,
    email_usuario, direccion_usuario, fecha_ultimo_proceso, id_funcionario, username, id_centro_matriculacion }) {

    console.log('Usuario no encontrado, creando desde saveUtils');

    const tipo_id_usuarioUpper = (tipo_id_usuario || 'CÉDULA').toUpperCase();
    const id_usuarioUpper = id_usuario.toUpperCase();
    const nombre_usuarioUpper = nombre_usuario.toUpperCase();

    let usuario = await Usuario.create({
        tipo_id_usuario: tipo_id_usuarioUpper, id_usuario: id_usuarioUpper, nombre_usuario: nombre_usuarioUpper, provincia_usuario, canton_usuario, parroquia_usuario, celular_usuario,
        email_usuario, direccion_usuario, fecha_ultimo_proceso, id_funcionario, username, id_centro_matriculacion
    });

    return {};
}

// Listo
async function actualizarUsuario({
    id_usuario,
    tipo_id_usuario,
    nombre_usuario,
    provincia_usuario,
    canton_usuario,
    parroquia_usuario,
    direccion_usuario,
    celular_usuario,
    email_usuario,
    fecha_ultimo_proceso,
    id_funcionario,
    username,
    id_centro_matriculacion
}) {

    let usuario = await Usuario.findOne({ where: { id_usuario } });

    if (!usuario) {
        throw new Error(`Usuario con ID ${id_usuario} no encontrado.`);
    }

    const tipo_id_usuarioUpper = (tipo_id_usuario || usuario.tipo_id_usuario || 'CÉDULA').toUpperCase();
    const id_usuarioUpper = id_usuario.toUpperCase();
    const nombre_usuarioUpper = nombre_usuario.toUpperCase();

    console.log('------ Usuario encontrado, actualizando desde saveUtils -------');
    await usuario.update({
        id_usuario: id_usuarioUpper,
        tipo_id_usuario: tipo_id_usuarioUpper,
        nombre_usuario: nombre_usuarioUpper,
        provincia_usuario,
        canton_usuario,
        parroquia_usuario,
        direccion_usuario,
        celular_usuario,
        email_usuario,
        fecha_ultimo_proceso,
        id_funcionario,
        username,
        id_centro_matriculacion
    });

    return { success: true, message: 'Usuario actualizado correctamente.' };
}

// Listo
async function createTramite({
    id_tramite_axis,
    estado_tramite_axis,
    id_etapa,
    estado_tramite,
    tipo_tramite,
    numero_adhesivo,
    numero_matricula,
    numero_certificacion,
    numero_fojas,
    id_usuario,
    tipo_id_usuario,
    nombre_usuario,
    provincia_usuario,
    canton_usuario,
    parroquia_usuario,
    direccion_usuario,
    celular_usuario,
    email_usuario,
    placa,
    ramw,
    tipo_peso,
    clase_vehiculo_tipo,
    clase_vehiculo,
    tipo_vehiculo,
    clase_transporte,
    fecha_emision_matricula,
    fecha_caducidad_matricula,
    fecha_ultima_revision,
    fecha_ingreso,
    fecha_finalizacion,
    date_registraton,
    pago_placas_entidad_bancaria,
    pago_placas_comprobante,
    pago_placas_fecha,
    pago_placas_valor,
    pago_placas_newservicio,
    id_empresa,
    nombre_empresa,
    nombre_corto_empresa,
    estado_empresa,
    provincia_empresa,
    canton_empresa,
    entrega_informe_certificado_FINALIZACION,
    id_funcionario,
    nombre_funcionario,
    username,
    solicitud_del_servicio_INFORMACION,
    numero_turno_matriculacion_INFORMACION,
    numero_turno_rtv_INFORMACION,
    id_funcionario_INFORMACION,
    username_funcionario_INFORMACION,
    nombre_funcionario_INFORMACION,
    fecha_ingreso_INFORMACION,
    valor_pago_INFORMACION,
    observaciones_INFORMACION,
    id_funcionario_asignado_INFORMACION,
    username_funcionario_asignado_INFORMACION,
    nombre_funcionario_asignado_INFORMACION,
    fecha_turno_RTV,
    revision_tecnica_vehicular_TURNO,
    verificacion_improntas_TURNO,
    cambio_servicio_TURNO,
    cambio_color_TURNO,
    cambio_motor_TURNO,
    observaciones_ELIMINACION,
    id_funcionario_ELIMINACION,
    nombre_funcionario_ELIMINACION,
    username_funcionario_ELIMINACION,
    id_centro_matriculacion,
    nombre_centro_matriculacion,
    canton_centro_matriculacion,
    fecha_final_PRESENTACION,
    motivo_especie_anulada,
    result_informacion,
    result_total
}) {

    const tipo_id_usuarioUpper = (tipo_id_usuario || 'CÉDULA').toUpperCase();
    const id_usuarioUpper = (id_usuario || '').toUpperCase();
    const nombre_usuarioUpper = (nombre_usuario || '').toUpperCase();
    const placaMayus = (placa || '').toUpperCase();
    const RamwMayus = (ramw || '').toUpperCase();
    const motivo_especie_anuladaUpper = (motivo_especie_anulada || '').toUpperCase();

    const result_informacion_SRI = (result_informacion || '');
    const result_total_SRI = (result_total || '');

    console.log('------  Creando el nuevo trámite desde saveUtils  -------');

    const nuevoTramite = await Tramite.create({
        id_tramite_axis,
        estado_tramite_axis,
        id_etapa,
        estado_tramite,
        tipo_tramite,
        numero_adhesivo,
        numero_matricula,
        numero_certificacion,
        numero_fojas,
        id_usuario: id_usuarioUpper,
        tipo_id_usuario: tipo_id_usuarioUpper,
        nombre_usuario: nombre_usuarioUpper,
        provincia_usuario,
        canton_usuario,
        parroquia_usuario,
        direccion_usuario,
        celular_usuario,
        email_usuario,
        placa: placaMayus,
        ramw: RamwMayus,
        tipo_peso,
        clase_vehiculo_tipo,
        clase_vehiculo,
        tipo_vehiculo,
        clase_transporte,
        fecha_emision_matricula,
        fecha_caducidad_matricula,
        fecha_ultima_revision,
        fecha_ingreso,
        fecha_finalizacion,
        date_registraton,
        pago_placas_entidad_bancaria,
        pago_placas_comprobante,
        pago_placas_fecha,
        pago_placas_valor,
        pago_placas_newservicio,
        id_empresa,
        nombre_empresa,
        nombre_corto_empresa,
        estado_empresa,
        provincia_empresa,
        canton_empresa,
        entrega_informe_certificado_FINALIZACION,
        id_funcionario,
        nombre_funcionario,
        username,
        solicitud_del_servicio_INFORMACION,
        numero_turno_matriculacion_INFORMACION,
        numero_turno_rtv_INFORMACION,
        id_funcionario_INFORMACION,
        username_funcionario_INFORMACION,
        nombre_funcionario_INFORMACION,
        fecha_ingreso_INFORMACION,
        valor_pago_INFORMACION,
        observaciones_INFORMACION,
        id_funcionario_asignado_INFORMACION,
        username_funcionario_asignado_INFORMACION,
        nombre_funcionario_asignado_INFORMACION,
        fecha_turno_RTV,
        revision_tecnica_vehicular_TURNO,
        verificacion_improntas_TURNO,
        cambio_servicio_TURNO,
        cambio_color_TURNO,
        cambio_motor_TURNO,
        observaciones_ELIMINACION,
        id_funcionario_ELIMINACION,
        nombre_funcionario_ELIMINACION,
        username_funcionario_ELIMINACION,
        id_centro_matriculacion,
        nombre_centro_matriculacion,
        canton_centro_matriculacion,
        fecha_final_PRESENTACION,
        motivo_especie_anulada: motivo_especie_anuladaUpper,
        informacion_SRI: result_informacion_SRI,
        total_SRI: result_total_SRI,
    });

    const id_tramite = nuevoTramite.id_tramite;


    return { id_tramite, nuevoTramite };
}

// Listo
async function updateTramite_placa({
    id_tramite,
    placa,
}) {
    try {

        const vehiculo = await Vehiculo.findOne({ where: { placa } });

        if (!vehiculo) {
            throw new Error(`No se pudo econtrar el vehiculo : ${placa}`);
        }

        const tramite = await Tramite.findOne({ where: { id_tramite } });

        if (!tramite) {
            throw new Error(`No se pudo econtrar el tramite : ${id_tramite}`);
        }

        console.log('------  Actualizando el trámite desde saveUtils  -------');
        await tramite.update({
            ramw: vehiculo.ramw,
            chasis: vehiculo.chasis,
            motor: vehiculo.motor,
            pais_origen: vehiculo.pais_origen,
            marca: vehiculo.marca,
            modelo: vehiculo.modelo,
            año_modelo: vehiculo.año_modelo,
            combustible: vehiculo.combustible,
            cilindraje: vehiculo.cilindraje,
            tipo_peso: vehiculo.tipo_peso,
            clase_vehiculo_tipo: vehiculo.clase_vehiculo_tipo,
            clase_vehiculo: vehiculo.clase_vehiculo,
            tipo_vehiculo: vehiculo.tipo_vehiculo,
            clase_transporte: vehiculo.clase_transporte,
        });

        console.log(`El trámite con ID: ${id_tramite} fue actualizado exitosamente.`);
        return { success: true, message: 'Trámite actualizado correctamente' };
    } catch (error) {
        console.error('Error al actualizar el trámite:', error);
        return { success: false, message: error.message };
    }
}

// Listo
async function updateTramite_id_usuario({

    id_tramite,
    id_usuario,

}) {
    try {

        const usuario = await Usuario.findOne({ where: { id_usuario } });

        if (!usuario) {
            throw new Error(`No se pudo econtrar el usuario : ${id_usuario}`);
        }

        const tramite = await Tramite.findOne({ where: { id_tramite } });

        if (!tramite) {
            throw new Error(`No se pudo encontrar el tramite con el ID: ${id_tramite}`);
        }

        console.log('------  Actualizando el trámite desde saveUtils (updateTramite_id_usuario) -------');

        await tramite.update({
            tipo_id_usuario: usuario.tipo_id_usuario,
            nombre_usuario: usuario.nombre_usuario,
            provincia_usuario: usuario.provincia_usuario,
            canton_usuario: usuario.canton_usuario,
            parroquia_usuario: usuario.parroquia_usuario,
            direccion_usuario: usuario.direccion_usuario,
            celular_usuario: usuario.celular_usuario,
            email_usuario: usuario.email_usuario,
        });

        console.log(`El trámite con ID: ${id_tramite} fue actualizado exitosamente, desde (updateTramite_id_usuario) `);
        return { success: true, message: 'Trámite actualizado correctamente' };
    } catch (error) {
        console.error('Error al actualizar el trámite:', error);
        return { success: false, message: error.message };
    }
}


// Listo
async function createFaltaAsistencia({
    fecha,
    id_funcionario,
    nombre_funcionario,
    motivo,
    tiempo_descuento,
    id_funcionarioTTHH,
    nombre_funcionarioTTHH,
    fecha_registroTTHH,
    username_TTHH,
}) {

    console.log('------  Creando una falta de asistencia desde SaveUtils -------');

    FaltaAsistencia = await FaltaAsistenciasTTHH.create({
        fecha,
        id_funcionario,
        nombre_funcionario,
        motivo,
        tiempo_descuento,
        id_funcionarioTTHH,
        nombre_funcionarioTTHH,
        fecha_registroTTHH,
        username_TTHH,
        estado: 'NO JUSTIFICADO',
        eliminado: 'NO'
    });

    const id_registro = FaltaAsistencia.id_registro;

    return { id_registro };
}

// Listo
async function editarFaltaAsistencia({
    id_registro,
    fecha,
    id_funcionario,
    motivo,
    tiempo_descuento,
    estado,
    fecha_justificacion,
    motivo_justificacion,
    observación_justificacion,
}) {

    console.log('------  Editando una falta de asistencia desde SaveUtils -------');

    const faltaAsistenciasTTHH = await FaltaAsistenciasTTHH.findOne({ where: { id_registro } });

    if (!faltaAsistenciasTTHH) {
        throw new Error(`No se pudo econtrar el tramite : ${id_registro}`);
    }

    const fecha_justificacion2 = fecha_justificacion ? fecha_justificacion : faltaAsistenciasTTHH.fecha_justificacion;

    await faltaAsistenciasTTHH.update({
        fecha: fecha,
        id_funcionario: id_funcionario,
        motivo: motivo,
        tiempo_descuento: tiempo_descuento,
        estado: estado,
        fecha_justificacion: fecha_justificacion2,
        motivo_justificacion: motivo_justificacion,
        observación_justificacion: observación_justificacion,
    });

    console.log(`El trámite con ID: ${id_registro} fue actualizado exitosamente.`);

    return { id_registro };
}


// Listo
async function solicitarTurnos({
    startOfDay,
    endOfDay,
    oficina_ASIGNACION,
    id_centro_matriculacion_ASIGNACION_RTV

}) {

    console.log('------ Generando turnos desde saveUtils -------');

    // Buscar el último turno asignado (MATR) en el día actual
    const lastCurrentTurner = await Tramite.findOne({
        where: {
            fecha_final_PRESENTACION: {
                [Op.between]: [startOfDay, endOfDay]
            },
            fecha_turno_RTV: {
                [Op.between]: [startOfDay, endOfDay],
                [Op.ne]: null,
            },
            id_centro_matriculacion: oficina_ASIGNACION
        },
        order: [['numero_turno_matriculacion_INFORMACION', 'DESC']]
    });


    const TurnoMatr = lastCurrentTurner ? lastCurrentTurner.numero_turno_matriculacion_INFORMACION + 1 : 1;

    // Buscar el último turno asignado (RTV) en el día actual para una empresa
    const lastCurrentTurnerRTV = await Tramite.findOne({
        where: {
            fecha_turno_RTV: {
                [Op.between]: [startOfDay, endOfDay]
            },
            id_centro_matriculacion: id_centro_matriculacion_ASIGNACION_RTV
        },
        order: [['numero_turno_rtv_INFORMACION', 'DESC']]
    });

    const TurnoRtv = lastCurrentTurnerRTV ? lastCurrentTurnerRTV.numero_turno_rtv_INFORMACION + 1 : 1;

    return { TurnoMatr, TurnoRtv };
}


// Listo
async function editarInventarioPlacas({
    id_inventario,
    placa,
    clase_transporte,
    clase_vehiculo,
    cantidad,
    ubicacion,
}) {

    console.log('------  Editando una editarInventarioPlacas desde SaveUtils -------');

    const inventarioPlacas = await InventarioPlacas.findOne({ where: { id_inventario } });

    if (!inventarioPlacas) {
        throw new Error(`No se pudo econtrar el tramite : ${id_inventario}`);
    }


    await inventarioPlacas.update({
        placa: placa,
        clase_transporte: clase_transporte,
        clase_vehiculo: clase_vehiculo,
        cantidad: cantidad,
        ubicacion: ubicacion,
    });


    const id_inv = inventarioPlacas.id_inventario

    console.log(`El trámite con ID: ${id_inv} fue actualizado exitosamente.`);

    return { id_inv };
}




module.exports = { editarInventarioPlacas, solicitarTurnos, createVehiculo, updateVehiculo, createUsuario, actualizarUsuario, createTramite, updateTramite_placa, updateTramite_id_usuario, updateVehiculo_DateSRI, createFaltaAsistencia, editarFaltaAsistencia };




