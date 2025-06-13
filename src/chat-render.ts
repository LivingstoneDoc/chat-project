import { constants } from "./constants";
import { getMessageTime } from "./utils";
import { settingsDialogComponent } from "./settings-dialog";
import { getToken, getEmail, clearMessages, checkUiElement } from "./utils";

interface User {
    email: string,
    name: string
}

interface MessageData {
    user: User,
    text: string,
    createdAt: string
}

type MessagesList = MessageData[];
type MessagesChunk = MessageData[];
type MessagesChunks = MessagesChunk[];

let socket: WebSocket | null = null;
let currentChunk = 0;
let endHistoryMessageShown = false;

const messagesWrapper = checkUiElement(constants.uiComponents.messagesWrapper);
function setMessage(message: string, type: string) {
    clearMessages(constants.uiComponents.messagesWrapper);
    if (!messagesWrapper) return;
    messagesWrapper.textContent = message;
    messagesWrapper.classList.add(type);
}

function checkResponseStatus(status: number) {
    if (status !== 200) {
        setMessage(constants.chatMessages.errorGetMessagesList, 'text-center');
    }
}

function checkMessagesList(messagesList: MessagesList) {
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

function checkUserEmail(userEmail: string) {
    const emailCookie = getEmail();
    if (emailCookie === userEmail) {
        return true;
    }
}

function getUserMessagesWithDelay(userEmail: string, messageItem: HTMLElement) {
    if (checkUserEmail(userEmail)) {
        messageItem.classList.add('my-message', 'sent-message');
        setTimeout(() => {
            messageItem.classList.remove('sent-message');
            messageItem.classList.add('delivered-message');
        }, 1000);
    }
}

const sendMessageForm = checkUiElement(constants.uiComponents.sendMessageForm);
function sendMessage(event: Event) {
    event.preventDefault();
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.error('WebSocket is not connected');
        return;
    }
    const messageInput = checkUiElement(constants.uiComponents.messageInput);
    if (!messageInput) return;
    const newMessage = messageInput.value.trim();
    if (newMessage) {
        try {
            socket.send(JSON.stringify({text: newMessage}));
            if (!sendMessageForm) return;
            sendMessageForm.reset();
        } catch(error) {
            console.error('Error sending message', error);
        }
    }
}
if (!sendMessageForm) {
    console.error('Send message form not found');
} else {
    sendMessageForm.addEventListener('submit', sendMessage);
}

function getNewMessage(messageData: MessageData) {
    const message = getMessageTemplate(messageData);
    if (!messagesWrapper || !message) return;
    messagesWrapper.append(message);
    if (checkUserEmail(messageData.user.email)) {
        messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
    }
}

function getMessageTemplate(messageData: MessageData) {
    const message = document.createElement('div');
    message.classList.add('message');
    getUserMessagesWithDelay(messageData.user.email, message);
    const messageTemplate = checkUiElement(constants.uiComponents.messageTemplate);
    if (!messageTemplate) return;
    const messageContent = messageTemplate.content.cloneNode(true) as DocumentFragment;
    const mailer = messageContent.querySelector('.mailer');
    const textMessage = messageContent.querySelector('.text-message');
    const timeMessage = messageContent.querySelector('.time-message');
    if (!mailer || !textMessage || !timeMessage) return;
    mailer.textContent = `${messageData.user.name}:`;
    textMessage.textContent = messageData.text;
    const messageTime = getMessageTime(messageData.createdAt);
    timeMessage.textContent = messageTime;
    message.append(messageContent);
    return message;
}

export function renderMessages(messagesList: MessagesList) {
    const messagesChunks: MessagesChunks = [];
    if (!messagesWrapper) return;
    messagesWrapper.innerHTML = '';
    clearMessages(constants.uiComponents.messagesWrapper);
    checkMessagesList(messagesList);
    
    convertMessagesListToChunks(messagesList, messagesChunks);
    
    displayMessagesChunk(messagesChunks[currentChunk]);

    messagesWrapper.addEventListener('scroll', () => {
        handleScroll(messagesChunks);
    });
}

function convertMessagesListToChunks(messagesList: MessagesList, chunksArr: MessagesChunks) {
    const messagesListCopy = [...messagesList];
    const chunkSize = 20;
    for (let i = 0; i < messagesListCopy.length; i += chunkSize) {
        const reversedMessagesInChunk = messagesListCopy.slice(i, i + chunkSize).reverse();
        chunksArr.push(reversedMessagesInChunk);
    }
    return chunksArr;
}

function displayMessagesChunk(chunk: MessagesChunk) {
    if (!messagesWrapper) return;
    const messagesFragment = document.createDocumentFragment();
    chunk.forEach(item => {
        const message = getMessageTemplate(item);
        if (!message) return;
        message.classList.add('delivered-message');
        messagesFragment.append(message);
    })
    if (currentChunk > 0) {
        messagesWrapper.prepend(messagesFragment);
        const firstMessage = messagesWrapper.firstChild;
        if (firstMessage && firstMessage instanceof HTMLElement) {
            messagesWrapper.scrollTop = firstMessage.offsetHeight * chunk.length;
        }
    } else {
        messagesWrapper.append(messagesFragment);
        messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
    }
}

function loadMoreMessages(messagesChunks: MessagesChunks) {
    currentChunk++;
    displayMessagesChunk(messagesChunks[currentChunk]);
}

function handleScroll(chunksArr: MessagesChunks) {
    if (!messagesWrapper) return;
    const needShowMoreMessages = messagesWrapper.scrollTop === 0 && currentChunk < chunksArr.length - 1;
    if (needShowMoreMessages) {
        loadMoreMessages(chunksArr);
    }
    const isTheEndOfHistory = messagesWrapper.scrollTop === 0 && currentChunk === chunksArr.length - 1 && !endHistoryMessageShown;
    if (isTheEndOfHistory) {
        createEndHistoryMessage();
    }
}

function createEndHistoryMessage() {
    if (!messagesWrapper) return;
    const endHistoryMessage = document.createElement('div');
    endHistoryMessage.classList.add('chat-history-message');
    endHistoryMessage.textContent = 'Вся история загружена';
    messagesWrapper.prepend(endHistoryMessage);
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
    const chat = checkUiElement(constants.uiComponents.chat);
    if (!chat) return;
    chat.classList.remove('hide-content');
    getMessagesData();
    initializationWebSocket();
}