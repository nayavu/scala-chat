<template>
  <div class="chat-conversation-box">
    <div class="chat-messages-list">
      <chat-messages-list :target-user-id="targetUserId"></chat-messages-list>
    </div>
    <div class="chat-input">
      <chat-input :target-user-id="targetUserId"></chat-input>
    </div>
  </div>
</template>

<script>
import ChatMessagesList from "@/components/chat/messages/ChatMessagesList";
import ChatInput from "@/components/chat/messages/ChatInput";

export default {
  name: "ChatConversation",
  components: {ChatInput, ChatMessagesList},
  props: ['targetUserId']
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

div.chat-input {
  flex-basis: 50px;
}
</style>
