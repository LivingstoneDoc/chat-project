import { constants } from "./constants.js";
import { openDialogWindow, closeDialogWindow, clickCloseDialog, closeDialogOnBackDrop } from "./dialog.js";
import { setCookie, setMessage, removeMessage } from "./utils.js";
import { showChatWithMessages } from "./chat-render.js";
import { getUserResponse } from "./user-info.js";

export function confirmDialogComponent() {
    constants.uiComponents.enterCodeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openDialogWindow(constants.uiComponents.confirmDialog);
    });
    clickCloseDialog(constants.uiComponents.confirmDialog);
    constants.uiComponents.confirmDialog.addEventListener('click', closeDialogOnBackDrop);

    function checkConfirmInput() {
        if (!constants.uiComponents.confirmInput.value) {
            setMessage(constants.uiComponents.confirmMessageBlock, constants.confirmMessages.emptyConfirmInput, 'error');
            return false;
        }
        return true;
    }

    async function showAuthorizedUserMessage() {
        try {
            const userData = await getUserResponse();
            const userName = userData.name;
            setMessage(constants.uiComponents.userInfoBlock, `${constants.userInfoMessages.getUserInfo} ${userName}`, 'success');
        } catch(err) {
            console.error(err);
            setMessage(constants.uiComponents.userInfoBlock, constants.userInfoMessages.userInfoError, 'error');
        } finally {
            constants.uiComponents.userInfoBlock.classList.remove('hide-content');
            removeMessage(constants.uiComponents.userInfoBlock);
        }
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
            showAuthorizedUserMessage();
        } catch(err) {
            console.error(err);
        } finally {
            constants.uiComponents.confirmForm.reset();
        }
    }
    constants.uiComponents.confirmForm.addEventListener('submit', enterChat);
}