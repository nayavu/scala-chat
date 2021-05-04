<template>
  <div class="chat-box">
    <div class="chat-members-list">
      <chat-members-list v-model:target-user-id="targetUserId"></chat-members-list>
    </div>
    <div class="chat-conversation">
      <chat-conversation v-if="targetUserId" :target-user-id="targetUserId"></chat-conversation>
    </div>
  </div>
</template>

<script>
import ChatMembersList from "@/components/chat/ChatMembersList";
import ChatConversation from "@/components/chat/ChatConversation";
import { chatService } from "@/services";

export default {
  name: "ChatBox",
  components: {ChatConversation, ChatMembersList},
  data() {
    return {
      targetUserId: null
    }
  },

  created() {
    // connect to WebSocket
    chatService.connect();

    // load members and messages
    // TODO: add spinners for both
    this.$store.dispatch('chat/loadMembers');
    this.$store.dispatch('chat/loadMessages');
  },

  unmounted() {
    chatService.disconnect();
  }

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
