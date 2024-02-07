const database = require('./database_connect.js');

const authenticateKey = (req, res, next) => {
    const password = req.header('x-api-key');
    
    database.db.query('SELECT username from users WHERE users.password = ?', [password], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length > 0){
                console.log('API KEY match ');
                next();
            } else {
                console.log("API KEY don't match");
                res.status(403).send({ error: { code: 403, message: 'You not allowed.' } });
            }
        }
    });
  };

  module.exports = { authenticateKey };