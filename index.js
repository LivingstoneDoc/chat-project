import { authDialogComponent } from "./auth-dialog.js";
import { getToken } from "./utils.js";
import { closeDialogWindow } from "./dialog.js";
import { constants } from "./constants.js";
import { showChatWithMessages } from "./chat-render.js";

function isTokenCookieValid() {
    const token = getToken();
    if (!token) {
        authDialogComponent();
    } else {
        closeDialogWindow(constants.uiComponents.authDialog);
        showChatWithMessages();
    }
    return token;
}
isTokenCookieValid();