import { authDialogComponent } from "./auth-dialog";
import { getToken } from "./utils";
import { closeDialogWindow } from "./dialog";
import { constants } from "./constants";
import { showChatWithMessages } from "./chat-render";
import '../style.css';

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