export async function validateCompany(
    name = '',
    shortName = '',
    address = ''
    ) {
    const errorMessage = {
        name :'',
        shortName : '',
        address : '',
        error : false,
        }
    if (name.trim().length < 1) {
        errorMessage.name = 'A név megadása kötelező.';
        errorMessage.error = true;
    } else errorMessage.name = '';
    if (shortName.trim() === '') {
        errorMessage.shortName = 'A rövid név megadása kötelező.';
        errorMessage.error = true;
    } else errorMessage.shortName = '';
    if (address.trim() === '') {
        errorMessage.address = 'A cím megadása kötelező.';
        errorMessage.error = true;
    } else errorMessage.address = '';
    return errorMessage
};