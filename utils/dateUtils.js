/// Obtener el rango de fechas del día actual
function getRangeCurrentDay() {
    const currentDate = new Date();
    const localDate = new Date(currentDate.toLocaleString("en-US", { timeZone: "America/Guayaquil" }));

    const currentYear = localDate.getFullYear();
    const currentMonth = (localDate.getMonth() + 1).toString().padStart(2, '0');
    const currentDay = localDate.getDate().toString().padStart(2, '0');
    const startOfDay = `${currentYear}-${currentMonth}-${currentDay} 00:00:00`;
    const endOfDay = `${currentYear}-${currentMonth}-${currentDay} 23:59:59`;

    return { startOfDay, endOfDay };
}

/// Obtener la fecha actual
function getCurrentDay() {
    const currentDate = new Date();
    const localDate = new Date(currentDate.toLocaleString("en-US", { timeZone: "America/Guayaquil" }));

    const year = localDate.getFullYear();
    const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
    const day = localDate.getDate().toString().padStart(2, '0');
    const hours = localDate.getHours().toString().padStart(2, '0');
    const minutes = localDate.getMinutes().toString().padStart(2, '0');
    const seconds = localDate.getSeconds().toString().padStart(2, '0');

    const currentDay = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return { currentDay };
}

/// Obtener la fecha actual
function getCurrentDaySimple() {
    
    const currentDate = new Date();
    const localDate = new Date(currentDate.toLocaleString("en-US", { timeZone: "America/Guayaquil" }));

    const year = localDate.getFullYear();
    const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
    const day = localDate.getDate().toString().padStart(2, '0');

    const currentDaySimple = `${day}-${month}-${year}`;

    return { currentDaySimple };
}


/// Cambia la fecha inicial y final
function getChangeDate( fecha_inicial, fecha_final) {

    const DateStart = fecha_inicial;
    const DateEnd = fecha_final;

    //console.log(' fecha_inicial:',  fecha_inicial);
    //console.log('fecha_final:', fecha_final);

    const localDateS = new Date(DateStart.toLocaleString("en-US", { timeZone: "America/Guayaquil" }));
    const localDateF = new Date(DateEnd.toLocaleString("en-US", { timeZone: "America/Guayaquil" }));

    //console.log('localDateS:', localDateS);
    //console.log('localDateF:', localDateF);

    const startOfDay = `${DateStart} 00:00:00`;
    const endOfDay = `${DateEnd} 23:59:59`;

    //console.log('Fecha de recibida:', startOfDay);
    //console.log('Fecha de  recibida:', endOfDay);

    return { startOfDay, endOfDay };
}

/// Cambia una fecha
function getChangeDay(fecha_inicial) {
    console.log('Ingresa', fecha_inicial);

    const DateStart = new Date(fecha_inicial);

    DateStart.setHours(DateStart.getHours() + 5);

    const year = DateStart.getFullYear();
    const month = String(DateStart.getMonth() + 1).padStart(2, '0');
    const day = String(DateStart.getDate()).padStart(2, '0');
    const hours = String(DateStart.getHours()).padStart(2, '0');
    const minutes = String(DateStart.getMinutes()).padStart(2, '0');

    let ChangeDay = `${year}-${month}-${day} ${hours}:${minutes}`;

    console.log('Salida', ChangeDay);

    return { ChangeDay };
}






module.exports = { getRangeCurrentDay, getCurrentDay, getCurrentDaySimple, getChangeDate, getChangeDay };



