
function cargarCantones() {
    const selectCantones = document.getElementById('canton_usuario'); 

    fetch('/ruta-para-obtener-cantones')
        .then((response) => response.json())
        .then((data) => {
            console.log('Datos obtenidos:', data);


            data.forEach((canton) => {
                const option = document.createElement('option');
                option.value = canton.id;
                option.textContent = canton.nombre;
                selectCantones.appendChild(option);
            });
        })
        .catch((error) => console.error('Error al obtener cantones:', error));
}


document.addEventListener('DOMContentLoaded', cargarCantones);

