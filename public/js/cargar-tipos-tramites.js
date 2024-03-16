
function cargarTiposTramites() {
    const selectTiposTramites = document.getElementById('tipo_tramite');

    fetch('/seleccionar-tipos-tramites')
        .then((response) => response.json())
        .then((data) => {
            console.log('Datos obtenidos:', data);

           
            data.forEach((tipo) => {
                const option = document.createElement('option');
                option.value = tipo.id;
                option.textContent = tipo.nombre;
                selectTiposTramites.appendChild(option);
            });
        })
        .catch((error) => console.error('Error al obtener tipos de trámites:', error));
}


document.addEventListener('DOMContentLoaded', cargarTiposTramites);
