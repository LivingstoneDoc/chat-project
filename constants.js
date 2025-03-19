const baseUrl = 'https://edu.strada.one/api';

const authModal = {
    messages: {
        emptyInputValue: 'Пожалуйста, введите Email',
        codeSending: 'Отправка кода...',
        sentSuccessfully: 'Код успешно отправлен на почту:',
        spamFolder: 'Не забудьте проверить папку спам',
        incorrentEmail: 'Email указан неверно',
        notFoundEmail: 'Email не найден',
        serverError: 'Внутренняя ошибка сервера'
    },
    responseCodes: {}
};

authModal.responseCodes = {
    200: authModal.messages.sentSuccessfully,
    400: authModal.messages.incorrentEmail,
    404: authModal.messages.notFoundEmail,
    500: authModal.messages.serverError
}

const settingsModal = {
    messages: {
        emptyNameInput: 'Пожалуйста, введите имя',
        nameTooShort: 'Имя слишком короткое',
        nameTooLong: 'Имя слишком длинное',
        nameChanging: 'Загрузка...',
        nameChangeSuccessfully: 'Имя успешно изменено:',
        serverError: 'Внутренняя ошибка сервера'
    },
    responseCodes: {}
};

settingsModal.responseCodes = {
    200: settingsModal.messages.nameChangeSuccessfully,
    500: settingsModal.messages.serverError
};

export const constants = {
    tokenLifeTime: 604800, //count of seconds in a seven days week
    uiComponents: {
        settingsBtn: document.querySelector('.settings-btn'),
        closeDialogBtns: document.querySelectorAll('.close-dialog-btn'),
        settingsDialog: document.querySelector('#settingsDialog'),
        settingsMessageBlock: settingsDialog.querySelector('.message-block'),
        changeNameForm: document.querySelector('.change-name-form'),
        changeNameInput: document.querySelector('.change-name-input'),
        changeNameBtn: document.querySelector('.change-name-btn'),
        authDialog: document.querySelector('#authDialog'),
        authMessageBlock: authDialog.querySelector('.message-block'),
        confirmDialog: document.querySelector('#confirmDialog'),
        confirmMessageBlock: confirmDialog.querySelector('.message-block'),
        body: document.querySelector('body'),
        messagesWrapper: document.querySelector('.messages-wrapper'),
        messageInput: document.querySelector('.message-input'),
        sendMessageForm: document.querySelector('.send-message-form'),
        messageTemplate: document.querySelector('#messageTemplate'),
        emailInput: document.querySelector('.email-input'),
        getCodeBtn: document.querySelector('.get-code-btn'),
        enterCodeBtn: document.querySelector('.enter-code-btn'),
        confirmInput: document.querySelector('.confirm-input'),
        confirmForm: document.querySelector('.confirm-form'),
        chat: document.querySelector('.chat')
    },
    endpoints: {
        messagesUrl: `${baseUrl}/messages`,
        userUrl: `${baseUrl}/user`,
        meInfoUrl: `${baseUrl}/user/me`,
    },
    authModal,
    settingsModal,
    chatMessages: {
        messagesListLoading: 'Загрузка сообщений...',
        emptyMessagesList: 'Список сообщений пуст',
        errorGetMessagesList: 'Во время загрузки сообщений произошла ошибка'
    },
    confirmMessages: {
        emptyConfirmInput: 'Пожалуйста, введите код подтверждения'
    }
};