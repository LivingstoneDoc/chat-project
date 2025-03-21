import { constants } from "./constants.js";
import { getToken, setMessage } from "./utils.js";

function checkResponseStatus(status) {
    if (status !== 200) {
        setMessage(constants.uiComponents.userInfoBlock, constants.userInfoMessages.userInfoError, 'error');
        constants.uiComponents.userInfoBlock.classList.remove('hide-content');
    }
}

export async function getUserResponse() {
    try {
        const meInfoUrl = constants.endpoints.meInfoUrl;
        const token = getToken();
        const response = await fetch(meInfoUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        //console.log('response', response);
        checkResponseStatus(response.status);
        return await response.json();
    } catch(err) {
        console.error(err);
    }
}