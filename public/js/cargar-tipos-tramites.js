// Define una función para cargar los tipos de trámites
function cargarTiposTramites() {
    const selectTiposTramites = document.getElementById('tipo_tramite');

    fetch('/seleccionar-tipos-tramites')
        .then((response) => response.json())
        .then((data) => {
            console.log('Datos obtenidos:', data);

            // Llena el select con los datos obtenidos
            data.forEach((tipo) => {
                const option = document.createElement('option');
                option.value = tipo.id;
                option.textContent = tipo.nombre;
                selectTiposTramites.appendChild(option);
            });
        })
        .catch((error) => console.error('Error al obtener tipos de trámites:', error));
}

// Ejecuta la función cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', cargarTiposTramites);
