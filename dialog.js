import { constants } from "./constants.js";

export function openDialogWindow(dialogName) {
    dialogName.showModal();
    constants.uiComponents.body.classList.add('scrollLock');
}

export function closeDialogWindow(dialogName) {
    dialogName.close();
    returnScroll();
}

export function clickCloseDialog(dialogName) {
    constants.uiComponents.closeDialogBtns.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeDialogWindow(dialogName);
        })
    })
}

function returnScroll() {
    constants.uiComponents.body.classList.remove('scrollLock');
}

export function closeDialogOnBackDrop(e) {
    let dialogElement = e.currentTarget;
    if (e.target === e.currentTarget) {
        dialogElement.close();
        returnScroll();
    }
}

export function preventEscapeBtn(e) {
    if (e.key === 'Escape') {
        e.preventDefault();
    }
}