import { uiComponents } from "./ui-components.js";
import { openDialogWindow, preventEscapeBtn } from "./dialog.js";

const authModalMessages = {
    emptyInputValue: 'Пожалуйста, введите Email',
    codeSending: 'Отправка кода...',
    sentSuccessfuly: 'Код успешно отправлен на почту:',
    spamFolder: 'Не забудьте проверить папку спам',
    incorrentEmail: 'Email указан неверно',
    notFoundEmail: 'Email не найден',
    serverError: 'Внутренняя ошибка сервера'
};

const responseCodes = {
    200: authModalMessages.sentSuccessfuly,
    400: authModalMessages.incorrentEmail,
    404: authModalMessages.notFoundEmail,
    500: authModalMessages.serverError
};

export function authDialogComponent() {
    openDialogWindow(uiComponents.authDialog);
    uiComponents.authDialog.addEventListener('keydown', preventEscapeBtn);

    function setMessage(message, type) {
        clearInfoMessages();
        uiComponents.messageBlock.textContent = message;
        uiComponents.messageBlock.classList.add(type);
    }
    
    function checkResponseStatus(status) {
        const message = responseCodes[status];
        if (status === 200) {
            setMessage(`${message} "${uiComponents.emailInput.value}". ${authModalMessages.spamFolder}`, 'success');
        } else {
            setMessage(message, 'error');
        }
    }
    
    function checkInputValue(inputValue) {
        let checkResult = true;
        if (!inputValue) {
            setMessage(authModalMessages.emptyInputValue, 'error');
            checkResult = false;
        }
        return checkResult;
    }
    
    function clearInfoMessages() {
        uiComponents.messageBlock.classList.remove('success', 'error', 'info');
    }
    
    async function sendEmail() {
        try {
            if (!checkInputValue(uiComponents.emailInput.value)) {
                return;
            }
            setMessage(authModalMessages.codeSending, 'info');
            const endpoint = 'https://edu.strada.one/api/user';
            const response = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify({
                email: uiComponents.emailInput.value
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });
        console.log('response', response);
        checkResponseStatus(response.status);
        return await response.json();
        } catch(err) {
            console.error(err);
            setMessage(authModalMessages.serverError, 'error');
        } finally {
            uiComponents.emailInput.value = '';
        }
    }
    
    async function getCode(e) {
        try {
            e.preventDefault();
            const data = await sendEmail();
            console.log('data', data);
            return data;
        } catch(err) {
            console.error(err);
        }
    }
    uiComponents.getCodeBtn.addEventListener('click', getCode);
}