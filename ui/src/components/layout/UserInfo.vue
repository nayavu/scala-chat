<template>
  <span>
    You logged in as <strong>{{ nickname }}</strong>
  </span>
  <button @click="logout()">Logout</button>
</template>

<script>
export default {
  name: "UserInfo",
  computed: {
    nickname() {
      return this.$store.getters['auth/nickname'];
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('auth/logout');
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
