'use strict';

(function($) {
  $().ready(function() {
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
  });
})(jQuery, window);