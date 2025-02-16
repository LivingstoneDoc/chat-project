import { uiComponents } from "./ui-components.js";
import { openDialogWindow, clickCloseDialog, closeDialogOnBackDrop } from "./dialog.js";

export function settingsDialogComponent() {
    uiComponents.settingsBtn.addEventListener('click', () => {
        openDialogWindow(uiComponents.settingsDialog);
    });
    clickCloseDialog(uiComponents.settingsDialog);
    uiComponents.settingsDialog.addEventListener('click', closeDialogOnBackDrop);
}