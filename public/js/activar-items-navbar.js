// Cuando el documento esté completamente cargado
$(function () {
    "use strict"; // Modo estricto de JavaScript
  
    // Obtener la URL actual y el camino relativo
    var url = window.location + "";
    var path = url.replace(
      window.location.protocol + "//" + window.location.host + "/",
      ""
    );
  
    // Seleccionar elementos de la barra lateral que coincidan con la URL actual o el camino relativo
    var element = $("ul#sidebarnav a").filter(function () {
      return this.href === url || this.href === path;
    });
  
    // Marcar elementos seleccionados en la barra lateral
    element.parentsUntil(".sidebar-nav").each(function (index) {
      if ($(this).is("li") && $(this).children("a").length !== 0) {
        $(this).children("a").addClass("active"); // Marcar enlace como activo
        $(this).parent("ul#sidebarnav").length === 0
          ? $(this).addClass("active") // Marcar elemento como activo si no es un elemento principal de la barra lateral
          : $(this).addClass("selected"); // Marcar elemento como seleccionado si es un elemento principal de la barra lateral
      } else if (!$(this).is("ul") && $(this).children("a").length === 0) {
        $(this).addClass("selected"); // Marcar elemento como seleccionado si no tiene enlace
      } else if ($(this).is("ul")) {
        $(this).addClass("in"); // Expandir menú desplegable
      }
    });
  
    // Marcar enlace como activo
    element.addClass("active");
  
    // Manejar clics en enlaces de la barra lateral
    $("#sidebarnav a").on("click", function (e) {
      if (!$(this).hasClass("active")) {
        // Ocultar otros menús desplegables y eliminar otras clases
        $("ul", $(this).parents("ul:first")).removeClass("in");
        $("a", $(this).parents("ul:first")).removeClass("active");
  
        // Mostrar el menú desplegable y marcar el enlace como activo
        $(this).next("ul").addClass("in");
        $(this).addClass("active");
      } else if ($(this).hasClass("active")) {
        // Si el enlace ya está activo, ocultar el menú desplegable
        $(this).removeClass("active");
        $(this).parents("ul:first").removeClass("active");
        $(this).next("ul").removeClass("in");
      }
    });
  
    // Evitar que los enlaces con menú desplegable se comporten como enlaces regulares
    $("#sidebarnav > li > a.has-arrow").on("click", function (e) {
      e.preventDefault();
    });
  });
  