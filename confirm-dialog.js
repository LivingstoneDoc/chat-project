import { uiComponents } from "./ui-components.js";
import { openDialogWindow, closeDialogWindow, clickCloseDialog, closeDialogOnBackDrop } from "./dialog.js";
import { setCookie, getCookie } from "./utils.js";
import { showChatWithMessages } from "./chat-render.js";

const tokenLifeTime = 604800; //count of seconds in a seven days week

export function confirmDialogComponent() {
    uiComponents.enterCodeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openDialogWindow(uiComponents.confirmDialog);
    });
    clickCloseDialog(uiComponents.confirmDialog);
    uiComponents.confirmDialog.addEventListener('click', closeDialogOnBackDrop);

    function checkConfirmInput() {
        if (!uiComponents.confirmInput.value) {
            uiComponents.confirmMessageBlock.textContent = 'Пожалуйста, введите код подтверждения';
            uiComponents.confirmMessageBlock.classList.add('error');
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
            const tokenFromForm = uiComponents.confirmInput.value;
            const tokenCookieString = `token=${tokenFromForm};samesite=lax;max-age=${tokenLifeTime}`;
            setCookie(tokenCookieString);
            closeDialogWindow(uiComponents.confirmDialog);
            closeDialogWindow(uiComponents.authDialog);
            showChatWithMessages();
            getUser();
        } catch(err) {
            console.error(err);
        } finally {
            uiComponents.confirmForm.reset();
        }
    }
    uiComponents.confirmForm.addEventListener('submit', enterChat);

    async function getInfo() {
            const cookie = getCookie();
            const token = cookie.token;
            //console.log(cookie);
            //console.log(cookie.token);
        const endpoint = 'https://edu.strada.one/api/user/me';
        const response = await fetch(endpoint, {
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
        //console.log('userData', userData);
    }
}