import { constants } from "./constants";
import { getMessageTime } from "./utils";
import { settingsDialogComponent } from "./settings-dialog";
import { getToken, getEmail, clearMessages } from "./utils";

let socket = null;
let currentChunk = 0;
let endHistoryMessageShown = false;

function setMessage(message, type) {
    clearMessages(constants.uiComponents.messagesWrapper);
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
            setTimeout(() => initializationWebSocket(), 3000);
        });
    } catch(error) {
        console.error(error);
        setTimeout(() => initializationWebSocket(), 3000);
    }
}

function checkUserEmail(userEmail) {
    const emailCookie = getEmail();
    if (emailCookie === userEmail) {
        return true;
    }
}

function getUserMessagesWithDelay(userEmail, messageItem) {
    if (checkUserEmail(userEmail)) {
        messageItem.classList.add('my-message', 'sent-message');
        setTimeout(() => {
            messageItem.classList.remove('sent-message');
            messageItem.classList.add('delivered-message');
        }, 1000);
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
    constants.uiComponents.messagesWrapper.append(message);
    if (checkUserEmail(messageData.user.email)) {
        constants.uiComponents.messagesWrapper.scrollTop = constants.uiComponents.messagesWrapper.scrollHeight;
    }
}

function getMessageTemplate(messageData) {
    const message = document.createElement('div');
    message.classList.add('message');
    getUserMessagesWithDelay(messageData.user.email, message);
    const messageContent = constants.uiComponents.messageTemplate.content.cloneNode(true);
    messageContent.querySelector('.mailer').textContent = `${messageData.user.name}:`;
    messageContent.querySelector('.text-message').textContent = messageData.text;
    const messageTime = getMessageTime(messageData.createdAt);
    messageContent.querySelector('.time-message').textContent = messageTime;
    message.append(messageContent);
    return message;
}

export function renderMessages(messagesList) {
    const messagesChunks = [];
    constants.uiComponents.messagesWrapper.innerHTML = '';
    clearMessages(constants.uiComponents.messagesWrapper);
    checkMessagesList(messagesList);
    
    convertMessagesListToChunks(messagesList, messagesChunks);
    
    displayMessagesChunk(messagesChunks[currentChunk]);

    constants.uiComponents.messagesWrapper.addEventListener('scroll', () => {
        handleScroll(messagesChunks);
    });
}

function convertMessagesListToChunks(messagesList, chunksArr) {
    const messagesListCopy = [...messagesList];
    const chunkSize = 20;
    for (let i = 0; i < messagesListCopy.length; i += chunkSize) {
        const reversedMessagesInChunk = messagesListCopy.slice(i, i + chunkSize).reverse();
        chunksArr.push(reversedMessagesInChunk);
    }
    return chunksArr;
}

function displayMessagesChunk(chunk) {
    const messagesFragment = document.createDocumentFragment();
    chunk.forEach(item => {
        const message = getMessageTemplate(item);
        message.classList.add('delivered-message');
        messagesFragment.append(message);
    })
    if (currentChunk > 0) {
        constants.uiComponents.messagesWrapper.prepend(messagesFragment);
        const firstMessage = constants.uiComponents.messagesWrapper.firstChild;
        constants.uiComponents.messagesWrapper.scrollTop = firstMessage.offsetHeight * chunk.length;
    } else {
        constants.uiComponents.messagesWrapper.append(messagesFragment);
        constants.uiComponents.messagesWrapper.scrollTop = constants.uiComponents.messagesWrapper.scrollHeight;
    }
}

function loadMoreMessages(messagesChunks) {
    currentChunk++;
    displayMessagesChunk(messagesChunks[currentChunk]);
}

function handleScroll(chunksArr) {
    const needShowMoreMessages = constants.uiComponents.messagesWrapper.scrollTop === 0 && currentChunk < chunksArr.length - 1;
    if (needShowMoreMessages) {
        loadMoreMessages(chunksArr);
    }
    const isTheEndOfHistory = constants.uiComponents.messagesWrapper.scrollTop === 0 && currentChunk === chunksArr.length - 1 && !endHistoryMessageShown;
    if (isTheEndOfHistory) {
        createEndHistoryMessage();
    }
}

function createEndHistoryMessage() {
    const endHistoryMessage = document.createElement('div');
    endHistoryMessage.classList.add('chat-history-message');
    endHistoryMessage.textContent = 'Вся история загружена';
    constants.uiComponents.messagesWrapper.prepend(endHistoryMessage);
    endHistoryMessageShown = true;
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