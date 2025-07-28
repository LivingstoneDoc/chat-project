import { constants } from "./constants";
import { openDialogWindow, clickCloseDialog, closeDialogOnBackDrop } from "./dialog";
import { setMessage, getToken } from "./utils";
import { getUserResponse } from "./user-info";

export function settingsDialogComponent() {
    if (constants.uiComponents.settingsBtn) {
        constants.uiComponents.settingsBtn.addEventListener('click', () => {
            openDialogWindow(constants.uiComponents.settingsDialog);
        });
    }
    clickCloseDialog(constants.uiComponents.settingsDialog, constants.uiComponents.settingsMessageBlock);

    if (constants.uiComponents.settingsDialog) {
        constants.uiComponents.settingsDialog.addEventListener('click', closeDialogOnBackDrop);
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
            if (constants.uiComponents.changeNameInput) {
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
                return await response.json();
            }
        } catch(err) {
            console.error(err);
            setMessage(constants.uiComponents.settingsMessageBlock, constants.settingsModal.messages.serverError, 'error');
        } finally {
            if (constants.uiComponents.changeNameForm) {
                constants.uiComponents.changeNameForm.reset();
            }
        }
        
    }

    async function getChangedName(e: Event) {
        try {
            e.preventDefault();
            const data = await changeName();
            const newUserName = data.name;
            setMessage(constants.uiComponents.settingsMessageBlock, `${constants.settingsModal.messages.nameChangeSuccessfully} "${newUserName}"`, 'success');
            return data;
        } catch(err) {
            console.error(err);
        }
    }

    if (constants.uiComponents.changeNameForm) {
        constants.uiComponents.changeNameForm.addEventListener('submit', getChangedName);
    }
}