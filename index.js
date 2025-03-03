import { authDialogComponent } from "./auth-dialog.js";
import { getCookie } from "./utils.js";
import { closeDialogWindow } from "./dialog.js";
import { uiComponents } from "./ui-components.js";
import { showChatWithMessages } from "./chat-render.js";

const cookie = getCookie();
const cookieToken = cookie.token;
function isTokenCookieValid() {
    if (!cookieToken) {
        authDialogComponent();
    } else {
        closeDialogWindow(uiComponents.authDialog);
        showChatWithMessages();
    }
    return cookieToken;
}
isTokenCookieValid();