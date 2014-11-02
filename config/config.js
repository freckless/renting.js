'use strict';

module.exports = {
    app: {
        name: 'Renting.js'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://user:password@server:port/database',
    sessions: {
        name: 'renting:sess',
        secret: 'supersecretphraseforencodesessions'
    }
};