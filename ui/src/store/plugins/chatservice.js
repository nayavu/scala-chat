import { chatSocketService } from "@/services";

function createChatServicePlugin() {
    return (store) => {
        chatSocketService
            .onNewMessage(data => {
                store.dispatch('messages/receiveMessage', data);

                // Reset 'typing' status (if any)
                store.dispatch('members/setMemberStatus', { memberId: data.senderId, status: null });
            })
            .onMessageRead(data => {
                store.dispatch('messages/markSentMessageAsRead', data)
            })

            .onStartedTyping(data => {
                store.dispatch('members/setMemberStatus', { memberId: data.memberId, status: 'typing' });
            })
            .onStoppedTyping(data => {
                store.dispatch('members/setMemberStatus', { memberId: data.memberId, status: null });
            })

            .onMemberJoined(data => {
                store.dispatch('members/joinMember', data)
                store.dispatch('visualization/addNode', data.memberId)
            })
            .onMemberBecameAway(data => {
                store.dispatch('members/markAsAway', data)
                store.dispatch('visualization/deleteNode', data.memberId)
            })
            .onMemberLeft(data => {
                store.dispatch('members/leaveMember', data)
                store.dispatch('visualization/deleteNode', data.memberId)
            })

            .onSocketConnected(() => {
                store.dispatch('chat/setSocketConnected');
            })
            .onSocketDisconnected(() => {
                store.dispatch('chat/setSocketDisconnected');
            })
            .onSocketError(() => {
                store.dispatch('chat/setSocketError');
            });

        store.subscribe((mutation, state) => {
            if (!state.chat.connected) {
                return;
            }
            if (mutation.type === 'messages/ADD_MESSAGE') {
                chatSocketService.sendMessage(mutation.payload);
            } else if (mutation.type === 'messages/MARK_RECEIVED_MESSAGE_AS_READ') {
                chatSocketService.confirmMessageRead(mutation.payload.messageId, mutation.payload.senderId)
            }
        });
    }
}

export const chatServicePlugin = createChatServicePlugin();
