import { constants } from "./constants.js";
import { openDialogWindow, closeDialogWindow, clickCloseDialog, closeDialogOnBackDrop } from "./dialog.js";
import { setCookie, getToken } from "./utils.js";
import { showChatWithMessages } from "./chat-render.js";

export function confirmDialogComponent() {
    constants.uiComponents.enterCodeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openDialogWindow(constants.uiComponents.confirmDialog);
    });
    clickCloseDialog(constants.uiComponents.confirmDialog);
    constants.uiComponents.confirmDialog.addEventListener('click', closeDialogOnBackDrop);

    function checkConfirmInput() {
        if (!constants.uiComponents.confirmInput.value) {
            constants.uiComponents.confirmMessageBlock.textContent = constants.confirmMessages.emptyConfirmInput;
            constants.uiComponents.confirmMessageBlock.classList.add('error');
            return false;
        }
        return true;
    }

    function enterChat(e) {
        try {
            e.preventDefault();
            if (!checkConfirmInput()) {
                return;
            }
            const tokenFromForm = constants.uiComponents.confirmInput.value;
            const tokenCookieString = `token=${tokenFromForm};samesite=lax;max-age=${constants.tokenLifeTime}`;
            setCookie(tokenCookieString);
            closeDialogWindow(constants.uiComponents.confirmDialog);
            closeDialogWindow(constants.uiComponents.authDialog);
            showChatWithMessages();
            getUser();
        } catch(err) {
            console.error(err);
        } finally {
            constants.uiComponents.confirmForm.reset();
        }
    }
    constants.uiComponents.confirmForm.addEventListener('submit', enterChat);

    async function getInfo() {
        const meInfoUrl = constants.endpoints.meInfoUrl;
        const token = getToken();
        const response = await fetch(meInfoUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        //console.log('response', response);
        return await response.json();
    }
    
    async function getUser() {
        const userData = await getInfo();
        console.log('userData', userData);
    }
}