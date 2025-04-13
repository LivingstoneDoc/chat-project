import { constants } from "./constants.js";
import { getMessageTime } from "./utils.js";
import { messageAuthor } from "./db.js";
import { addMessageTomessagesDB, checkDeliveredMessage, changeMessageStatus } from "./chat-logic.js";
import { settingsDialogComponent } from "./settings-dialog.js";
import { getToken, getEmail } from "./utils.js";

let socket = null;

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

function initializationWebSocket() {
    const token = getToken();
    try {
        socket = new WebSocket(`${constants.endpoints.webSocketUrl}${token}`);
    
        // socket.addEventListener('open', (event) => {
        //     console.log(`Connection is open. State: ${socket.readyState}`);
        // });
    
        socket.addEventListener('message', (event) => {
            try {
                getNewMessage(JSON.parse(event.data));
            } catch(error) {
                console.error('Error parsing message', error);
            }
        });
    
        socket.addEventListener('error', (error) => {
            console.error(error);
        });
    
        socket.addEventListener('close', (event) => {
            // console.log(`Connection is close. State: ${socket.readyState}`);
            setTimeout(() => initializationWebSocket(), 3000);
        });
    } catch(error) {
        console.error(error);
        setTimeout(() => initializationWebSocket(), 3000);
    }
}

function checkMessageAuthor(userEmail, messageItem) {
    const email = getEmail();
    if (email === userEmail) {
        messageItem.classList.add('my-message');
    }
}

function sendMessage(event) {
    event.preventDefault();
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.error('WebSocket is not connected');
        return;
    }
    const newMessage = constants.uiComponents.messageInput.value.trim();
    if (newMessage) {
        try {
            socket.send(JSON.stringify({text: newMessage}));
            constants.uiComponents.sendMessageForm.reset();
        } catch(error) {
            console.error('Error sending message', error);
        }
    }
}
constants.uiComponents.sendMessageForm.addEventListener('submit', sendMessage);

function getNewMessage(messageData) {
    const message = getMessageTemplate(messageData);
    constants.uiComponents.messagesWrapper.prepend(message);
    constants.uiComponents.messagesWrapper.scrollTop = constants.uiComponents.messagesWrapper.scrollHeight;
}

function getMessageTemplate(data) {
    const message = document.createElement('div');
    message.classList.add('message', 'delivered-message');
    // checkDeliveredMessage(data.isDelivered, message);
    // changeMessageStatus(data, message);
    checkMessageAuthor(data.user.email, message);
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
    data.forEach(dataItem => {
        const message = getMessageTemplate(dataItem);
        messagesFragment.append(message);
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
    initializationWebSocket();
}