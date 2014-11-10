'use strict';

(function($) {
  $().ready(function() {
    // Cargamos os iconos
    $('img.svg-inject').svgInjector();

    // Lanzamos o efecto parallax se hay elementos que o precisan
    $('.parallax').parallax();

    // Animamos os sprites
    $('.animatedSprite').animatedSprite();
  });
})(jQuery);