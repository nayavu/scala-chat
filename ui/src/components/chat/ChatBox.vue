<template>
  <div class="chat-box">
    <div class="chat-members-list">
      <chat-members-list v-model:target-user-id="targetUserId"></chat-members-list>
    </div>
    <div class="chat-conversation">
      <chat-conversation v-if="targetUser" :target-user="targetUser" :disabled="disabled"></chat-conversation>
    </div>
  </div>
</template>

<script>
import ChatMembersList from "@/components/chat/ChatMembersList";
import ChatConversation from "@/components/chat/ChatConversation";

export default {
  name: "ChatBox",
  components: {ChatConversation, ChatMembersList},
  data() {
    return {
      targetUserId: null
    }
  },
  computed: {
    targetUser() {
      return this.$store.getters['chat/members'][this.targetUserId];
    },
    disabled() {
      return !this.$store.getters['chat/connected'] || !this.targetUser?.onlineSince;
    }
  },
  created() {
    // TODO: add spinner
    this.$store.dispatch('chat/loadMembers');
  },
}
</script>

<style scoped>

.chat-box {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}

.chat-members-list {
  margin: 0;
  padding: 0;
  flex-basis: 300px;
  background: #EEEEEE;
}

.chat-conversation {
  padding: 0;
  margin: 0.5rem;
  float: left;
  flex-basis: 100%;
}

</style>
