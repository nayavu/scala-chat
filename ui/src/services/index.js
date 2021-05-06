import { MemberService } from "./member";
import { ChatSocketService } from "@/services/chatsocket";

const memberService = new MemberService();
const chatSocketService = new ChatSocketService();
export { memberService, chatSocketService };
