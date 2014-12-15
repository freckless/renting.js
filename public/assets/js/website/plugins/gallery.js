'use strict';

(function($){

    /** Plugin definition **/
    $.fn.gallery = function() {
        this.each(function() {
            if ($(this).data('gallery')) return $(this).data('gallery');
            var container = $(this);

            var gallery = new Gallery(container);
            gallery.init();

            container.data('gallery', gallery);
            return gallery;
        });
    };

    /** Class definition **/
    var Gallery = function(container) {
        this.container = container;
        this.gallery = $('#gallery');
        this.images = [];
        this.current = null;
        this.isOpen = false;
    };

    /** Class prototype **/
    Gallery.prototype = {
        init: function() {
            this.createImages();
            this.bindContainerEvents();
        },
        createImages: function() {
            var self = this;
            this.images = [];
            this.gallery.find('.images').html('');
            this.container.find('.image img').each(function() {
                var image = {thumb: $(this).attr('src'), image: $(this).data('image'), description: $(this).data('tooltip')}
                self.images.push(image);
                self.gallery.find('.images').append($('<img class="image" />').attr('src', image.thumb));
            });
        },
        bindContainerEvents: function() {
            var self = this;
            this.container.find('.image').click(function() {
                self.open($(this).index());
            });
        },
        open: function(index) {
            this.createImages();
            this.gallery.data('gallery', this);
            this.gallery.show();
            this.go(index);
        },
        close: function() {
            this.gallery.hide();
            this.current = null;
        },
        next: function() {
            if (++this.current < this.images.length) {
                this.go(this.current);
            } else {
                this.go(0);
            }
        },
        prev: function() {
            if (--this.current >= 0) {
                this.go(this.current);
            } else {
                this.go(this.images.length - 1);
            }
        },
        go: function(index) {
            this.current = index;
            this.gallery.find('.main-image img').attr('src', this.images[index].image);
            this.gallery.find('.images img.active').removeClass('active');
            this.gallery.find('.images img').eq(index).addClass('active');
            this.centerThumbnail();
        },
        centerThumbnail: function() {
            var page_width = this.gallery.find('.images').innerWidth();
            var thumbnail_x = this.gallery.find('.images img.active').position().left;
            var image_width = this.gallery.find('.images img.active').outerWidth() + 2;

            var position_percent = thumbnail_x / page_width * 100;

            var left = 0;

            if (thumbnail_x > page_width / 2) {
                if (position_percent > 50) {
                    left = (position_percent - 50) / 100 * page_width;
                } else if (position_percent < 50) {
                    left = (50 - position_percent) / 100 * page_width;
                }
                left += image_width / 2;
            }

            this.gallery.find('.images').clearQueue().animate({
                left: -left
            });
        }
    };

    $().ready(function() {
        /** Gallery Events **/
        $('#gallery').on('click', '.close', function() {
            $('#gallery').data('gallery').close();
        });
        $('#gallery').on('click', '.right', function() {
            $('#gallery').data('gallery').next();
        });
        $('#gallery').on('click', '.left', function() {
            $('#gallery').data('gallery').prev();
        });
        $('#gallery .images').on('click', '.image', function() {
            $('#gallery').data('gallery').go($(this).index());
        });
    });

})(jQuery);