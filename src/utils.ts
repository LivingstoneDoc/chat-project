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

export function getEmail() {
    const cookie = getCookie();
    const email = cookie.email;
    return email;
}

export function clearMessages(messageBlock) {
    messageBlock.classList.remove('success', 'error', 'info', 'text-center');
}

export function setMessage(messageBlock, message, type) {
    clearMessages(messageBlock);
    messageBlock.textContent = message;
    messageBlock.classList.add(type);
    messageBlock.classList.remove('hide-content');
}

export function removeMessage(messageBlock) {
    messageBlock.classList.add('hide-content');
}

export function getMissingElementMessage(element: HTMLElement | null) {
    return `Missing ${element} component`;
}

export function checkUiElement(element: HTMLElement | null) {
    if (!element) {
        console.error(getMissingElementMessage(element));
        return null; 
    }
    return element; 
}