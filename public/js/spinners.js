document.addEventListener("DOMContentLoaded", function () {
    // Muestra el spinner cuando se inicia la carga de la página
    document.getElementById("spinner-wrapper").style.display = "flex";
});

window.addEventListener("load", function () {
    // Oculta el spinner cuando la página se ha cargado completamente
    document.getElementById("spinner-wrapper").style.display = "none";
});
