import { uiComponents } from "./ui-components.js";

export function executeDialogOperations() {
    function openDialogWindow() {
        uiComponents.settingsDialog.showModal();
        uiComponents.body.classList.add('scrollLock');
    }
    uiComponents.settingsBtn.addEventListener('click', openDialogWindow);
    
    function closeDialogWindow() {
        uiComponents.settingsDialog.close();
        returnScroll();
    }
    uiComponents.closeDialogBtn.addEventListener('click', closeDialogWindow);
    
    function returnScroll() {
        uiComponents.body.classList.remove('scrollLock');
    }
    uiComponents.settingsDialog.addEventListener('close', returnScroll);
    
    function closeDialogOnBackDrop(e) {
        let dialogElement = e.currentTarget;
        if (e.target === e.currentTarget) {
            dialogElement.close();
            returnScroll();
        }
    }
    uiComponents.settingsDialog.addEventListener('click', closeDialogOnBackDrop);
}