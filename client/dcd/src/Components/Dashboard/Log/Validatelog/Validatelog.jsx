import validator from 'validator';

export async function validateLog(
    date = '',
    time = '',
    duration = '',
    description = '',
    ) {
    const errorMessage = {
        date : '',
        time : '',
        duration : '',
        description : '',
        error : false,
        }
    if (!validator.isTime(time)) {
            errorMessage.time = 'Időpont megadása kötelező.';
            errorMessage.error = true;
        } else errorMessage.time = '';
    if (!validator.isDate(date)) {
        errorMessage.date = 'Dátum megadása kötelező.';
        errorMessage.error = true;
    } else if (date > new Date().toJSON().slice(0,10)) {
        errorMessage.date = 'Jövőbeni dátum nem lehetséges.';
        errorMessage.error = true;
    } else errorMessage.date = '';
    if (duration === '') {
        errorMessage.duration = 'Időtartam megadása kötelező.';
        errorMessage.error = true;
    } else errorMessage.duration = '';       
    if (description === '') {
        errorMessage.description = 'Ügyféltalálkozás leírása kötelező';
        errorMessage.error = true;
    } else errorMessage.description = '';
    return errorMessage
}