<template>
  <ul>
    <li
        v-for="message in messagesList"
        :key="message.messageId"
        :class="{'our-message': message.isOur, 'their-message': !message.isOur, 'undelivered': !message.delivered}"
    >
      <span class="timestamp">{{ formatTimestamp(message.timestamp) }}</span>
      <span class="placeholder"></span>
      {{ message.message }}
    </li>
  </ul>

</template>

<script>
export default {
  name: "ChatMessagesList",
  props: ['targetUserId'],
  computed: {
    messagesList() {
      const currentUserId = this.$store.getters['auth/userId'];
      const messages = this.$store.getters['chat/messages'][this.targetUserId];
      if (!messages) {
        return;
      }
      return messages
          .map((msg) => {
            return {...msg, isOur: msg.senderId === currentUserId}
          });
    }
  },
  methods: {
    formatTimestamp(timestamp) {
      // TODO move into a helper
      return new Date(timestamp).toLocaleString();
    }
  }
}
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0.5rem;
}

li {
  color: #0d1f61;
}

span.timestamp {
  width: 120px;
  text-align: right;
  color: #aaaaaa;
}

span.placeholder {
  color: #aaaaaa;
  margin: 0 0.5rem;
}

.our-message {
  color: #5271de;
}

.our-message span.placeholder:after {
  content: '««';
}

.their-message span.placeholder:after {
  content: '»»';
}

.undelivered {
  color: #aaaaaa;
}
</style>
