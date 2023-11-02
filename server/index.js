const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const database = require('./database_connect.js');

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(cors());

app.use('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
     database.db.query("SELECT username, password, inactive FROM users WHERE users.username = ?", [username], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            if (result.length > 0 && result[0].inactive === 0) {
                bcrypt.compare(password, result[0].password, function(err, isMatch) {
                    if (err) {
                        console.log(err)
                    } else if (!isMatch) {
                        res.send([]);
                        console.log("Username matches passwords do not match");
                    } else {
                        console.log("Username and passwords match");
                        res.send(result);
                    }
                }) 
            } else {
                res.send([]);   
                console.log("Username does not match or inactived user");
            }
        }
    });
});

app.use('/checkloggedinuser', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    database.db.query("SELECT username, password FROM users WHERE users.username = ? AND users.password = ?", [username, password], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            if (result.length > 0){
                res.send(true)
                console.log('Username & password match')
            } else {
                res.send(false);
                console.log("Username & password don't match")
            }
        }
    });
});

app.post('/newuser', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const group = req.body.group;
    database.db.query("INSERT INTO users (username, password, name, accessgroup, inactive) VALUES (?, ?, ?, ?, 0)", [username, password, name, group], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send({username : username})
        }
    });

});

app.post('/deleteuser', (req,res) => {
    const id = req.body.id;
    database.db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.log(err)
        } else {                
            res.send({result})
        }
    });
});

app.post('/inactiveuser', (req,res) => {
    const id = req.body.id;
    database.db.query("UPDATE users SET inactive = 1 WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.log(err)
        } else {                
            res.send({result})
        }
    });
});

app.post('/activeuser', (req,res) => {
    const id = req.body.id;
    database.db.query("UPDATE users SET inactive = 0 WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.log(err)
        } else {                
            res.send({result})
        }
    });
});

app.post('/edituser', (req,res) => {
    const password = req.body.password;
    const id = req.body.id;
    const name = req.body.name;
    const group = req.body.group;
    if (password === '') {
        database.db.query("UPDATE users SET name = ?, accessgroup = ? WHERE id = ?", [name, group, id], (err, result) => {
            if (err) {
                console.log(err)
            } else {                
                res.send({result})
            }
        });

    } else {
        database.db.query("UPDATE users SET name = ?, accessgroup = ?, password = ? WHERE id = ?", [name, group, password, id], (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.send({result})
            }
        });


    }
});

app.post('/checkexistusername', (req,res) => {
    const username = req.body.username;
    database.db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    });
});

app.get('/getuserlist', (req,res) => {
    database.db.query("SELECT users.id, users.username, users.name, users.accessgroup, users.inactive, accessgroups.group_name FROM users INNER JOIN accessgroups ON users.accessgroup = accessgroups.id ORDER By users.id", (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    });
});

app.get('/getaccessgrouplist', (req,res) => {
    database.db.query("SELECT * FROM accessgroups" , (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    });
});


app.post('/newclient', (req,res) => {
    const name = req.body.name;
    const gender = req.body.gender;
    const address = req.body.address;
    const birthdate = req.body.birthdate;
    const email = req.body.email;
    const phone = req.body.phone;
    database.db.query("INSERT INTO clients (name, gender, address, birth_date, email, phone) VALUES (?, ?, ?, ?, ?, ?)", [name, gender, address, birthdate, email, phone], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send({name : name})
        }
    });

});

app.get('/getclientslist', (req,res) => {
    database.db.query("SELECT * FROM clients ORDER By id", (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    });
});



app.listen(8080, () => {
    console.log('Server listening on port 8080')
})
