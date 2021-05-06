<template>
  <ul>
    <li
        v-for="member of membersList"
        :key="member.id"
        :class="{'online': member.onlineSince, 'offline': !member.onlineSince, 'selected': member.userId === targetUserId }"
        @click="selectMember(member.userId)"
        :title="getOnlineStatus(member)"
    >
      {{ member.nickname }}
    </li>
  </ul>
  <p v-if="!membersList.length">No other chat members</p>
</template>

<script>
export default {
  name: "ChatMembers",
  emits: ['update:targetUserId'],
  props: ['targetUserId'],
  computed: {
    membersList() {
      return Object.values(this.$store.getters['chat/members']).sort();
    }
  },
  methods: {
    selectMember(id) {
      this.$emit('update:targetUserId', id);
    },
    getOnlineStatus(member) {
      return member.onlineSince ? 'Online since ' + (new Date(member.onlineSince).toLocaleDateString()) : 'Offline';
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
  font-size: 16px;
  padding: 0.5rem;
  cursor: pointer;
}

li:hover {
  background: #dddddd;
}

.online {
  color: #000000;
}

.offline {
  color: #aaaaaa;
}

.selected {
  background: #d7e2ef;
}

p {
  margin: 1rem;
}
</style>
