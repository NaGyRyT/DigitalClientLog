const mysql = require('mysql');

const db = mysql.createPool({
    connectionLimit : 10,
    host : 'mysql.nethely.hu',
    port : '3306',
    user : 'dcl',
    password : 'o7Tn3U=Bke5t!p%7',
    database : 'dcl'
});

module.exports = { db };