import { constants } from "./constants";
import { openDialogWindow, closeDialogWindow, clickCloseDialog, closeDialogOnBackDrop } from "./dialog";
import { setCookie, setMessage, removeMessage } from "./utils";
import { showChatWithMessages } from "./chat-render";
import { getUserResponse } from "./user-info";

export function confirmDialogComponent() {
    if (constants.uiComponents.enterCodeBtn) {
        constants.uiComponents.enterCodeBtn.addEventListener('click', (e: Event) => {
            e.preventDefault();
            openDialogWindow(constants.uiComponents.confirmDialog);
        });
    }
    clickCloseDialog(constants.uiComponents.confirmDialog, constants.uiComponents.confirmMessageBlock);

    if (constants.uiComponents.confirmDialog) {
        constants.uiComponents.confirmDialog.addEventListener('click', closeDialogOnBackDrop);
    }

    function checkConfirmInput() { 
        if (!constants.uiComponents.confirmInput?.value) {
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
            setMessage(constants.uiComponents.userInfoBlock, `${constants.userInfoMessages.getUserInfo}`, 'success');
        } finally {
            if (constants.uiComponents.userInfoBlock) {
                constants.uiComponents.userInfoBlock.classList.remove('hide-content');
            }
            setTimeout(() => removeMessage(constants.uiComponents.userInfoBlock), 3000);
        }
    }

    function enterChat(e: Event) {
        try {
            e.preventDefault();
            if (!checkConfirmInput()) {
                return;
            }
            const tokenFromForm = constants.uiComponents.confirmInput?.value ?? '';
            const tokenCookieString = `token=${tokenFromForm};samesite=lax;max-age=${constants.tokenLifeTime}`;
            setCookie(tokenCookieString);
            closeDialogWindow(constants.uiComponents.confirmDialog);
            closeDialogWindow(constants.uiComponents.authDialog);
            showChatWithMessages();
            showAuthorizedUserMessage();
        } catch(err) {
            console.error(err);
        } finally {
            if (constants.uiComponents.userInfoBlock) {
                constants.uiComponents.userInfoBlock.textContent = '';
            }
        }
    }

    if (constants.uiComponents.userInfoBlock) {
        constants.uiComponents.userInfoBlock.addEventListener('submit', enterChat);
    }
}