import { constants, UiElement } from "./constants";
import { removeMessage, checkUiElement } from "./utils";

export function openDialogWindow(dialogName: HTMLDialogElement | null) {
    const dialog = checkUiElement(dialogName);
    if (!dialog) return;
    dialog.showModal();
    const body = checkUiElement(constants.uiComponents.body);
    if (!body) return;
    body.classList.add('scrollLock');
}

export function closeDialogWindow(dialogName: HTMLDialogElement | null) {
    const dialog = checkUiElement(dialogName);
    if (!dialog) return;
    dialog.close();
    returnScroll();
}

export function clickCloseDialog(dialogName: HTMLDialogElement | null, messageBlock: HTMLElement | null) {
    const closeDialogBtns = checkUiElement(constants.uiComponents.closeDialogBtns);
    if (!closeDialogBtns) return;
    closeDialogBtns.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeDialogWindow(dialogName);
            removeMessage(messageBlock);
        })
    })
}

function returnScroll() {
    const body = checkUiElement(constants.uiComponents.body);
    if (!body) return;
    body.classList.remove('scrollLock');
}

export function closeDialogOnBackDrop(e: Event) {
    let dialogElement = e.currentTarget;
    if (!(dialogElement instanceof HTMLDialogElement)) return;
    if (e.target === e.currentTarget) {
        dialogElement.close();
        returnScroll();
    }
}

export function preventEscapeBtn(e: KeyboardEvent) {
    if (e.key === 'Escape') {
        e.preventDefault();
    }
}