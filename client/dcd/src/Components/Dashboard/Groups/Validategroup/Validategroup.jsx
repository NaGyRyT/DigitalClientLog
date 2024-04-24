import axios from 'axios';
import API from '../../../../api';

export async function validateGroup(
    groupName = '',
    description = '',
    origGroupName = '',
    loggedInUserData
    ) {
    const errorMessage = {
        groupName :'',
        description : '',
        error : false,
        }

    if (groupName.trim().length < 5) {
        errorMessage.groupName = 'Csoportnév minimum 5 karakter.';
        errorMessage.error = true;
    } else if (groupName.trim().toLowerCase() !== origGroupName.toLowerCase() && await checkExistGroupName(groupName.trim(), loggedInUserData)) {
        errorMessage.groupName = 'Ilyen nevű csoport már létezik.';
        errorMessage.error = true;
    } else errorMessage.groupName = '';
    if (description.trim() === '') {
        errorMessage.description = 'Csoport leírás kötelező.';
        errorMessage.error = true;
    } else errorMessage.description = '';
    return errorMessage
}

async function checkExistGroupName(groupName, loggedInUserData) {
    let existGroupName;
    await axios.post(`${API.address}/checkexistgroupname`, {groupname : groupName}, {headers: { 'x-api-key': loggedInUserData.password }})
    .then((data) => {
        if (data.data.length === 0) existGroupName = false;
        else existGroupName = true;
    })
    return existGroupName
}