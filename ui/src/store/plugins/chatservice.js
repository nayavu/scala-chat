import { chatService } from "@/services";

function createChatServicePlugin() {
    return (store) => {
        chatService
            .onNewMessage(data => {
                store.dispatch('chat/receiveMessage', data)
            })
            .onMessageDelivered(data => {
                store.dispatch('chat/confirmDelivery', data)
            })
            .onMemberStateChanged(data => {
                store.dispatch('chat/updateMember', data)
            })
            .onMemberStartedTyping(data => {
                store.dispatch('chat/memberStartedTyping', data);
            })
            .onMemberStoppedTyping(data => {
                store.dispatch('chat/memberStoppedTyping', data);
            })
            .onConnected(() => {
                store.dispatch('chat/setSocketConnected');
            })
            .onDisconnected(() => {
                store.dispatch('chat/setSocketDisconnected');
            })
            .onError(() => {
                store.dispatch('chat/socketError');
            });

        store.subscribe((mutation, state) => {
            if (mutation.type === 'chat/ADD_MESSAGE' && state.chat.connected) {
                chatService.sendMessage(mutation.payload);
            }
        });
    }
}

export const chatServicePlugin = createChatServicePlugin();
