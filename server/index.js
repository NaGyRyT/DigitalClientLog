const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const database = require('./database_connect.js');
const { API } = require('./apikey.js');

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(cors());

/*******************HTTPS**************************/
/* const https = require('node:https');
const fs = require('node:fs');
const options = {
	cert: fs.readFileSync('/etc/letsencrypt/live/digitalclientlog.com/fullchain.pem'),
	key: fs.readFileSync('/etc/letsencrypt/live/digitalclientlog.com/privkey.pem')
};
https.createServer(options, app).listen(444, () => {
    console.log('Server listening HTTPS on port 444')
}); */

/*******************HTTP**************************/
app.listen(8080, () => {
    console.log('Server listening on port 8080');
});

const authenticateKey = (req, res, next) => {
    const password = req.header('x-api-key');
    const subdomain = req.header('subdomain');
    database.db.changeUser( {database : subdomain}, (err) => {
        if (err) throw err;
      });
    if (password === API.key) {
        next();
    } else
    database.db.query('SELECT password from users WHERE users.password = ?', [password], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length > 0) {
                next();
            } else {
                res.status(403).send({ error: { code: 403, message: 'You not allowed.' } });
            }
        }
    });
  };


/*------------------------------Login--------------------------*/
app.use('/api/login', authenticateKey, (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const sqlSelect = `SELECT 
                        users.username,
                        users.name,
                        users.accessgroup,
                        users.password,
                        users.inactive,
                        users.id,
                        accessgroups.group_name 
                       FROM users 
                       INNER JOIN accessgroups 
                       ON users.accessgroup = accessgroups.id
                       WHERE users.username = ?`
    database.db.query(sqlSelect, [username], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length > 0 && result[0].inactive === 0) {
                bcrypt.compare(password, result[0].password, function(err, isMatch) {
                    if (err) {
                        console.log(err);
                    } else if (!isMatch) {
                        res.send([]);
                        console.log('Username matches passwords do not match');
                    } else {
                        console.log('Username and passwords match');
                        res.send(result);
                    }
                }) 
            } else {
                res.send([]);   
                console.log("Username doesn't match or inactivated user");
            }
        }
    });
});

app.use('/api/checkloggedinuser', authenticateKey, (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const sqlSelect = `SELECT 
                        users.username,
                        users.name,
                        users.accessgroup,
                        users.password,
                        users.id,
                        accessgroups.group_name 
                       FROM users 
                       INNER JOIN accessgroups 
                       ON users.accessgroup = accessgroups.id
                       WHERE users.username = ? AND users.password = ?`
    database.db.query(sqlSelect, [username, password], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length > 0){
                res.send(result);
                console.log('Username & password match');
            } else {
                res.send(false);
                console.log("Username & password don't match");
            }
        }
    });
});


/*------------------------------Users--------------------------*/
app.post('/api/newuser', authenticateKey, (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const group = req.body.group;
    database.db.query('INSERT INTO users (username, password, name, accessgroup, inactive) VALUES (?, ?, ?, ?, 0)', [username, password, name, group], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send({username : username});
        }
    });

});

app.post('/api/deleteuser', authenticateKey, (req,res) => {
    const id = req.body.id;
    database.db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
        } else {                
            res.send({result});
        }
    });
});

app.post('/api/inactiveuser', authenticateKey, (req,res) => {
    const id = req.body.id;
    database.db.query('UPDATE users SET inactive = 1 WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
        } else {                
            res.send({result});
        }
    });
});

app.post('/api/activeuser', authenticateKey, (req,res) => {
    const id = req.body.id;
    database.db.query('UPDATE users SET inactive = 0 WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
        } else {                
            res.send({result});
        }
    });
});

app.post('/api/edituser', authenticateKey, (req,res) => {
    const password = req.body.password;
    const id = req.body.id;
    const name = req.body.name;
    const group = req.body.group;
    if (password === '') {
        database.db.query('UPDATE users SET name = ?, accessgroup = ? WHERE id = ?', [name, group, id], (err, result) => {
            if (err) {
                console.log(err);
            } else {                
                res.send({result});
            };
        });
    } else {
        database.db.query('UPDATE users SET name = ?, accessgroup = ?, password = ? WHERE id = ?', [name, group, password, id], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send({result});
            }
        });
    };
});

app.post('/api/checkexistusername', authenticateKey, (req,res) => {
    const username = req.body.username;
    database.db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        };
    });
});

app.get('/api/getuserlist', authenticateKey, (req,res) => {
    const sqlSelect = `SELECT 
                        users.id, 
                        users.username, 
                        users.name, 
                        users.inactive, 
                        users.accessgroup, 
                        accessgroups.group_name 
                       FROM users 
                       INNER JOIN accessgroups 
                       ON users.accessgroup = accessgroups.id 
                       ORDER By users.id`
    database.db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get('/api/getaccessgrouplist', authenticateKey, (req,res) => {
    database.db.query('SELECT * FROM accessgroups' , (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});


/*------------------------------Groups--------------------------*/
app.get('/api/getgrouplist', authenticateKey, (req,res) => {
    const sqlSelect = `SELECT 
                        *
                       FROM accessgroups
                       ORDER By id`;
    database.db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.post('/api/newgroup', authenticateKey, (req,res) => {
    const groupname = req.body.groupname;
    const description = req.body.description;
    database.db.query('INSERT INTO accessgroups (group_name, description) VALUES (?, ?)', [groupname, description,], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });

});

app.post('/api/checkexistgroupname', authenticateKey, (req,res) => {
    const groupname = req.body.groupname;
    database.db.query('SELECT * FROM accessgroups WHERE group_name = ?', [groupname], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.post('/api/editgroup', authenticateKey, (req,res) => {
    const id = req.body.id;
    const groupname = req.body.groupname;
    const description = req.body.description;
    const sqlUpdate = `
        UPDATE
            accessgroups
        SET
            group_name = ?,
            description = ?
        WHERE id = ?`
    database.db.query(sqlUpdate, [groupname, description, id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send({id : id});
            console.log(id+'.', 'group modified in the database');
        }
    });
});

app.post('/api/checkexistgroupidinusers', authenticateKey, (req,res) => {
    const groupid = req.body.groupid;
    database.db.query('SELECT accessgroup FROM users WHERE users.accessgroup = ?', [groupid], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.post('/api/checkexistgroupidinclients', authenticateKey, (req,res) => {
    const groupid = req.body.groupid;
    database.db.query('SELECT accessgroup FROM clients WHERE accessgroup = ?', [groupid], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.post('/api/deletegroup', authenticateKey, (req,res) => {
    const id = req.body.id;
    database.db.query('DELETE FROM accessgroups WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
        } else {                
            res.send({result});
            console.log(id+'.', 'group deleted in the database');
        }
    });
});


/*------------------------------Clients--------------------------*/
app.get('/api/getcities', authenticateKey, (req,res) => {
    database.db.query('SELECT * FROM cities' , (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.post('/api/newclient', authenticateKey, (req,res) => {
    const name = req.body.name;
    const clientid = req.body.clientid;
    const accessgroup = req.body.accessgroup;
    const gender = req.body.gender;
    const cityid = req.body.cityid;
    const street = req.body.street;
    const housenumber = req.body.housenumber;
    const floor = req.body.floor;
    const door = req.body.door;
    const birthdate = req.body.birthdate;
    const email = req.body.email;
    const phone = req.body.phone;
    const sqlInsert = `INSERT INTO 
                        clients (
                            name, 
                            client_id,
                            accessgroup,
                            gender, 
                            city_id, 
                            street, 
                            house_number, 
                            floor, 
                            door, 
                            birth_date, 
                            email, 
                            phone) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    database.db.query(sqlInsert, [
        name, 
        clientid,
        accessgroup,
        gender, 
        cityid, 
        street, 
        housenumber, 
        floor, 
        door, 
        birthdate, 
        email, 
        phone
    ], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send({name : name});
            console.log(name, 'client added to the database');
        }
    });
});

app.post('/api/editclient', authenticateKey, (req,res) => {
    const name = req.body.name;
    const id = req.body.id;
    const clientid = req.body.clientid;
    const gender = req.body.gender;
    const cityid = req.body.cityid;
    const street = req.body.street;
    const housenumber = req.body.housenumber;
    const floor = req.body.floor;
    const door = req.body.door;
    const birthdate = req.body.birthdate;
    const email = req.body.email;
    const phone = req.body.phone;
    const sqlUpdate = `UPDATE
                        clients
                       SET
                        name = ?,
                        client_id = ?,
                        gender = ?,
                        city_id = ?,
                        street = ?,
                        house_number = ?,
                        floor = ?,
                        door = ?,
                        birth_date = ?,
                        email = ?,
                        phone = ?
                       WHERE id = ?`
    database.db.query(sqlUpdate, [
        name, 
        clientid,
        gender, 
        cityid, 
        street, 
        housenumber, 
        floor, 
        door, 
        birthdate, 
        email, 
        phone, 
        id
    ], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send({name : name});
            console.log(name, 'client modified in the database');
        }
    });
});

app.post('/api/checkexistclientid', authenticateKey, (req,res) => {
    const clientid = req.body.clientid;
    const accessgroup = req.body.accessgroup;
    database.db.query('SELECT * FROM clients WHERE client_id = ? AND accessgroup = ?', [clientid, accessgroup], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        };
    });
});

app.post('/api/deleteclient', authenticateKey, (req,res) => {
    const id = req.body.id;
    database.db.query('DELETE FROM clients WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
        } else {                
            res.send({result});
        }
    });
});

app.get('/api/getclientlist', authenticateKey, (req,res) => {
    const sqlSelect = `SELECT 
                        clients.id,
                        accessgroup,
                        name,
                        client_id,
                        DATE_FORMAT(birth_date, '%Y-%m-%d') AS birth_date,
                        gender,
                        email,
                        phone,
                        cities.zip,
                        cities.city,
                        city_id,
                        street,
                        house_number,
                        floor,
                        door,
                        CONCAT(
                            cities.city,
                            CONCAT_WS(', ', '', NULLIF(street, '')),
                            ' ',
                            CONCAT_WS('. ', NULLIF(house_number, ''), ''),
                            CONCAT_WS('/', NULLIF(floor, ''), NULLIF(door, '')))
                            AS address,
                        TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) AS age
                       FROM clients
                       INNER JOIN cities ON clients.city_id = cities.id
                       ORDER By clients.id`;
    database.db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});


/*------------------------------Logs--------------------------*/
app.get('/api/getlog', authenticateKey, (req,res) => {
    const sqlSelect = `SELECT 
                        log.id,
                        users.name AS user_name,
                        accessgroups.id AS accessgroup_id,
                        users.id AS user_id,
                        clients.name As client_name,
                        DATE_FORMAT(date_time, '%Y-%m-%d %H:%i') AS date_time,
                        log.duration,
                        log.description
                       FROM log
                       INNER JOIN users ON users.id = log.user_id
                       INNER JOIN clients ON clients.id = log.client_id
                       INNER JOIN accessgroups ON clients.accessgroup = accessgroups.id
                       ORDER By log.id`;
    database.db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get('/api/getlog/:clientid', authenticateKey, (req,res) => {
    const clientId = req.params.clientid;
    const sqlSelect = `SELECT 
                        log.id,
                        users.name AS user_name,
                        users.id AS user_id,
                        clients.name As client_name,
                        DATE_FORMAT(date_time, '%Y-%m-%d %H:%i') AS date_time,
                        duration,
                        description
                       FROM log
                       INNER JOIN users ON users.id = log.user_id
                       INNER JOIN clients ON clients.id = log.client_id
                       WHERE ? = log.client_id
                       ORDER By log.id`;
    database.db.query(sqlSelect, [clientId], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.post('/api/checkexistclientidinlog', authenticateKey, (req,res) => {
    const clientid = req.body.clientid;
    database.db.query('SELECT * FROM log WHERE client_id = ?', [clientid], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.post('/api/checkexistuseridinlog', authenticateKey, (req,res) => {
    const userid = req.body.userid;
    database.db.query('SELECT * FROM log WHERE user_id = ?', [userid], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.post('/api/newlog', authenticateKey, (req,res) => {
    const user_id = req.body.userid;
    const client_id = req.body.clientid;
    const date_time = req.body.datetime;
    const duration = req.body.duration; 
    const description = req.body.description;
    database.db.query('INSERT INTO log (user_id, client_id, date_time, duration, description) VALUES (?, ?, ?, ?, ?)', [user_id, client_id, date_time, duration, description], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.post('/api/editlog', authenticateKey, (req,res) => {
    const id = req.body.id;
    const date_time = req.body.datetime;
    const duration = req.body.duration;
    const description = req.body.description;
    const sqlUpdate = `UPDATE
                        log
                       SET
                       date_time = ?,
                       duration = ? ,
                       description = ?
                    WHERE id = ?`
    database.db.query(sqlUpdate, [date_time, duration, description, id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send({id : id});
            console.log(id, 'log modified in the database');
        }
    });
});

app.post('/api/deletelog', authenticateKey, (req,res) => {
    const id = req.body.id;
    database.db.query('DELETE FROM log WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
        } else {                
            res.send({result});
        }
    });
});


/*------------------------------Statements--------------------------*/
app.get('/api/getgendernumber/:accessgroup', authenticateKey, (req,res) => {
    const accessgroup = req.params.accessgroup;
    const sqlSelectCount = accessgroup === '1' ?
    `
    SELECT 
        gender,
    COUNT(id) AS piece 
    FROM clients
    GROUP BY gender
    ` :
    `
    SELECT 
        gender,
    COUNT(id) AS piece 
    FROM clients
    WHERE accessgroup = ?
    GROUP BY gender
    `
    database.db.query(sqlSelectCount, [accessgroup],(err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get('/api/getagesnumber/:accessgroup', authenticateKey, (req,res) => {
    const accessgroup = req.params.accessgroup;
    const sqlSelectCount = accessgroup === '1' ?
        `
        SELECT '< 18' as ages, 
            SUM(CASE WHEN TIMESTAMPDIFF(YEAR, birth_date, NOW()) < 18 
            THEN 1 ELSE 0 END) as piece
        FROM clients
        UNION ALL
        SELECT '18 - 40',
            SUM(CASE WHEN TIMESTAMPDIFF(YEAR, birth_date, NOW())
            BETWEEN 18 AND 40 
            THEN 1 ELSE 0 END)
        FROM clients
        UNION ALL
        SELECT '41 - 65',
            SUM(CASE WHEN TIMESTAMPDIFF(YEAR, birth_date, NOW())
            BETWEEN 41 AND 65 
            THEN 1 ELSE 0 END)
        FROM clients
        UNION ALL
        SELECT '65 <',
            SUM(CASE WHEN TIMESTAMPDIFF(YEAR, birth_date, NOW()) > 65 
            THEN 1 ELSE 0 END)
        FROM clients
        ` :
        `
        SELECT '< 18' as ages, 
            SUM(CASE WHEN TIMESTAMPDIFF(YEAR, birth_date, NOW()) < 18 
            THEN 1 ELSE 0 END) as piece
        FROM clients
        WHERE accessgroup = ? 
        UNION ALL
        SELECT '18 - 40',
            SUM(CASE WHEN TIMESTAMPDIFF(YEAR, birth_date, NOW())
            BETWEEN 18 AND 40 
            THEN 1 ELSE 0 END)
        FROM clients
        WHERE accessgroup = ?
        UNION ALL
        SELECT '41 - 65',
            SUM(CASE WHEN TIMESTAMPDIFF(YEAR, birth_date, NOW())
            BETWEEN 41 AND 65 
            THEN 1 ELSE 0 END)
        FROM clients
        WHERE accessgroup = ?
        UNION ALL
        SELECT '65 <',
            SUM(CASE WHEN TIMESTAMPDIFF(YEAR, birth_date, NOW()) > 65 
            THEN 1 ELSE 0 END)
        FROM clients
        WHERE accessgroup = ?
        `;
    database.db.query(sqlSelectCount, [accessgroup, accessgroup, accessgroup, accessgroup],(err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get('/api/getlognumber/:accessgroup', authenticateKey, (req,res) => {
    const accessgroup = req.params.accessgroup;
    const sqlSelectCount = accessgroup === '1' ?
        `
        SELECT DATE_FORMAT(date_time, '%Y-%m') as log_date, 
        COUNT(id) as log_count FROM log 
        GROUP BY DATE_FORMAT(date_time, '%Y-%m')
        ORDER BY log_date ASC
        ` :
        `
        SELECT DATE_FORMAT(date_time, '%Y-%m') as log_date, 
        COUNT(log.id) as log_count 
        FROM log
        INNER JOIN clients ON clients.id = log.client_id
        WHERE clients.accessgroup = ? 
        GROUP BY DATE_FORMAT(date_time, '%Y-%m')
        ORDER BY log_date ASC
        `;
    database.db.query(sqlSelectCount, [accessgroup], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get('/api/getlognumberperuser/:userid', authenticateKey, (req,res) => {
    const userid = req.params.userid;
    const sqlSelectCount = 
        `
        SELECT DATE_FORMAT(date_time, '%Y-%m') as log_date, 
        COUNT(log.id) as log_count 
        FROM log
        WHERE log.user_id = ? 
        GROUP BY DATE_FORMAT(date_time, '%Y-%m')
        ORDER BY log_date ASC
        `;
    database.db.query(sqlSelectCount, [userid], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get('/api/getclientscities/:accessgroup', authenticateKey, (req,res) => {
    const accessgroup = req.params.accessgroup;
    const sqlSelectCount = accessgroup === '1' ?
        `
        SELECT city, 
        COUNT(city_id) as piece
        FROM clients
        INNER JOIN cities ON clients.city_id = cities.id
        GROUP BY city
        ` :
        `
        SELECT city, 
        COUNT(city_id) as piece
        FROM clients
        INNER JOIN cities ON clients.city_id = cities.id
        WHERE accessgroup = ? 
        GROUP BY city
        `;
    database.db.query(sqlSelectCount, [accessgroup], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get('/api/getdurationnumber/:accessgroup', authenticateKey, (req,res) => {
    const accessgroup = req.params.accessgroup;
    const sqlSelectCount = accessgroup === '1' ?
        `
        SELECT 
            duration,
        COUNT(id) AS piece FROM log GROUP BY duration
        `:
        `
        SELECT 
            duration,
        COUNT(log.id) AS piece 
        FROM log
        INNER JOIN clients ON clients.id = log.client_id
        WHERE clients.accessgroup = ? 
        GROUP BY duration
        `;
    database.db.query(sqlSelectCount, [accessgroup], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get('/api/getlogperusernumber/:accessgroup', authenticateKey, (req,res) => {
    const accessgroup = req.params.accessgroup;
    const sqlSelectCount = accessgroup === '1' ?
        `
        SELECT 
            users.name as name,
            count(log.id) as piece
        FROM log
        INNER JOIN users ON users.id = log.user_id
        GROUP BY users.name
        ` :
        `
        SELECT 
            users.name as name,
            count(log.id) as piece
        FROM log
        INNER JOIN users ON users.id = log.user_id
        INNER JOIN clients ON clients.id = log.client_id
        WHERE clients.accessgroup = ? 
        GROUP BY users.name
        `;
    database.db.query(sqlSelectCount, [accessgroup], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get('/api/getnotemptyloguserlist', authenticateKey, (req,res) => {
    const sqlSelect = `SELECT 
                        users.id, 
                        users.name
                       FROM users 
                       INNER JOIN log ON users.id = log.user_id
                       GROUP BY users.id
                       ORDER By users.id`
    database.db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});


/*------------------------------Company--------------------------*/

app.get('/api/getcompanydata', authenticateKey, (req,res) => {
    database.db.query(`SELECT * FROM company`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        };
    });
});

app.post('/api/editcompany', authenticateKey, (req,res) => {
    const id = req.body.id;
    const name = req.body.name;
    const shortname = req.body.shortname;
    const address = req.body.address;
    const sqlUpdate = `
        UPDATE
            company
        SET
            name = ?,
            shortname = ?,
            address = ?
        WHERE id = ?`
    database.db.query(sqlUpdate, [name, shortname, address, id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send({id : id});
            console.log(shortname, 'company modified in the database');
        }
    });
});


/*------------------------------Calendar--------------------------*/

app.post('/api/newcalendarevent', authenticateKey, (req,res) => {
    const user_id = req.body.userid;
    const group_id = req.body.groupevent;
    const date_time_start = req.body.start;
    const date_time_end = req.body.end; 
    const description = req.body.description;
    const subject = req.body.subject;
    database.db.query('INSERT INTO calendar (user_id, group_id, date_time_start, date_time_end, description, subject) VALUES (?, ?, ?, ?, ?, ?)', [user_id, group_id, date_time_start, date_time_end, description, subject], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.post('/api/editcalendarevent', authenticateKey, (req,res) => {
    const id = req.body.id;
    const user_id = req.body.userid;
    const group_id = req.body.groupevent;
    const date_time_start = req.body.start;
    const date_time_end = req.body.end; 
    const description = req.body.description;
    const subject = req.body.subject;
    const sqlUpdate = `UPDATE
                        calendar
                       SET
                       user_id = ?,
                       group_id = ?,
                       date_time_start = ?,
                       date_time_end = ?,
                       subject = ?,
                       description = ?
                    WHERE id = ?`
    database.db.query(sqlUpdate, [user_id, group_id, date_time_start, date_time_end, subject, description, id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send({id : id});
            console.log(id, 'event modified in calendar table');
        }
    });
});

app.post('/api/deleteevent', authenticateKey, (req,res) => {
    const id = req.body.id;
    database.db.query('DELETE FROM calendar WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
        } else {                
            res.send({result});
        }
    });
});

app.get('/api/geteventsfromcalendar/:accessgroup/:userid', authenticateKey, (req,res) => {
    const userid = req.params.userid;
    const accessgroup = req.params.accessgroup;
    const sqlSelect =
        `
        SELECT
            calendar.id,
            calendar.user_id,
            calendar.group_id,
            calendar.description,
            calendar.subject,
            calendar.subject as title,
            users.name as author,
            DATE_FORMAT(calendar.date_time_start, '%Y-%m-%dT%H:%i') as start,
            DATE_FORMAT(calendar.date_time_end, '%Y-%m-%dT%H:%i') as end
        FROM calendar
        INNER JOIN users ON users.id = calendar.user_id
        WHERE calendar.user_id = ? OR calendar.group_id = ?
        `;
    database.db.query(sqlSelect, [userid, accessgroup], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get('/api/geteventsfromlog/:accessgroup/:userid', authenticateKey, (req,res) => {
    const accessgroup = req.params.accessgroup;
    const userid = req.params.userid;
    const sqlSelect = accessgroup === '1' ?
        `
        SELECT
            users.name AS user_name,
            accessgroups.id AS accessgroup_id,
            users.id AS user_id,
            clients.name As client_name,
            log.id as id,
            clients.name as title,
            clients.name as subject,
            log.description,
            log.user_id,
            log.duration,
            DATE_FORMAT(log.date_time, '%Y-%m-%dT%H:%i') as start,
            DATE_FORMAT(log.date_time, '%Y-%m-%dT%H:%i') as date_time,
            DATE_FORMAT(DATE_ADD(DATE_FORMAT(log.date_time, '%Y-%m-%d %H:%i'), INTERVAL log.duration MINUTE), '%Y-%m-%dT%H:%i') as end
        FROM log 
        INNER JOIN clients ON clients.id = log.client_id
        INNER JOIN users ON users.id = log.user_id
        INNER JOIN accessgroups ON clients.accessgroup = accessgroups.id
        ` :
        `
        SELECT
            users.name AS user_name,
            accessgroups.id AS accessgroup_id,
            users.id AS user_id,
            clients.name As client_name,
            log.id as id,
            clients.name as title,
            clients.name as subject,
            log.description,
            log.user_id,
            log.duration,
            DATE_FORMAT(log.date_time, '%Y-%m-%dT%H:%i') as start,
            DATE_FORMAT(log.date_time, '%Y-%m-%dT%H:%i') as date_time,
            DATE_FORMAT(DATE_ADD(DATE_FORMAT(log.date_time, '%Y-%m-%d %H:%i'), INTERVAL log.duration MINUTE), '%Y-%m-%dT%H:%i') as end
        FROM log 
        INNER JOIN clients ON clients.id = log.client_id
        INNER JOIN users ON users.id = log.user_id
        INNER JOIN accessgroups ON clients.accessgroup = accessgroups.id
        WHERE clients.accessgroup = ? AND log.user_id = ?
        `;
    database.db.query(sqlSelect, [accessgroup, userid], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});