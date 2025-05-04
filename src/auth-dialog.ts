import { constants } from "./constants";
import { openDialogWindow, preventEscapeBtn } from "./dialog";
import { confirmDialogComponent } from "./confirm-dialog";
import { setMessage, setCookie } from "./utils";

export function authDialogComponent() {
    openDialogWindow(constants.uiComponents.authDialog);
    constants.uiComponents.authDialog?.addEventListener('keydown', preventEscapeBtn);
    
    function checkResponseStatus(status: number) {
        const message = constants.authModal.responseCodes[status];
        if (!constants.uiComponents.authMessageBlock) {
            return;
        }
        if (status === 200) {
            setMessage(constants.uiComponents.authMessageBlock, `${message} "${constants.uiComponents.emailInput?.value ?? ''}". ${constants.authModal.messages.spamFolder}`, 'success');
        } else {
            setMessage(constants.uiComponents.authMessageBlock, message, 'error');
        }
    }
    
    function checkInputValue(inputValue: string) {
        let checkResult = true;
        if (!inputValue) {
            setMessage(constants.uiComponents.authMessageBlock, constants.authModal.messages.emptyInputValue, 'error');
            checkResult = false;
        }
        return checkResult;
    }
    
    async function sendEmail() {
        try {
            if (!checkInputValue(constants.uiComponents.emailInput?.value ?? '')) {
                return;
            }
            setMessage(constants.uiComponents.authMessageBlock, constants.authModal.messages.codeSending, 'info');
            const userUrl = constants.endpoints.userUrl;
            const response = await fetch(userUrl, {
            method: 'POST',
            body: JSON.stringify({
                email: constants.uiComponents.emailInput?.value ?? ''
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });
        //console.log('response', response);
        checkResponseStatus(response.status);
        const emailCookie = `email=${constants.uiComponents.emailInput?.value ?? ''};samesite=lax;max-age=${constants.tokenLifeTime}`
        setCookie(emailCookie);
        return await response.json();
        } catch(err) {
            console.error(err);
            setMessage(constants.uiComponents.authMessageBlock, constants.authModal.messages.serverError, 'error');
        } finally {
            if (constants.uiComponents.emailInput) {
                constants.uiComponents.emailInput.value = '';
            }
        }
    }
    
    async function getCode(e: Event) {
        try {
            e.preventDefault();
            const data = await sendEmail();
            //console.log('data', data);
            return data;
        } catch(err) {
            console.error(err);
        }
    }
    if (!constants.uiComponents.getCodeBtn) return;
    constants.uiComponents.getCodeBtn.addEventListener('click', getCode);
    
    confirmDialogComponent();
}