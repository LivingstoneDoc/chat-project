import { uiComponents } from "./ui-components.js";
import { openDialogWindow, clickCloseDialog, closeDialogOnBackDrop } from "./dialog.js";
import { getCookie } from "./utils.js";

export function settingsDialogComponent() {

    const settingModalMessages = {
        emptyNameInput: 'Пожалуйста, введите имя',
        nameTooShort: 'Имя слишком короткое',
        nameTooLong: 'Имя слишком длинное',
        nameChanging: 'Загрузка...',
        nameChangeSuccessfully: 'Имя успешно изменено:',
        serverError: 'Внутренняя ошибка сервера'
    };

    const responseCodes = {
        200: settingModalMessages.nameChangeSuccessfully,
        500: settingModalMessages.serverError
    };

    uiComponents.settingsBtn.addEventListener('click', () => {
        openDialogWindow(uiComponents.settingsDialog);
    });
    clickCloseDialog(uiComponents.settingsDialog);
    uiComponents.settingsDialog.addEventListener('click', closeDialogOnBackDrop);

    function clearInfoMessages() {
        uiComponents.settingsMessageBlock.classList.remove('success', 'error', 'info');
    }

    function setMessage(message, type) {
        clearInfoMessages();
        uiComponents.settingsMessageBlock.textContent = message;
        uiComponents.settingsMessageBlock.classList.add(type);
    }

    function checkResponseStatus(status) {
        let message = responseCodes[status];
        if (status === 200) {
            setMessage(`${message} "${uiComponents.changeNameInput.value}"`, 'success');
        } else {
            setMessage(message, 'error');
        }
    }

    function checkSettingsInput(inputValue) {
        let checkResult = true;
        if (!inputValue) {
            setMessage(settingModalMessages.emptyNameInput, 'error');
            checkResult = false;
        }
        if (inputValue.length === 1) {
            setMessage(settingModalMessages.nameTooShort, 'error');
            checkResult = false;
        }
        if (inputValue.length >= 25) {
            setMessage(settingModalMessages.nameTooLong, 'error');
            checkResult = false;
        }
        return checkResult;
    }

    async function changeName() {
        try {
            if (!checkSettingsInput(uiComponents.changeNameInput.value)) {
                return;
            }
            setMessage(settingModalMessages.nameChanging, 'info');
            const cookie = getCookie();
            const token = cookie.token;
            const endpoint = 'https://edu.strada.one/api/user';
            const response = await fetch(endpoint, {
                method: 'PATCH',
                body: JSON.stringify({
                    name: uiComponents.changeNameInput.value
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${token}`
                }
            });
            checkResponseStatus(response.status);
            console.log('response', response);
            return await response.json();
        } catch(err) {
            console.error(err);
            setMessage(settingModalMessages.serverError, 'error');
        } finally {
            uiComponents.changeNameForm.reset();
        }
        
    }

    async function getChangedName(e) {
        try {
            e.preventDefault();
            const data = await changeName();
            console.log('data', data);
            console.log('data name', data.name);
            return data;
        } catch(err) {
            console.error(err);
        }
    }
    uiComponents.changeNameForm.addEventListener('submit', getChangedName);
}