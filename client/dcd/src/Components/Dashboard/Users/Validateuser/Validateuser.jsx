import axios from 'axios';
import API from '../../../../api';
import validator from 'validator';

export async function validateUser (
    username = '',
    name = '',
    password = '',
    group = '',
    loggedInUserData,
    isEdited = false,
    needToChangePassword = true,
    ) {
    const errorMessage = {
        username : '',
        name : '',
        password : '',
        group : '',
        error : false,
    };

    if (!isEdited) {
        if (username.trim().length < 4 || username.trim().length > 20) {
            errorMessage.username = 'A felhasználónév minimum 4 maximum 20 karakter lehet.';
            errorMessage.error = true;
        } else if (await checkExistUsername(username.trim(), loggedInUserData)) {
            errorMessage.username = 'Ez a felhasználónév foglalt.';
            errorMessage.error= true;
        } else errorMessage.username = ""; 
    };
    if (name.trim().length === 0) {
        errorMessage.name = 'A név minimum 1 maximum 100 karakter lehet.';
        errorMessage.error = true;
    } else errorMessage.name = '';
    if (needToChangePassword) {
        if (!validator.isStrongPassword(password)) {
            errorMessage.password = 'A jelszónak minimum 1 kisbetűt, 1 nagybetűt, 1 számot és 1 speciális karaktert kell tartalmaznia. A hossza minimum 8 maximum 60 karakter lehet.';
            errorMessage.error = true;
        } else errorMessage.password = '';
    };
    if (group === 0 ) {
        errorMessage.group = 'Csoport választása kötelező.';
        errorMessage.error = true;
    } else errorMessage.group = '';
    return errorMessage
};

async function checkExistUsername(username, loggedInUserData) {
    let existUsername;
    await axios.post(`${API.address}/checkexistusername`, {username : username}, {headers: { 'x-api-key': loggedInUserData.password }})
    .then((data) => {
        if (data.data.length === 0) existUsername = false;
        else existUsername = true;
    })
    return existUsername
};