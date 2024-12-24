export function getMessageTime() {
    const currentDate = new Date();
    const options = {
        hour: '2-digit',
        minute: '2-digit'
    };
    const formatter = new Intl.DateTimeFormat('ru-RU', options);
    const time = `${formatter.format(currentDate)}`;
    return time;
}