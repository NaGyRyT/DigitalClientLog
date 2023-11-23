
import validator from 'validator';
import axios from 'axios';

export async function validateClient(
    name = '',
    clientId = '',
    birthDate = '',
    gender = '',
    email = '',
    phone = '',
    zip = '',
    cityId = 0,
    id = '',
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
        }
    if (name.length === 0) {
        errorMessage.name = 'Név megadása kötelező.';
        errorMessage.error = true;
    } else if (name.length > 100){
        errorMessage.name = 'Név maximális hossza 100 karakter lehet.';
        errorMessage.error = true;
    } else errorMessage.name = '';
    if (clientId.length < 9) { 
        errorMessage.clientId = 'Azonosító megadása kötelező 9 karakter lehet.';
        errorMessage.error = true;
    } else if (await checkExistClientId(id, clientId)) {
        errorMessage.clientId = 'Ezzel az azonosítóval már van regisztrált ügyfél.';
        errorMessage.error = true;
    } else errorMessage.id = "";
    if (!validator.isDate(birthDate)) {
        errorMessage.birthDate = 'Születési dátum megadása kötelező.';
        errorMessage.error = true;
    } else if (birthDate > new Date().toJSON().slice(0,10)) {
        errorMessage.birthDate = 'Jövőbeni dátum nem lehetséges.';
        errorMessage.error = true;
    } else errorMessage.birthDate = '';
    if (zip.length !== 4) {
        errorMessage.zip = 'Nem megfelelő irányítószám.';
        errorMessage.error = true;
    } else errorMessage.zip = '';
    if (zip.length === 4 && cityId === 0) {
        errorMessage.zip = 'Nincs ilyen irányítószám.';
        errorMessage.error = true;
    }
    if (cityId === 0 ) {
        errorMessage.city = 'Város választása kötelező.';
        errorMessage.error = true;
    } else errorMessage.city = '';
    if (gender === '') {
        errorMessage.gender = 'Nem megadása kötelező.';
        errorMessage.error = true;
    } else errorMessage.gender = '';       
    if (!validator.isEmail(email)) {
        errorMessage.email = 'Nem megfelelő e-mail. xxxxx@xxx.xx';
        errorMessage.error = true;
    } else errorMessage.email = ''
    if (!validator.isMobilePhone(phone, 'hu-HU')) {
        errorMessage.phone = 'Elvárt formátum 06305555555 +36301111111';
        errorMessage.error = true;
    } else errorMessage.phone = '';
    return errorMessage
}

async function checkExistClientId(id, clientId) {
    let existClientId;
    await axios.post('http://localhost:8080/checkexistclientid', {id : id, clientid : clientId})
    .then((data) => {
        if (data.data.length === 0) existClientId = false;
        else existClientId = true;
    })
    return existClientId
}
