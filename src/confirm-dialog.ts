import { constants } from "./constants";
import { openDialogWindow, closeDialogWindow, clickCloseDialog, closeDialogOnBackDrop } from "./dialog";
import { setCookie, setMessage, removeMessage, checkUiElement } from "./utils";
import { showChatWithMessages } from "./chat-render";
import { getUserResponse } from "./user-info";

export function confirmDialogComponent() {
    const enterCodeBtn = checkUiElement(constants.uiComponents.enterCodeBtn);
    if (!enterCodeBtn) return;
    enterCodeBtn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        openDialogWindow(constants.uiComponents.confirmDialog);
    });
    clickCloseDialog(constants.uiComponents.confirmDialog, constants.uiComponents.confirmMessageBlock);
    const confirmDialog = checkUiElement(constants.uiComponents.confirmDialog);
    if (!confirmDialog) return;
    confirmDialog.addEventListener('click', closeDialogOnBackDrop);

    function checkConfirmInput() { 
        const confirmInput = checkUiElement(constants.uiComponents.confirmInput) as HTMLInputElement | null;
        if (!confirmInput) return;
        if (!confirmInput.value) {
            setMessage(constants.uiComponents.confirmMessageBlock, constants.confirmMessages.emptyConfirmInput, 'error');
            return false;
        }
        return true;
    }

    async function showAuthorizedUserMessage() {
        const userInfoBlock = checkUiElement(constants.uiComponents.userInfoBlock);
        if (!userInfoBlock) return;
        try {
            const userData = await getUserResponse();
            const userName = userData.name;
            setMessage(constants.uiComponents.userInfoBlock, `${constants.userInfoMessages.getUserInfo} ${userName}`, 'success');
        } catch(err) {
            console.error(err);
            setMessage(constants.uiComponents.userInfoBlock, `${constants.userInfoMessages.getUserInfo}`, 'success');
        } finally {
            userInfoBlock.classList.remove('hide-content');
            setTimeout(() => removeMessage(constants.uiComponents.userInfoBlock), 3000);
        }
    }

    function enterChat(e: Event) {
        const confirmForm = checkUiElement(constants.uiComponents.userInfoBlock) as HTMLFormElement | null;
        if (!confirmForm) return;
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
            confirmForm.reset();
        }
    }
    const confirmForm = checkUiElement(constants.uiComponents.userInfoBlock) as HTMLFormElement | null;
    if (!confirmForm) return;
    confirmForm.addEventListener('submit', enterChat);
}