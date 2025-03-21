import { constants } from "./constants.js";
import { openDialogWindow, clickCloseDialog, closeDialogOnBackDrop } from "./dialog.js";
import { setMessage, getToken, removeMessage } from "./utils.js";
import { getUserResponse } from "./user-info.js";

export function settingsDialogComponent() {

    constants.uiComponents.settingsBtn.addEventListener('click', () => {
        openDialogWindow(constants.uiComponents.settingsDialog);
        // getUserData();
    });
    clickCloseDialog(constants.uiComponents.settingsDialog, constants.uiComponents.settingsMessageBlock);
    constants.uiComponents.settingsDialog.addEventListener('click', closeDialogOnBackDrop);

    async function getUserData() {
        try {
            const userData = await getUserResponse();
            console.log('userData', userData);
            return userData;
        } catch(err) {
            console.error(err);
        }
    }

    function checkResponseStatus(status) {
        let message = constants.settingsModal.responseCodes[status];
        if (status !== 200) {
            setMessage(constants.uiComponents.settingsMessageBlock, message, 'error');
        }
    }

    function checkSettingsInput(inputValue) {
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
            if (!checkSettingsInput(constants.uiComponents.changeNameInput.value)) {
                return;
            }
            setMessage(constants.uiComponents.settingsMessageBlock, constants.settingsModal.messages.nameChanging, 'info');
            const userUrl = constants.endpoints.userUrl;
            const token = getToken();
            const response = await fetch(userUrl, {
                method: 'PATCH',
                body: JSON.stringify({
                    name: constants.uiComponents.changeNameInput.value
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
            constants.uiComponents.changeNameForm.reset();
        }
        
    }

    async function getChangedName(e) {
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
    constants.uiComponents.changeNameForm.addEventListener('submit', getChangedName);
}