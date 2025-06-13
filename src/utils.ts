export function getMessageTime(messageTime: number | string | Date) {
    messageTime = new Date(messageTime);
    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit'
    };
    const time = messageTime.toLocaleString('ru-RU', options);
    return time;
}

export function setCookie(cookieValue: string) {
    document.cookie = cookieValue;
}

export function getCookie() {
    return document.cookie.split('; ').reduce((acc: { [key: string]: string }, item) => {
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

export function clearMessages(messageBlock: HTMLElement | null) {
    const uiElement = checkUiElement(messageBlock);
    if (!uiElement) return;
    uiElement.classList.remove('success', 'error', 'info', 'text-center');
}

export function setMessage(messageBlock: HTMLElement | null, message: string, type: string) {
    clearMessages(messageBlock);
    const uiElement = checkUiElement(messageBlock);
    if (!uiElement) return;
    uiElement.textContent = message;
    uiElement.classList.add(type);
    uiElement.classList.remove('hide-content');
}

export function removeMessage(messageBlock: HTMLElement | null) {
    const uiElement = checkUiElement(messageBlock);
    if (!uiElement) return;
    uiElement.classList.add('hide-content');
}

export function getMissingElementMessage<T>(element: T | null) {
    return `Missing ${element} component`;
}

export function checkUiElement<T>(element: T | null) {
    if (!element) {
        console.error(getMissingElementMessage(element));
        return null; 
    }
    return element; 
}