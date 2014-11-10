'use strict';

(function($){

  /** Plugin definition **/
  $.fn.parallax = function() {
    this.each(function() {
      if ($(this).data('parallax')) return $(this).data('parallax');
      var container = $(this);
      var options = {
        image: container.data('image'),
        width: container.data('width') || 1600,
        height: container.data('height') || 1000,
        gravity: container.data('gravity') || 'center'
      };

      var parallax = new Parallax(container, options);
      parallax.init();

      container.data('parallax', parallax);
      return parallax;
    });
  };

  /** Class definition **/
  var Parallax = function(container, options) {
    this.container = container;
    this.options = options;
  };

  /** Class prototype **/
  Parallax.prototype = {
    init: function() {
      // Setting vars
      this.image_element = this.timeout = null;

      var loader = window.Loader();
      this.container.append(loader.element);
      this.loader = loader;

      var image_container = $('<div />').addClass('background');
      this.container.append(image_container);
      this.image_container = image_container;

      var image_element = $('<img class="background" />');
      image_element.attr('src', this.options.image);
      image_element.addClass('gravity-'+this.options.gravity);
      image_element.attr('data-no-retina', true);
      image_element.css({visibility: 'hidden'});

      image_container.append(image_element);
      this.image_element = image_element;

      var that = this;
      this.image_element.load(function() {
        that.resize();
        that.scroll();
        var those = $(this);
        setTimeout(function() {
          image_element.hide().css({visibility: 'visible'});
          those.fadeIn(function() {
            that.container.find('.content').fadeIn();
            $(this).addClass('ready');
            those.resize();
          });
          that.loader.remove();
        }, 100);
      });

      $(window).resize(function(){
        if (that.timeout) clearTimeout(that.timeout);
        that.timeout = setTimeout(function(){ that.resize(); }, 100);
      });

      $(document).scroll(function() {
        that.scroll();
      });
    },
    scroll: function() {
      if (this.shown()) {
        var Czero = this.container.position().top;
        var scroll = $(document).scrollTop();
        var relativeScroll = scroll - Czero + 70;
        var marginTop = relativeScroll * 0.4;
        var style = {
          '-webkit-transition-duration': '0',
          '-webkit-transform': 'translate3d(0, ' + marginTop + 'px, 0)',
          '-moz-transition-duration': '0',
          '-moz-transform': 'translate3d(0, ' + marginTop + 'px, 0)',
          'transition-duration': '0',
          'transform': 'translate3d(0, ' + marginTop + 'px, 0)'
        };
        this.image_container.css(style);
      }
    },
    shown: function() {
      var Cheight = this.container.height();
      var Czero = this.container.position().top;
      var Wheight = $(window).height();
      var scroll = $(document).scrollTop();

      if ((Czero + Cheight) >= scroll && Czero <= (scroll + Wheight)) {
        return true;
      }
      return false;
    },
    resize: function() {
      var Cwidth = this.container.width();
      var Cheight = this.container.height();
      var container_aspect_ratio = Cwidth / Cheight;
      var image_aspect_ratio = this.options.width / this.options.height;
      var style = {
        width: 0,
        height: 0,
        left: 'auto',
        top: 'auto',
        bottom: 'auto'
      };

      if (container_aspect_ratio > image_aspect_ratio) {
        style.width = Cwidth;
        style.height = Cwidth / image_aspect_ratio;

        if (style.height > Cheight) {
          switch (this.options.gravity) {
            case 'center':
            style.top = (Cheight - style.height) / 2;
            break;
            case 'bottom':
            style.bottom = 0;
            break;
            case 'top':
            style.top = 0;
            break;
          }
        }
      } else if (container_aspect_ratio < image_aspect_ratio) {
        style.height = Cheight;
        style.width = Cheight * image_aspect_ratio;

        if (style.width > Cwidth) {
          style.left = (Cwidth - style.width) / 2;
        }
      } else {
        style.width = Cwidth;
        style.height = Cheight;
      }
      this.image_element.css(style);
    }
  };

})(jQuery);