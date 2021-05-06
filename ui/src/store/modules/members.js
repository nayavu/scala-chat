import { memberService } from "@/services";

export const membersStore = {
    namespaced: true,

    state() {
        return {
            // A map of memberId => Member,
            // {
            //    "1" : { memberId: "1", nickname: 'Member1', onlineSince: 123456 }
            // }
            members: {},

            // Member status map
            // { "memberId": "typing" }
            memberStatus: {},
        };
    },

    mutations: {
        SET_MEMBERS(state, payload) {
            state.members = payload;
        },

        MERGE_MEMBER(state, payload) {
            const currentMember = state.members[payload.memberId] || {};
            state.members[payload.memberId] = { ...currentMember, ...payload };
        },

        DELETE_MEMBER(state, { memberId }) {
            delete state.members[memberId];
            delete state.memberStatus[memberId];
        },

        SET_MEMBER_STATUS(state, { memberId, status }) {
            state.memberStatus[memberId] = status;
        },
    },

    getters: {
        members(state) {
            return state.members;
        },
        memberStatus(state) {
            return state.memberStatus;
        }
    },

    actions: {
        async loadMembers(context) {
            const sessionToken = context.rootGetters['chat/sessionToken'];
            const membersList = await memberService.loadMembers(sessionToken);
            const members = membersList.reduce((map, item) => { map[item.memberId] = item; return map }, {});
            context.commit('SET_MEMBERS', members);
        },

        joinMember(context, { memberId, nickname, onlineSince }) {
            context.commit('MERGE_MEMBER', { memberId, nickname, onlineSince });
        },

        markAsAway(context, { memberId }) {
            context.commit('SET_MEMBER_STATUS', { memberId, status: null });
            context.commit('MERGE_MEMBER', { memberId, onlineSince: null });
        },

        leaveMember(context, { memberId }) {
            context.commit('DELETE_MEMBER', { memberId });
        },

        setMemberStatus(context, { memberId, status }) {
            context.commit('SET_MEMBER_STATUS', { memberId, status });
        },
    }
};
