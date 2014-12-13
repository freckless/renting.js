// #Helper para formatear datos
// Este helper axudaranos a formatear datos como precios, datas, etc..

'use strict';

// ##Dependencias do módulo

// ##Lóxica do helper
var helper = {
    decimal: function(number, decimals, decimal_separator, millar_separator) {
        // Se non hay número definímolo como 0.00
        var x = number || 0.00;
        // Parseámolo como Float (por se ven dado en string) e fixamos os seus decimais a 2
        var z = parseFloat(x).toFixed(decimals);
        // Partimos a parte enteira da decimal
        var j = z.split('.')[0];
        // Expresión regular para partir a parte enteira en partes de 3 díxitos
        var rgx = /(\d+)(\d{3})/;
        // Separamos cada parte de 3 con un .
        while(rgx.test(j)) {
            j = j.replace(rgx, '$1' + millar_separator + '$2');
        }
        // Engadimos a parte decimal
        var c = j+decimal_separator+z.split('.')[1];
        // Devolvemolo número como un string formateado
        return c;
    },
    currency: function(number, symbol) {
        if (typeof symbol == 'undefined') {
            symbol = '\u20AC';
        }
        // Obtemos o número con duas posicións decimais (,) e o separador de miles (.)
        return helper.decimal(number, 2, ',', '.')+symbol;
    }
};

module.exports = helper;
