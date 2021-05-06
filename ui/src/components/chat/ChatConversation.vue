<template>
  <div class="chat-conversation-box">
    <div class="chat-messages-list">
      <chat-messages-list :target-member-id="targetMember.memberId"></chat-messages-list>
    </div>
    <div class="chat-notification">
      <chat-status-bar :status-text="statusText"></chat-status-bar>
    </div>
    <div class="chat-input">
      <chat-input :target-member-id="targetMember.memberId" :disabled="disabled"></chat-input>
    </div>
  </div>
</template>

<script>
import ChatMessagesList from "@/components/chat/messages/ChatMessagesList";
import ChatInput from "@/components/chat/messages/ChatInput";
import ChatStatusBar from "@/components/chat/messages/ChatStatusBar";

export default {
  name: "ChatConversation",
  components: {ChatStatusBar, ChatInput, ChatMessagesList},
  props: ['targetMember', 'disabled'],
  computed: {
    statusText() {
      const status = this.$store.getters['members/memberStatus'][this.targetMember.memberId];
      if (status === 'typing') {
        return `${this.targetMember.nickname} is typing`;
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
