import { messageAuthor, messagesDB } from "./db.js";

export function addMessageTomessagesDB(mailer, textMessage, timeMessage, isDelivered) {
    messagesDB.push({
        mailer,
        textMessage,
        timeMessage,
        isDelivered
    });
    return messagesDB;
}

export function checkMessageAuthor(mailer, messageItem) {
    const isUsersOwnMessage = mailer === messageAuthor.me;
    if (isUsersOwnMessage) {
        messageItem.classList.add('my-message');
    } else {
        messageItem.classList.add('incoming-message');
    }
    return isUsersOwnMessage;
}

export function checkDeliveredMessage(isDelivered, messageItem) {
    if (isDelivered) {
        messageItem.classList.add('delivered-message');
    } else {
        messageItem.classList.add('sent-message');
    }
    return isDelivered;
}

export function changeMessageStatus(dataItem, messageItem) {
    const isMessageNotDelivered = !dataItem.isDelivered && messageItem.classList.contains('sent-message');
    if (isMessageNotDelivered) {
        setTimeout(() => {
            dataItem.isDelivered = true;
            messageItem.classList.remove('sent-message');
            messageItem.classList.add('delivered-message');

        }, 2000);
    }
    return isMessageNotDelivered;
}