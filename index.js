import { renderMessages } from "./chat-render.js";
import { messagesDB } from "./db.js";
import { authDialogOperations } from "./dialog.js";
import { uiComponents } from "./ui-components.js";

authDialogOperations();

// renderMessages(messagesDB);