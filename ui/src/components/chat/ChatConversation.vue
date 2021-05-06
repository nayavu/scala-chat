<template>
  <div class="chat-conversation-box">
    <div class="chat-messages-list">
      <chat-messages-list :target-user-id="targetUser.userId"></chat-messages-list>
    </div>
    <div class="chat-notification">
      <chat-notification :notification="notification"></chat-notification>
    </div>
    <div class="chat-input">
      <chat-input :target-user-id="targetUser.userId" :disabled="disabled"></chat-input>
    </div>
  </div>
</template>

<script>
import ChatMessagesList from "@/components/chat/messages/ChatMessagesList";
import ChatInput from "@/components/chat/messages/ChatInput";
import ChatNotification from "@/components/chat/messages/ChatNotification";

export default {
  name: "ChatConversation",
  components: {ChatNotification, ChatInput, ChatMessagesList},
  props: ['targetUser', 'disabled'],
  computed: {
    notification() {
      const action = this.$store.getters['chat/memberActions'][this.targetUser.userId];
      if (action == 'typing') {
        return `${this.targetUser.nickname} is typing`;
      } else {
        return null;
      }
    }
  }
}
</script>

<style scoped>

div.chat-conversation-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}

div.chat-messages-list {
  flex-basis: 100%;
}

div.chat-notification {
  flex-basis: 20px;
}

div.chat-input {
  flex-basis: 50px;
}
</style>
