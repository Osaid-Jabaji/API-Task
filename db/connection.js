const knex = require('knex');

const db = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: '3306',
        user: 'root',
        password: 'Osaid@0599886818',
        database: 'my_db'
    }
});

module.exports = db;
