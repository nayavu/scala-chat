<template>
  <header>
    <div>
      <h1>Chat</h1>
    </div>
    <div>
      <the-navigator v-if="isAuthenticated"></the-navigator>
    </div>
    <div>
      <user-info v-if="isAuthenticated"></user-info>
    </div>
  </header>
  <main>
    <the-notification v-if="notification" :message="notification.message" :level="notification.level"></the-notification>

    <router-view></router-view>
  </main>
</template>

<script>

import TheNavigator from "@/components/layout/TheNavigator";
import UserInfo from "@/components/layout/UserInfo";
import TheNotification from "@/components/layout/TheNotification";

export default {
  name: 'App',
  components: {
    TheNotification,
    UserInfo,
    TheNavigator
  },
  async created() {
    // load from LocalStore previously saved session (if any)
    await this.$store.dispatch('auth/loadSession');
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['auth/isAuthenticated'];
    },
    notification() {
      return this.$store.getters.notification;
    },
  }
}
</script>

<style>

* {
  box-sizing: border-box;
}

html {
  font-family: sans-serif;
  height: 100%;
}

body {
  padding: 0;
  margin: 0;
  font-size: 14px;
  height: 100%;
}

header {
  display: flex;
  padding: 1rem;
  height: 70px;
  background: #0d1f61;
  color: #FFFFFF;

  justify-content: space-between;
}

h1 {
  margin: 0;
}

div#notification {
  height: 30px;
}

main {
  height: calc(100% - 70px)
}

div#app {
  height: 100%;
}

</style>
