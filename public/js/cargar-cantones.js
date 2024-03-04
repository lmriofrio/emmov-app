// Define una función para cargar los cantones
function cargarCantones() {
    const selectCantones = document.getElementById('canton_usuario'); // Reemplaza 'canton_usuario' con el ID de tu select de cantones

    fetch('/ruta-para-obtener-cantones') // Cambia '/ruta-para-obtener-cantones' por la ruta adecuada para obtener los cantones
        .then((response) => response.json())
        .then((data) => {
            console.log('Datos obtenidos:', data);

            // Llena el select con los datos obtenidos
            data.forEach((canton) => {
                const option = document.createElement('option');
                option.value = canton.id;
                option.textContent = canton.nombre;
                selectCantones.appendChild(option);
            });
        })
        .catch((error) => console.error('Error al obtener cantones:', error));
}

// Ejecuta la función cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', cargarCantones);

