<template>
  <span>
    Your nickname is: <strong>{{ nickname }}</strong>
  </span>
  <button @click="leave()">Leave</button>
</template>

<script>
export default {
  name: "MemberInfo",
  computed: {
    nickname() {
      return this.$store.getters['chat/nickname'];
    }
  },
  methods: {
    async leave() {
      await this.$store.dispatch('chat/leave');
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
span {
  margin-right: 1rem;
}
</style>
