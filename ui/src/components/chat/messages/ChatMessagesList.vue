<template>
  <ul>
    <li
        v-for="message in messagesList"
        :key="message.messageId"
        :class="{'our-message': message.isOur, 'their-message': !message.isOur, 'unread': !message.readAt}"
    >
      <span class="timestamp">{{ formatTimestamp(message.sentAt) }}</span>
      <span class="placeholder"></span>
      {{ message.message }}
    </li>
  </ul>

</template>

<script>
export default {
  name: "ChatMessagesList",
  props: ['targetMemberId'],
  computed: {
    messagesList() {
      return this.$store.getters['messages/messages'](this.targetMemberId) || [];
    }
  },
  watch: {
    messagesList(newList) {
      const currentMemberId = this.$store.getters['chat/memberId'];
      const lastReadMessage = this.$store.getters['messages/lastReadMessage'](currentMemberId) || -1;

      for (let i = lastReadMessage + 1; i < newList.length; i++) {
        if (!newList[i].isOur) {
          this.$store.dispatch('messages/markReceivedMessageAsRead', {messageId: newList[i].messageId, senderId: newList[i].senderId});
        }
      }
    }
  },
  methods: {
    formatTimestamp(timestamp) {
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

.unread {
  color: #aaaaaa;
}
</style>
