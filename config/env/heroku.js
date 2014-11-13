'use strict';

module.exports = {
    db: process.env.MONGODB,
    sessions: {
        name: 'renting-development:session',
        secret: process.env.SESSION_SECRET
    }
};
