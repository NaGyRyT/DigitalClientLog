export async function validateEvent(
    startDate = '',
    startTime = '',
    endDate = '',
    endTime = '',
    subject = '',
    description = ''
    ) {
    const errorMessage = {
        startDate : '',
        startTime : '',
        endDate : '',
        endtTime : '',
        subject : '',
        description : '',
        error : false
        }
    if (startDate + ' ' + startTime > endDate + ' ' + endTime) {
        errorMessage.endDate = 'A befejezés nem  lehet korábbi a kezdésnél'
        errorMessage.error = true;
    } else errorMessage.endDate = '';
    if (subject.trim() === '') {
        errorMessage.subject = 'Tárgy megadása kötelező';
        errorMessage.error = true;
    } else errorMessage.subject = '';
    if (description.trim() === '') {
        errorMessage.description = 'Esemény megadása kötelező';
        errorMessage.error = true;
    } else errorMessage.description = '';
    return errorMessage
};