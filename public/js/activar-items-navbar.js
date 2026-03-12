$(function () {
  "use strict";
  var url = window.location + "";
  var path = url.replace(
    window.location.protocol + "//" + window.location.host + "/",
    ""
  );


  var element = $("ul#sidebarnav a").filter(function () {
    return this.href === url || this.href === path;
  });


  element.parentsUntil(".sidebar-nav").each(function (index) {
    if ($(this).is("li") && $(this).children("a").length !== 0) {
      $(this).children("a").addClass("active");
      $(this).parent("ul#sidebarnav").length === 0
        ? $(this).addClass("active")
        : $(this).addClass("selected");
    } else if (!$(this).is("ul") && $(this).children("a").length === 0) {
      $(this).addClass("selected");
    } else if ($(this).is("ul")) {
      $(this).addClass("in");
    }
  });


  element.addClass("active");


  $("#sidebarnav a").on("click", function (e) {
    if (!$(this).hasClass("active")) {

      $("ul", $(this).parents("ul:first")).removeClass("in");
      $("a", $(this).parents("ul:first")).removeClass("active");


      $(this).next("ul").addClass("in");
      $(this).addClass("active");
    } else if ($(this).hasClass("active")) {

      $(this).removeClass("active");
      $(this).parents("ul:first").removeClass("active");
      $(this).next("ul").removeClass("in");
    }
  });


  $("#sidebarnav > li > a.has-arrow").on("click", function (e) {
    e.preventDefault();
  });
});


$(document).ready(function () {
  "use strict";

  const currentPath = window.location.pathname;
  const $header = $(".app-header");

  $header.find(".nav-item.border-end").removeClass("active");

  $header.find(".nav-item.border-end").each(function () {
    const $li = $(this);
    const $link = $li.children("a").first();

    if (!$link.length) return;

    const href = $link.attr("href");

    if (href && href !== "javascript:void(0)" && href === currentPath) {
      $li.addClass("active");
    }

    const $dropdownMenu = $li.find(".dropdown-menu");
    if ($dropdownMenu.length) {
      const hasActiveChild = $dropdownMenu.find("a.dropdown-item").filter(function () {
        return this.href === window.location.href;
      }).length > 0;

      if (hasActiveChild) {
        $li.addClass("active");
      }
    }
  });
});
