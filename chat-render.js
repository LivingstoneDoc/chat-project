import { uiComponents } from "./ui-components.js";
import { getMessageTime } from "./utils.js";
import { messageAuthor } from "./db.js";
import { addMessageTomessagesDB, checkDeliveredMessage, changeMessageStatus, checkMessageAuthor } from "./chat-logic.js";
import { settingsDialogComponent } from "./settings-dialog.js";
import { getCookie } from "./utils.js";

const chatMessages = {
    messagesListLoading: 'Загрузка сообщений...',
    emptyMessagesList: 'Список сообщений пуст',
    errorGetMessagesList: 'Во время загрузки сообщений произошла ошибка'
};

function clearMessages() {
    uiComponents.messagesWrapper.classList.remove('success', 'error', 'info', 'text-center');
}

function setMessage(message, type) {
    clearMessages();
    uiComponents.messagesWrapper.textContent = message;
    uiComponents.messagesWrapper.classList.add(type);
}

function checkResponseStatus(status) {
    if (status !== 200) {
        setMessage(chatMessages.errorGetMessagesList, 'text-center');
    }
}

function checkMessagesList(messagesList) {
    if (messagesList.length === 0) {
        setMessage(chatMessages.emptyMessagesList, 'text-center');
    }
}

settingsDialogComponent();

// function sendMessage(e) {
//     e.preventDefault();
//     const currentTime = new Date();
//     const timeMessage = getMessageTime(currentTime);
//     const isMessageEmpty = uiComponents.messageInput.value.trim() === '';
//     if (isMessageEmpty) {
//         return;
//     }
//     const freshMessage = addMessageTomessagesDB(messageAuthor.me, uiComponents.messageInput.value, timeMessage, false);
//     renderMessages(freshMessage);
//     uiComponents.sendMessageForm.reset();
//     return freshMessage;
// }
// uiComponents.sendMessageForm.addEventListener('submit', sendMessage);

function getMessageTemplate(data) {
    const message = document.createElement('div');
    message.classList.add('message');
    checkDeliveredMessage(data.isDelivered, message);
    changeMessageStatus(data, message);
    checkMessageAuthor(data.mailer, message);
    const messageContent = uiComponents.messageTemplate.content.cloneNode(true);
    messageContent.querySelector('.mailer').textContent = `${data.user.name}:`;
    messageContent.querySelector('.text-message').textContent = data.text;
    const messageTime = getMessageTime(data.createdAt);
    messageContent.querySelector('.time-message').textContent = messageTime;
    message.append(messageContent);
    return message;
}

export function renderMessages(data) {
    uiComponents.messagesWrapper.innerHTML = '';
    clearMessages();
    checkMessagesList(data);
    const messagesFragment = document.createDocumentFragment();
    data.map(dataItem => {
        const message = getMessageTemplate(dataItem);
        messagesFragment.prepend(message);
    });
    return uiComponents.messagesWrapper.append(messagesFragment);
}

async function getMessagesResponse() {
    try {
        setMessage(chatMessages.messagesListLoading, 'text-center');
        const cookie = getCookie();
        const token = cookie.token;
        const endpoint = 'https://edu.strada.one/api/messages';
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        checkResponseStatus(response.status);
        return await response.json();
    } catch(err) {
        console.error(err);
        setMessage(chatMessages.errorGetMessagesList, 'text-center');
    }
}

async function getMessagesData() {
    try {
        const messagesData = await getMessagesResponse();
        renderMessages(messagesData.messages);
        return messagesData.messages;
    } catch(err) {
        console.error(err);
    }
}

export function showChatWithMessages() {
    uiComponents.chat.classList.remove('hide-chat');
    getMessagesData();
}