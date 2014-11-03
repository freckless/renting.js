// #Configuracións

// Neste arquivo están as configuracións por defecto da app,
// que poden ser extendidas coas propias configuracións de
// cada entorno.

'use strict';

// ##Exportamos o obxecto coas configuracións
module.exports = {
    // Configuracións da app que se poderán utilizar nas vistas.
    app: {
        name: 'Renting.js'
    },
    // Porto para lanzar o servidor
    port: process.env.PORT || 3000,
    // Conexión a base de datos (esta configurarase en cada entorno)
    db: 'mongodb://user:password@server:port/database',
    // Configuración para as sesións
    sessions: {
        name: 'renting:sess',
        secret: 'supersecretphraseforencodesessions'
    }
};