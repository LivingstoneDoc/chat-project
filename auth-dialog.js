import { constants } from "./constants.js";
import { openDialogWindow, preventEscapeBtn } from "./dialog.js";
import { confirmDialogComponent } from "./confirm-dialog.js";
import { setMessage, setCookie } from "./utils.js";

export function authDialogComponent() {
    openDialogWindow(constants.uiComponents.authDialog);
    constants.uiComponents.authDialog.addEventListener('keydown', preventEscapeBtn);
    
    function checkResponseStatus(status) {
        const message = constants.authModal.responseCodes[status];
        if (status === 200) {
            setMessage(constants.uiComponents.authMessageBlock, `${message} "${constants.uiComponents.emailInput.value}". ${constants.authModal.messages.spamFolder}`, 'success');
        } else {
            setMessage(constants.uiComponents.authMessageBlock, message, 'error');
        }
    }
    
    function checkInputValue(inputValue) {
        let checkResult = true;
        if (!inputValue) {
            setMessage(constants.uiComponents.authMessageBlock, constants.authModal.messages.emptyInputValue, 'error');
            checkResult = false;
        }
        return checkResult;
    }
    
    async function sendEmail() {
        try {
            if (!checkInputValue(constants.uiComponents.emailInput.value)) {
                return;
            }
            setMessage(constants.uiComponents.authMessageBlock, constants.authModal.messages.codeSending, 'info');
            const userUrl = constants.endpoints.userUrl;
            const response = await fetch(userUrl, {
            method: 'POST',
            body: JSON.stringify({
                email: constants.uiComponents.emailInput.value
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });
        //console.log('response', response);
        checkResponseStatus(response.status);
        const emailCookie = `email=${constants.uiComponents.emailInput.value};samesite=lax;max-age=${constants.tokenLifeTime}`
        setCookie(emailCookie);
        return await response.json();
        } catch(err) {
            console.error(err);
            setMessage(constants.uiComponents.authMessageBlock, constants.authModal.messages.serverError, 'error');
        } finally {
            constants.uiComponents.emailInput.value = '';
        }
    }
    
    async function getCode(e) {
        try {
            e.preventDefault();
            const data = await sendEmail();
            //console.log('data', data);
            return data;
        } catch(err) {
            console.error(err);
        }
    }
    constants.uiComponents.getCodeBtn.addEventListener('click', getCode);
    
    confirmDialogComponent();
}