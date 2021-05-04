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
            .onUpdateMember(data => {
                store.dispatch('chat/updateMember', data)
            })
            .onConnected(() => {
                store.dispatch('chat/setSocketConnected');
            })
            .onDisconnected(() => {
                store.dispatch('chat/setSocketDisconnected');
            });

        store.subscribe((mutation, state) => {
            if (mutation.type === 'chat/ADD_MESSAGE' && state.chat.connected) {
                chatService.sendMessage(mutation.payload);
            }
        });
    }
}

export const chatServicePlugin = createChatServicePlugin();
