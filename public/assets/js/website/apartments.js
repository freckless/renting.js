'use strict';

$().ready(function() {
    if ($('section#apartment').length > 0) {
        // Iniciamos a galería
        $('.gallery').gallery();

        // Bindeamos a imaxe superior coa galería de imaxes
        $('#top-image div.parallax').click(function() {
            $('.gallery img').eq(0).click();
        });

        // Configuramos a barra fix superior
        var header_height = 670;
        $(document).scroll(function() {
            if ($(document).scrollTop() > header_height) {
                $('#fixed-bar').show();
                $('.booking-sidebar').addClass('fixed');
            } else {
                $('#fixed-bar').hide();
            }
        });

        // Selección de datas
        $('#input-from').datepicker({
            prevText: '',
            nextText: '',
            minDate: new Date(),
            maxDate: '+1y',
            onSelect: function () {
                $('#input-to').datepicker('option', 'minDate', new Date($('#input-from').datepicker('getDate').getTime() + 86400000));
                setTimeout(function () {
                    $('#input-to').datepicker('show');
                }, 200);
                $('#input-from-timestamp').val($('#input-from').datepicker('getDate').getTime());
            }
        });

        $('#input-to').datepicker({
            prevText: '',
            nextText: '',
            minDate: new Date(),
            maxDate: '+1y',
            onSelect: function () {
                $('#input-to-timestamp').val($('#input-to').datepicker('getDate').getTime());
                $('#input-people').focus();
            }
        });

        $('.change-booking-info').click(function(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            $('.booking-form').show();
            $('.booking-avilables').hide();
            $(this).hide();
        });
    }
});