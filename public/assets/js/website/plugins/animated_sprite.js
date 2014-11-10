'use strict';

(function($){
    /** animatedSprite plugin definition **/
    $.fn.animatedSprite = function() {
        this.each(function () {
            if ($(this).data('animatedSprite')) return $(this).data('animatedSprite');
            var container = $(this);
            var options = {
                image: container.data('image'),
                width: container.data('width') || 64,
                height: container.data('height') || 64,
                steps: container.data('steps') || 100,
                duration: container.data('duration') || 2000,
                disposition: container.data('disposition') || 'vertical'
            };

            var animatedSprite = new AnimatedSprite(container, options);
            animatedSprite.init();

            container.data('animatedSprite', animatedSprite);
        });
    };

    /** Class definition **/
    var AnimatedSprite = function(container, options) {
        this.container = container;
        this.options = options;
    };

    /** Class prototype **/
    AnimatedSprite.prototype = {
        init: function() {
            this.current_step = 0;
            this.step_cords = [];
            this.sprite_element = null;

            // Setup container
            this.container.css({
                width: this.options.width,
                height: this.options.height,
                overflow: 'hidden'
            });

            var sprite_element = $('<img />').addClass('sprite');
            sprite_element.attr('src', this.options.image);
            sprite_element.attr('data-no-retina', 'true');

            if (this.options.disposition == 'vertical') {
                sprite_element.width(this.options.width)
            } else {
                sprite_element.height(this.options.height)
            }

            this.container.append(sprite_element);
            this.sprite_element = sprite_element;

            // Calculate coords
            for (var x = 0; x < this.options.steps; x++) {
                var xCords = 0,
                    yCords = 0;
                if (this.options.disposition == 'vertical') {
                    var yCords = x * this.options.width;
                }
                if (this.options.disposition == 'horizontal') {
                    var xCords = x * this.options.width;
                }
                this.step_cords.push({x: xCords, y: yCords});
            }

            this.animate();
        },
        performAnimation: function(step) {
            var stepCords = this.step_cords[step];
            var x = -stepCords.x;
            var y = -stepCords.y;
            var style = {
                "-webkit-transform": "translate3d(" + x + "px, " + y + "px, 0)",
                "-moz-transform": "translate3d(" + x + "px, " + y + "px, 0)",
                "transform": "translate3d(" + x + "px, " + y + "px, 0)"
            };
            this.sprite_element.css(style);
        },
        animate: function() {
            var delay = this.options.duration / this.options.steps;
            var that = this;
            this.interval = setInterval(function(){
                var next = ++that.current_step;
                if (next >= that.options.steps) next = that.current_step = 0;
                that.performAnimation(next);
            }, delay);
        },
        pause: function() {
            if (this.interval) clearInterval(this.interval);
        }
    };
})(jQuery);