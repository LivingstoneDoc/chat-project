import { constants } from "./constants";
import { removeMessage } from "./utils";

export function openDialogWindow(dialogName: HTMLDialogElement | null) {
    if (dialogName) {
        dialogName.showModal();
    }

    if (constants.uiComponents.body) {
        constants.uiComponents.body.classList.add('scrollLock');
    }
}

export function closeDialogWindow(dialogName: HTMLDialogElement | null) {
    if (dialogName) {
        dialogName.close();
    }
    returnScroll();
}

export function clickCloseDialog(dialogName: HTMLDialogElement | null, messageBlock: HTMLElement | null) {
    if (constants.uiComponents.closeDialogBtns) {
        constants.uiComponents.closeDialogBtns.forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                closeDialogWindow(dialogName);
                removeMessage(messageBlock);
            })
        })
    }
}

function returnScroll() {
    if (constants.uiComponents.body) {
        constants.uiComponents.body.classList.remove('scrollLock');
    }
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