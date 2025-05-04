interface HtmlElement {
    settingsBtn: HTMLElement | null,
    closeDialogBtns: NodeListOf<Element> | null,
    settingsDialog: HTMLElement | null,
    settingsMessageBlock: HTMLElement | null,
    changeNameForm: HTMLElement | null,
    changeNameInput: HTMLElement | null,
    changeNameBtn: HTMLElement | null,
    authDialog: HTMLElement | null,
    authMessageBlock: HTMLElement | null,
    confirmDialog: HTMLElement | null,
    confirmMessageBlock: HTMLElement | null,
    body: HTMLElement | null,
    messagesWrapper: HTMLElement | null,
    messageInput: HTMLElement | null,
    sendMessageForm: HTMLElement | null,
    messageTemplate: HTMLElement | null,
    emailInput: HTMLInputElement | null,
    getCodeBtn: HTMLElement | null,
    enterCodeBtn: HTMLElement | null,
    confirmInput: HTMLInputElement | null,
    confirmForm: HTMLFormElement | null,
    chat: HTMLElement | null,
    userInfoBlock: HTMLElement | null,
}

interface AuthModal {
    messages: {
        emptyInputValue: string,
        codeSending: string,
        sentSuccessfully: string,
        spamFolder: string,
        incorrentEmail: string,
        notFoundEmail: string,
        serverError: string,
    },
    responseCodes: {[key: number]: string}
}

const uiComponents: HtmlElement = {
    settingsBtn: document.querySelector('.settings-btn'),
    closeDialogBtns: document.querySelectorAll('.close-dialog-btn'),
    settingsDialog: document.querySelector('#settingsDialog'),
    settingsMessageBlock: null,
    changeNameForm: document.querySelector('.change-name-form'),
    changeNameInput: document.querySelector('.change-name-input'),
    changeNameBtn: document.querySelector('.change-name-btn'),
    authDialog: document.querySelector('#authDialog'),
    authMessageBlock: null,
    confirmDialog: document.querySelector('#confirmDialog'),
    confirmMessageBlock: null,
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
    chat: document.querySelector('.chat'),
    userInfoBlock: document.querySelector('.user-info-block')
};

uiComponents.settingsMessageBlock = uiComponents.settingsDialog?.querySelector('.message-block') || null;
uiComponents.authMessageBlock = uiComponents.authDialog?.querySelector('.message-block') || null;
uiComponents.confirmMessageBlock = uiComponents.confirmDialog?.querySelector('.message-block') || null;

const baseUrl = 'https://edu.strada.one/api';

const authModal: AuthModal = {
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
    uiComponents,
    endpoints: {
        messagesUrl: `${baseUrl}/messages`,
        userUrl: `${baseUrl}/user`,
        meInfoUrl: `${baseUrl}/user/me`,
        webSocketUrl: 'wss://edu.strada.one/websockets?'
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
    },
    userInfoMessages: {
        getUserInfo: 'Вы успешно авторизованы',
        userInfoError: 'Во время получения данных пользователя возникла ошибка'
    }
};