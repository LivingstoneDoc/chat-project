export function getMessageTime(messageTime) {
    messageTime = new Date(messageTime);
    const options = {
        hour: '2-digit',
        minute: '2-digit'
    };
    const time = messageTime.toLocaleString('ru-RU', options);
    return time;
}

export function setCookie(cookieValue) {
    document.cookie = cookieValue;
}

export function getCookie() {
    return document.cookie.split('; ').reduce((acc, item) => {
        const [key, value] = item.split('=');
        acc[key] = value;
        return acc;
    }, {});
}

export function getToken() {
    const cookie = getCookie();
    const token = cookie.token;
    return token;
}

export function clearMessages(messageBlock) {
    messageBlock.classList.remove('success', 'error', 'info', 'text-center');
}

export function setMessage(messageBlock, message, type) {
    clearMessages(messageBlock);
    messageBlock.textContent = message;
    messageBlock.classList.add(type);
}

export function removeMessage(messageBlock) {
    setTimeout(() => messageBlock.classList.add('hide-content'), 3000);
}