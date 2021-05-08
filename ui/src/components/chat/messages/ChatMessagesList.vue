<template>
  <ul>
    <li
        v-for="message in messagesList"
        :key="message.messageId"
        :class="{'our-message': message.isOur, 'their-message': !message.isOur, 'unread': !message.readAt}"
        :title="message.readAt ? 'Read at ' + formatTimestamp(message.readAt) : 'Not read'"
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
      // Note that the message list is cloned neither here nor in the storage, so it's just a reference to an array stored in the storage.
      // This is done on purpose to not instantly feed the GC for long chats
      return this.$store.getters['messages/messages'](this.targetMemberId) || [];
    },
    targetMemberMessagesListLength() {
      // The downside of not cloning the message list is, that the component does not exactly know when the list is updated
      // (no object reference changes - no events)
      // We still need to know when the list was changed and the simplest way is to track its length - see watcher below.
      // Moreover, to prevent the case, when user switches to another chat with the same messages count
      // and when the resulting length is not effectively changed, we need to track a pair of member + length.
      return {memberId: this.targetMemberId, length: this.messagesList.length};
    }
  },
  watch: {
    targetMemberMessagesListLength: {
      handler() {
        // This watcher tracks messages length and therefore is triggered on every list change
        // as well as on conversation member change

        const currentMemberId = this.$store.getters['chat/memberId'];
        const lastReadMessage = this.$store.getters['messages/lastReadMessage'](currentMemberId) || -1;

        for (let i = lastReadMessage + 1; i < this.messagesList.length; i++) {
          if (!this.messagesList[i].isOur && !this.messagesList[i].readAt) {
            this.$store.dispatch('messages/markReceivedMessageAsRead', {
              messageId: this.messagesList[i].messageId,
              senderId: this.messagesList[i].senderId
            });
          }
        }
      },
      // run watcher during component creation
      immediate: true
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
