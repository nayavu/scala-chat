import { memberService, chatSocketService } from "@/services";

export const chatStore = {
    namespaced: true,

    state() {
        return {
            memberId: null,
            nickname: null,
            chatSocketUrl: null,
            sessionToken: null,

            connected: false,

            notification: {
                text: null,
                level: null
            }
        };
    },

    mutations: {
        SET_SESSION(state, payload) {
            state.memberId = payload?.member?.memberId;
            state.nickname = payload?.member?.nickname;
            state.sessionToken = payload?.sessionToken;
            state.chatSocketUrl = payload?.chatSocketUrl;
        },

        SET_CONNECTED(state, connected) {
            state.connected = connected;
        },

        CLEAR_NOTIFICATION(state) {
            state.notification = null;
        },

        SET_NOTIFICATION(state, payload) {
            state.notification = payload;
        }
    },

    actions: {
        async loadSession(context) {
            const memberId = localStorage.getItem('memberId');
            const nickname = localStorage.getItem('nickname');
            const sessionToken = localStorage.getItem('sessionToken');
            const chatSocketUrl = localStorage.getItem('chatSocketUrl');

            if (!memberId || !nickname || !sessionToken || !chatSocketUrl) {
                if (memberId || nickname || sessionToken || chatSocketUrl) {
                    // inconsistent state - clear everything
                    await context.dispatch('clearSession');
                }
                return null;
            }

            try {
                await context.dispatch('members/loadMembers', {memberId, sessionToken}, {root: true});
            } catch (e) {
                // could not load members - possibly invalid session token
                console.warn('Failed to load members list')
                await context.dispatch('clearSession');
                return null;
            }

            context.commit('SET_SESSION', {
                member: {
                    memberId: memberId,
                    nickname: nickname
                },
                sessionToken,
                chatSocketUrl
            });

            chatSocketService.connect(context.state.chatSocketUrl, context.state.sessionToken);
        },

        clearSession(context) {
            localStorage.removeItem('memberId');
            localStorage.removeItem('nickname');
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('chatSocketUrl');

            context.commit('SET_SESSION', null);
        },

        async join(context, payload) {
            context.commit('CLEAR_NOTIFICATION');

            const nickname = payload.nickname;

            const session = await memberService.join(nickname);
            context.commit('SET_SESSION', session);

            chatSocketService.connect(context.state.chatSocketUrl, context.state.sessionToken);

            localStorage.setItem('memberId', context.state.memberId);
            localStorage.setItem('nickname', context.state.nickname);
            localStorage.setItem('sessionToken', context.state.sessionToken);
            localStorage.setItem('chatSocketUrl', context.state.chatSocketUrl);

            await context.dispatch('members/loadMembers',
                {
                    memberId: context.state.memberId,
                    sessionToken: context.state.sessionToken
                },
                {
                    root: true
                }
            );
        },

        async leave(context) {
            console.log('Leaving the chat');

            chatSocketService.disconnect();
            try {
                await memberService.leave(context.state.sessionToken);
            } catch (e) {
                // could not leave the chat properly - possibly invalid session
                // squash this error
            }

            context.commit('CLEAR_NOTIFICATION');

            await context.dispatch('clearSession');
        },

        setSocketConnected(context) {
            context.commit('SET_CONNECTED', true);
        },

        setSocketDisconnected(context) {
            const wasConnected = context.state.connected;
            context.commit('SET_CONNECTED', false);

            if (wasConnected) {
                // seems like server shut down
                context.commit('SET_NOTIFICATION', {text: 'Server connection lost', level: 'error'});
            }
        },

        setSocketError(context) {
            if (!context.state.connected) {
                context.commit('SET_NOTIFICATION', {text: 'Server connection lost', level: 'error'})
                context.dispatch('leave', null);
            }
        },

        notifyMemberStartedTyping(_, recipientId) {
            chatSocketService.notifyMemberStartedTyping(recipientId);
        },

        notifyMemberStoppedTyping(_, recipientId) {
            // it has nothing to do with store, it just wraps service call (for code consistency)
            chatSocketService.notifyMemberStoppedTyping(recipientId);
        },
    },

    getters: {
        isAuthenticated(state) {
            return !!state.sessionToken;
        },

        memberId(state) {
            return state.memberId;
        },

        nickname(state) {
            return state.nickname;
        },

        sessionToken(state) {
            return state.sessionToken;
        },

        connected(state) {
            return state.connected;
        }
    }
};
