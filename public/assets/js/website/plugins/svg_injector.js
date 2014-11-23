'use strict';

(function($){
    var svgNS = 'http://www.w3.org/2000/svg';

    /** animatedSprite plugin definition **/
    $.fn.svgInjector = function() {
        this.each(function () {
            if ($(this).data('animatedSprite')) $(this).data('animatedSprite');
            var container = $(this);
            var options = {
                source: container.data('src'),
                symbol: container.data('symbol')
            };

            var svgInjector = new SVGInjector(container, options);
            svgInjector.init();

            container.data('svgInjector', svgInjector);
        });
    };

    /** Class definition **/
    var SVGInjector = function(container, options) {
        this.container = container;
        this.options = options;
    };

    window.cachedSVG = {};

    /** Class prototype **/
    SVGInjector.prototype = {
        render: function() {
            var svg = this.svg_data;
            var symbol = svg.getElementById(this.options.symbol);
            var view_box = symbol.getAttribute('viewBox');
            var child_nodes = symbol.childNodes;
            var svg_element = this.createSVG();
            svg_element.setAttribute('viewBox', view_box);
            $.each(child_nodes, function() {
                svg_element.appendChild(this.cloneNode(true));
            });
            this.container.replaceWith(svg_element);
        },
        init: function() {
            this.svg_data = null;
            this.loadSVG(this.render);
        },
        createSVG: function() {
            var svg = document.createElementNS(svgNS, 'svg');
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svg.setAttribute('class', this.container.get(0).className);
            return svg;
        },
        loadSVG: function() {
            var source = this.options.source;
            var that = this;
            if (Object.keys(window.cachedSVG).indexOf(source) > -1) {
                that.svg_data = window.cachedSVG[source];
                that.render();
            } else {
                // load
                $.get(source, function(res) {
                    var parser = new DOMParser();
                    var svg = parser.parseFromString(res, 'text/xml');
                    that.svg_data = svg;
                    window.cachedSVG[source] = svg;
                    that.render();
                }, 'text');
            }
        }
    };
})(jQuery);