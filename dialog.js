import { uiComponents } from "./ui-components.js";

export function openDialogWindow(dialogName) {
    dialogName.showModal();
    uiComponents.body.classList.add('scrollLock');
}

export function closeDialogWindow(dialogName) {
    dialogName.close();
    returnScroll();
}

export function returnScroll() {
    uiComponents.body.classList.remove('scrollLock');
}

export function closeDialogOnBackDrop(e) {
    let dialogElement = e.currentTarget;
    if (e.target === e.currentTarget) {
        dialogElement.close();
        returnScroll();
    }
}