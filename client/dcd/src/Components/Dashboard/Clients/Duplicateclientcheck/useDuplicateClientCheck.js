import { useState } from 'react';
import axios from 'axios';
import API from '../../../../api';

export function useDuplicateClientCheck(loggedInUserData) {
    const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
    const [duplicateClients, setDuplicateClients] = useState([]);
    const [acknowledgedKey, setAcknowledgedKey] = useState(null);

    const checkDuplicate = async (name, birthDate, excludeId = null) => {
        if (!name || name.trim().length === 0 || !birthDate) return false;
        const key = `${name.trim()}|${birthDate}`;
        if (acknowledgedKey === key) return false;
        const duplicates = await axios.post(
            `${API.address}/checkclientduplicate`,
            { name: name.trim(), birth_date: birthDate, exclude_id: excludeId },
            { headers: { 'x-api-key': loggedInUserData.password } }
        ).then(({ data }) => data);
        if (duplicates.length > 0) {
            setDuplicateClients(duplicates);
            setShowDuplicateWarning(true);
            return true;
        }
        return false;
    };

    const acknowledgeAndHide = (name, birthDate) => {
        setAcknowledgedKey(`${name.trim()}|${birthDate}`);
        setShowDuplicateWarning(false);
    };

    const resetDuplicateCheck = () => {
        setAcknowledgedKey(null);
        setDuplicateClients([]);
    };

    return { showDuplicateWarning, duplicateClients, checkDuplicate, acknowledgeAndHide, resetDuplicateCheck };
}
