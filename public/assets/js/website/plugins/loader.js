'use strict';

/** Loader **/
window.Loader = function() {
    var element = $('<div />').addClass('loader').addClass('animatedSprite');
    var data = {
        image: '/assets/img/loader'+(window.devicePixelRatio > 1 ? '@2x' : '')+'.png',
        duration: '1000',
        width: '64',
        height: '64',
        steps: '20'
    };
    element.data(data);
    element.animatedSprite();
    var LoaderClass = function(element){
        this.element = element;
    };
    LoaderClass.prototype = {
        remove: function(callback){
            this.element.fadeOut(function(){
                $(this).remove();
                if (callback !== undefined) callback();
            });
        }
    };
    return new LoaderClass(element);
};

(function($){

    /** Plugin definition **/
    $.fn.loader = function() {
        this.each(function() {
            if ($(this).data('loader')) return $(this).data('loader');
            var image = $(this);

            var loader = new IMGLoader(image);
            loader.init();

            image.data('loader', loader);
            return loader;
        });
    };

    /** Class definition **/
    var IMGLoader = function(image) {
        this.image = image;
        this.loader = null;
    };

    /** Class prototype **/
    IMGLoader.prototype = {
        init: function() {
            var loader = window.Loader();
            this.image.hide();
            this.image.parent().append(loader.element);
            this.loader = loader;
            var that = this;
            this.image.load(function() {
                that.image.fadeIn();
                that.loader.remove();
            });
        }
    };

})(jQuery);