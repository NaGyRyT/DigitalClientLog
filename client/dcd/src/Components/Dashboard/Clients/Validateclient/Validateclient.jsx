
import validator from 'validator';
import axios from 'axios';
import API from '../../../../api';

export async function validateClient(
    name = '',
    clientId = '',
    origClientId ='',
    birthDate = '',
    gender = '',
    email = '',
    phone = '',
    zip = '',
    cityId = 0,
    accessgroup,
    loggedInUserData,
    registrationDate ='',
    endOfService = '',
    ) {
    const errorMessage = {
        name : '',
        clientId : '',
        birthDate : '',
        gender : '',
        zip : '',
        city : '',
        phone : '',
        email : '',
        error : false,
        registrationDate: '',
        endOfService : '',
        };

    if (name.trim().length === 0) {
        errorMessage.name = 'Név megadása kötelező.';
        errorMessage.error = true;
    } else if (name.trim().length > 100) {
        errorMessage.name = 'Név maximális hossza 100 karakter lehet.';
        errorMessage.error = true;
    } else errorMessage.name = '';
    //azonosító validálása
/*     if (clientId.trim().length < 9) { 
        errorMessage.clientId = 'Azonosító megadása kötelező 9 karakter lehet.';
        errorMessage.error = true;
    } else if (clientId.trim() !== origClientId && await checkExistClientId(clientId, accessgroup, loggedInUserData)) {
        errorMessage.clientId = 'Ezzel az azonosítóval már van regisztrált ügyfél.';
        errorMessage.error = true;
    } else errorMessage.id = ""; */
    if (!validator.isDate(birthDate)) {
        errorMessage.birthDate = 'Születési dátum megadása kötelező.';
        errorMessage.error = true;
    } else if (birthDate > new Date().toJSON().slice(0,10)) {
        errorMessage.birthDate = 'Jövőbeni dátum nem lehetséges.';
        errorMessage.error = true;
    } else if (birthDate < '1900-01-01') {
            errorMessage.birthDate = '1900.01.01 előtti dátum nem lehetséges.';
            errorMessage.error = true;
    } else errorMessage.birthDate = '';
    if (endOfService > new Date().toJSON().slice(0,10) && endOfService !=='3000-01-01') {
        errorMessage.endOfService = 'Jövőbeni dátum nem lehetséges.';
        errorMessage.error = true;
    } else if (endOfService < registrationDate) {
            errorMessage.endOfService = registrationDate +' előtti dátum nem lehetséges.';
            errorMessage.error = true;
    } else errorMessage.endOfService = '';
    if (zip.length !== 4) {
        errorMessage.zip = 'Nem megfelelő irányítószám.';
        errorMessage.error = true;
    } else errorMessage.zip = '';
    if (zip.length === 4 && cityId === 0) {
        errorMessage.zip = 'Nincs ilyen irányítószám.';
        errorMessage.error = true;
    };
    if (cityId === 0 ) {
        errorMessage.city = 'Város választása kötelező.';
        errorMessage.error = true;
    } else errorMessage.city = '';
    if (gender === '') {
        errorMessage.gender = 'Nem megadása kötelező.';
        errorMessage.error = true;
    } else errorMessage.gender = '';       
    if (email !== '' && !validator.isEmail(email)) {
        errorMessage.email = 'Nem megfelelő e-mail. xxxxx@xxx.xx';
        errorMessage.error = true;
    } else errorMessage.email = '';
    /* if (phone !== '' && !validator.isMobilePhone(phone, 'hu-HU')) {
        errorMessage.phone = 'Elvárt formátum 06305555555 vagy +36301111111';
        errorMessage.error = true;
    } else errorMessage.phone = ''; */
    if (!validator.isDate(registrationDate)) {
        errorMessage.registrationDate = 'Szolgáltatás kezdetének megadása kötelező';
        errorMessage.error = true;
    } else if (registrationDate > new Date().toJSON().slice(0,10)) {
        errorMessage.registrationDate = 'Jövőbeni dátum nem lehetséges.';
        errorMessage.error = true;
    } else if (registrationDate < '1900-01-01') {
            errorMessage.registrationDate = '1900.01.01 előtti dátum nem lehetséges.';
            errorMessage.error = true;
    } else errorMessage.registrationDate = '';
    return errorMessage
};

async function checkExistClientId(clientId, accessgroup, loggedInUserData) {
    let existClientId;
    await axios.post(`${API.address}/checkexistclientid`, {clientid : clientId, accessgroup : accessgroup}, {headers: { 'x-api-key': loggedInUserData.password }})
    .then((data) => {
        if (data.data.length === 0) existClientId = false;
        else existClientId = true;
    });
    return existClientId;
};
