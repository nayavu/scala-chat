import { chatSocketService } from "@/services";

function createChatServicePlugin() {
    return (store) => {
        chatSocketService
            .onNewMessage(data => {
                store.dispatch('messages/receiveMessage', data);

                // Reset 'typing' status (if any)
                store.dispatch('members/setMemberStatus', { memberId: data.senderId, status: null });
            })
            .onNewMessageTrace(data => {
                store.dispatch('visualization/deleteEdge', data)
            })
            .onMessageRead(data => {
                store.dispatch('messages/markSentMessageAsRead', data)
            })

            .onStartedTyping(data => {
                if (store.getters['chat/memberId'] === data.recipientId) {
                    store.dispatch('members/setMemberStatus', { memberId: data.senderId, status: 'typing' });
                }

                store.dispatch('visualization/addEdge', data);
            })
            .onStoppedTyping(data => {
                store.dispatch('members/setMemberStatus', { memberId: data.senderId, status: null });

                store.dispatch('visualization/deleteEdge', data);
            })

            .onMemberJoined(data => {
                store.dispatch('members/joinMember', data)
                store.dispatch('visualization/addNode', { id: data.memberId, label: data.nickname})
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
