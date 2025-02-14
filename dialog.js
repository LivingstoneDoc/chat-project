import { uiComponents } from "./ui-components.js";

function openDialogWindow(dialogName) {
    dialogName.showModal();
    uiComponents.body.classList.add('scrollLock');
}

function closeDialogWindow(dialogName) {
    dialogName.close();
    returnScroll();
}

function clickCloseDialog(dialogName) {
    uiComponents.closeDialogBtns.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeDialogWindow(dialogName);
        })
    })
}

function returnScroll() {
    uiComponents.body.classList.remove('scrollLock');
}

function closeDialogOnBackDrop(e) {
    let dialogElement = e.currentTarget;
    if (e.target === e.currentTarget) {
        dialogElement.close();
        returnScroll();
    }
}

function preventEscapeBtn(e) {
    if (e.key === 'Escape') {
        e.preventDefault();
    }
}

export function settingsDialogOperations() {
    uiComponents.settingsBtn.addEventListener('click', () => {
        openDialogWindow(uiComponents.settingsDialog);
    });
    clickCloseDialog(uiComponents.settingsDialog);
    uiComponents.settingsDialog.addEventListener('click', closeDialogOnBackDrop);
}

export function authDialogOperations() {
    openDialogWindow(uiComponents.authDialog);
    uiComponents.authDialog.addEventListener('keydown', preventEscapeBtn);
}