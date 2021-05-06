<template>
  <form @submit.prevent="submit()">
    <input type="text" ref="message" @blur="blur()" @keypress="keypress()" :disabled="disabled">
    <button :disabled="disabled">Send</button>
  </form>
</template>

<script>

export default {
  name: "ChatInput",
  props: ['targetUserId', 'disabled'],
  data() {
    return {
      isTyping: false,
      sendingMessage: false
    }
  },
  methods: {
    async submit() {
      const currentUserId = this.$store.getters['auth/userId'];

      this.$store.dispatch({
        type: 'chat/addMessage',

        senderId: currentUserId,
        recipientId: this.targetUserId,
        message: this.$refs.message.value
      });

      this.$refs.message.value = null;
      this.isTyping = false;
    },
    blur() {
      if (this.isTyping) {
        this.isTyping = false;
        // TODO: detect more smartly the case when user essentially stopped typing but did not click outside of the input field

        const currentUserId = this.$store.getters['auth/userId'];
        this.$store.dispatch('chat/notifyMemberStoppedTyping', {
          senderId: currentUserId,
          recipientId: this.targetUserId
        });
      }
    },
    keypress() {
      if (!this.isTyping) {
        this.isTyping = true;

        const currentUserId = this.$store.getters['auth/userId'];

        this.$store.dispatch('chat/notifyMemberStartedTyping', {
          senderId: currentUserId,
          recipientId: this.targetUserId
        });
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
