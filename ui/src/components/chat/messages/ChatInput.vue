<template>
  <form @submit.prevent="submit()">
    <input type="text" ref="message" @blur="blur()" @keypress="keypress()" :disabled="disabled">
    <button :disabled="disabled">Send</button>
  </form>
</template>

<script>

export default {
  name: "ChatInput",
  props: ['targetMemberId', 'disabled'],
  data() {
    return {
      isTyping: false,
      sendingMessage: false
    }
  },
  methods: {
    async submit() {
      const currentMemberId = this.$store.getters['chat/memberId'];

      this.$store.dispatch({
        type: 'messages/addMessage',

        senderId: currentMemberId,
        recipientId: this.targetMemberId,
        message: this.$refs.message.value
      });

      this.$refs.message.value = null;
      this.isTyping = false;
    },
    blur() {
      if (this.isTyping) {
        this.isTyping = false;
        this.$store.dispatch('chat/notifyMemberStoppedTyping', this.targetMemberId);
      }
    },
    keypress() {
      if (!this.isTyping) {
        this.isTyping = true;
        this.$store.dispatch('chat/notifyMemberStartedTyping', this.targetMemberId);
      }
    }
  }
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: row;
}

input {
  flex-basis: 100%;
}

button {
  flex-basis: 10rem;
}
</style>
