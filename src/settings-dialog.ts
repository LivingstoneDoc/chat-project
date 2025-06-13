import { constants } from "./constants";
import { openDialogWindow, clickCloseDialog, closeDialogOnBackDrop } from "./dialog";
import { setMessage, getToken, removeMessage, checkUiElement } from "./utils";
import { getUserResponse } from "./user-info";

export function settingsDialogComponent() {

    const settingsBtn = checkUiElement(constants.uiComponents.settingsBtn);
    if (!settingsBtn) return;
    settingsBtn.addEventListener('click', () => {
        openDialogWindow(constants.uiComponents.settingsDialog);
        // getUserData();
    });
    clickCloseDialog(constants.uiComponents.settingsDialog, constants.uiComponents.settingsMessageBlock);
    const settingsDialog = checkUiElement(constants.uiComponents.settingsDialog);
    if (!settingsDialog) return;
    settingsDialog.addEventListener('click', closeDialogOnBackDrop);

    async function getUserData() {
        try {
            const userData = await getUserResponse();
            console.log('userData', userData);
            return userData;
        } catch(err) {
            console.error(err);
        }
    }

    function checkResponseStatus(status: number) {
        let message = constants.settingsModal.responseCodes[status];
        if (status !== 200) {
            setMessage(constants.uiComponents.settingsMessageBlock, message, 'error');
        }
    }

    function checkSettingsInput(inputValue: string) {
        let checkResult = true;
        if (!inputValue) {
            setMessage(constants.uiComponents.settingsMessageBlock, constants.settingsModal.messages.emptyNameInput, 'error');
            checkResult = false;
        }
        if (inputValue.length === 1) {
            setMessage(constants.uiComponents.settingsMessageBlock, constants.settingsModal.messages.nameTooShort, 'error');
            checkResult = false;
        }
        if (inputValue.length >= 25) {
            setMessage(constants.uiComponents.settingsMessageBlock, constants.settingsModal.messages.nameTooLong, 'error');
            checkResult = false;
        }
        return checkResult;
    }

    async function changeName() {
        try {
            const changeNameInput = checkUiElement(constants.uiComponents.changeNameInput);
            if (!changeNameInput) return;
            if (!checkSettingsInput(changeNameInput.value)) {
                return;
            }
            setMessage(constants.uiComponents.settingsMessageBlock, constants.settingsModal.messages.nameChanging, 'info');
            const userUrl = constants.endpoints.userUrl;
            const token = getToken();
            const response = await fetch(userUrl, {
                method: 'PATCH',
                body: JSON.stringify({
                    name: changeNameInput.value
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${token}`
                }
            });
            checkResponseStatus(response.status);
            //console.log('response', response);
            return await response.json();
        } catch(err) {
            console.error(err);
            setMessage(constants.uiComponents.settingsMessageBlock, constants.settingsModal.messages.serverError, 'error');
        } finally {
            const changeNameForm = checkUiElement(constants.uiComponents.changeNameForm);
            if (!changeNameForm) return;
            changeNameForm.reset();
        }
        
    }

    async function getChangedName(e: Event) {
        try {
            e.preventDefault();
            const data = await changeName();
            const newUserName = data.name;
            setMessage(constants.uiComponents.settingsMessageBlock, `${constants.settingsModal.messages.nameChangeSuccessfully} "${newUserName}"`, 'success');
            //console.log('data', data);
            //console.log('data name', data.name);
            return data;
        } catch(err) {
            console.error(err);
        }
    }
    const changeNameForm = checkUiElement(constants.uiComponents.changeNameForm);
    if (!changeNameForm) return;
    changeNameForm.addEventListener('submit', getChangedName);
}