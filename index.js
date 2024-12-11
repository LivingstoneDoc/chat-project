let settingsBtn = document.querySelector('.settings-btn');
let closeDialogBtn = document.querySelector('.close-dialog-btn');
let settingsDialog = document.querySelector('#dialogSettings');
let body = document.querySelector('body');

function openDialogWindow() {
    settingsDialog.showModal();
    body.classList.add('scrollLock');
}
settingsBtn.addEventListener('click', openDialogWindow);

function closeDialogWindow() {
    settingsDialog.close();
    returnScroll();
}
closeDialogBtn.addEventListener('click', closeDialogWindow);

function returnScroll() {
    body.classList.remove('scrollLock');
}
settingsDialog.addEventListener('close', returnScroll);

function closeDialogOnBackDrop(e) {
    let dialogElement = e.currentTarget;
    if (e.target === e.currentTarget) {
        dialogElement.close();
        returnScroll();
    }
}
settingsDialog.addEventListener('click', closeDialogOnBackDrop);