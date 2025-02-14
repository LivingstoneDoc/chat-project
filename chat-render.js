import { uiComponents } from "./ui-components.js";
import { getMessageTime } from "./utils.js";
import { messageAuthor, messagesDB } from "./db.js";
import { addMessageTomessagesDB, checkDeliveredMessage, changeMessageStatus, checkMessageAuthor } from "./chat-logic.js";
import { settingsDialogOperations } from "./dialog.js";

settingsDialogOperations();

function sendMessage(e) {
    e.preventDefault();
    const timeMessage = getMessageTime();
    const isMessageEmpty = uiComponents.messageInput.value.trim() === '';
    if (isMessageEmpty) {
        return;
    }
    const freshMessage = addMessageTomessagesDB(messageAuthor.me, uiComponents.messageInput.value, timeMessage, false);
    renderMessages(freshMessage);
    uiComponents.sendMessageForm.reset();
    return freshMessage;
}
uiComponents.sendMessageForm.addEventListener('submit', sendMessage);

export function renderMessages(data) {
    uiComponents.messagesWrapper.innerHTML = '';
    const messagesFragment = document.createDocumentFragment();
    data.forEach(dataItem => {
        const message = document.createElement('div');
        message.classList.add('message');
        checkDeliveredMessage(dataItem.isDelivered, message);
        changeMessageStatus(dataItem, message);
        checkMessageAuthor(dataItem.mailer, message);
        const messageContent = uiComponents.messageTemplate.content.cloneNode(true);
        messageContent.querySelector('.mailer').textContent = dataItem.mailer;
        messageContent.querySelector('.text-message').textContent = dataItem.textMessage;
        messageContent.querySelector('.time-message').textContent = dataItem.timeMessage;
        message.append(messageContent);
        messagesFragment.prepend(message);
    });
    
    uiComponents.messagesWrapper.append(messagesFragment);
    console.log(data);
    return uiComponents.messagesWrapper;
}
renderMessages(messagesDB);