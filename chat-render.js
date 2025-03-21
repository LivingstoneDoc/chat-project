import { constants } from "./constants.js";
import { getMessageTime } from "./utils.js";
import { messageAuthor } from "./db.js";
import { addMessageTomessagesDB, checkDeliveredMessage, changeMessageStatus, checkMessageAuthor } from "./chat-logic.js";
import { settingsDialogComponent } from "./settings-dialog.js";
import { getToken } from "./utils.js";

function clearMessages() {
    constants.uiComponents.messagesWrapper.classList.remove('success', 'error', 'info', 'text-center');
}

function setMessage(message, type) {
    clearMessages();
    constants.uiComponents.messagesWrapper.textContent = message;
    constants.uiComponents.messagesWrapper.classList.add(type);
}

function checkResponseStatus(status) {
    if (status !== 200) {
        setMessage(constants.chatMessages.errorGetMessagesList, 'text-center');
    }
}

function checkMessagesList(messagesList) {
    if (messagesList.length === 0) {
        setMessage(constants.chatMessages.emptyMessagesList, 'text-center');
    }
}

settingsDialogComponent();

// function sendMessage(e) {
//     e.preventDefault();
//     const currentTime = new Date();
//     const timeMessage = getMessageTime(currentTime);
//     const isMessageEmpty = constants.uiComponents.messageInput.value.trim() === '';
//     if (isMessageEmpty) {
//         return;
//     }
//     const freshMessage = addMessageTomessagesDB(messageAuthor.me, constants.uiComponents.messageInput.value, timeMessage, false);
//     renderMessages(freshMessage);
//     constants.uiComponents.sendMessageForm.reset();
//     return freshMessage;
// }
// constants.uiComponents.sendMessageForm.addEventListener('submit', sendMessage);

function getMessageTemplate(data) {
    const message = document.createElement('div');
    message.classList.add('message');
    checkDeliveredMessage(data.isDelivered, message);
    changeMessageStatus(data, message);
    checkMessageAuthor(data.mailer, message);
    const messageContent = constants.uiComponents.messageTemplate.content.cloneNode(true);
    messageContent.querySelector('.mailer').textContent = `${data.user.name}:`;
    messageContent.querySelector('.text-message').textContent = data.text;
    const messageTime = getMessageTime(data.createdAt);
    messageContent.querySelector('.time-message').textContent = messageTime;
    message.append(messageContent);
    return message;
}

export function renderMessages(data) {
    constants.uiComponents.messagesWrapper.innerHTML = '';
    clearMessages();
    checkMessagesList(data);
    const messagesFragment = document.createDocumentFragment();
    data.map(dataItem => {
        const message = getMessageTemplate(dataItem);
        messagesFragment.prepend(message);
    });
    return constants.uiComponents.messagesWrapper.append(messagesFragment);
}

async function getMessagesResponse() {
    try {
        setMessage(constants.chatMessages.messagesListLoading, 'text-center');
        const messagesUrl = constants.endpoints.messagesUrl;
        const token = getToken();
        const response = await fetch(messagesUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        checkResponseStatus(response.status);
        return await response.json();
    } catch(err) {
        console.error(err);
        setMessage(constants.chatMessages.errorGetMessagesList, 'text-center');
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
    constants.uiComponents.chat.classList.remove('hide-content');
    getMessagesData();
}