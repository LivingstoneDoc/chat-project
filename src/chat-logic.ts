import { messageAuthor, messagesDB } from "./db";

interface messageObj {
    mailer: string,
    textMessage: string,
    timeMessage: string,
    isDelivered: boolean,
}

export function addMessageTomessagesDB(mailer: string, textMessage: string, timeMessage: string, isDelivered: boolean) {
    messagesDB.push({
        mailer,
        textMessage,
        timeMessage,
        isDelivered
    });
    return messagesDB;
}

export function checkMessageAuthor(mailer: string, messageItem: HTMLElement) {
    const isUsersOwnMessage = mailer === messageAuthor.me;
    if (isUsersOwnMessage) {
        messageItem.classList.add('my-message');
    } else {
        messageItem.classList.add('incoming-message');
    }
    return isUsersOwnMessage;
}

export function checkDeliveredMessage(isDelivered: string, messageItem: HTMLElement) {
    if (isDelivered) {
        messageItem.classList.add('delivered-message');
    } else {
        messageItem.classList.add('sent-message');
    }
    return isDelivered;
}

export function changeMessageStatus(dataItem: messageObj, messageItem: HTMLElement) {
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