import { AuthService } from "./auth";
import { ChatService } from "./chat";

const authService = new AuthService();
const chatService = new ChatService();
export { authService, chatService };
