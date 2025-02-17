import { uiComponents } from "./ui-components.js";
import { openDialogWindow, clickCloseDialog, closeDialogOnBackDrop } from "./dialog.js";

export function confirmDialogComponent() {
    uiComponents.enterCodeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openDialogWindow(uiComponents.confirmDialog);
    });
    clickCloseDialog(uiComponents.confirmDialog);
    uiComponents.confirmDialog.addEventListener('click', closeDialogOnBackDrop);
}