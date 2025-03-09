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