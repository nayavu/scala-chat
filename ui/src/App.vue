<template>
  <header>
    <div>
      <h1>Chat</h1>
    </div>
    <div>
      <the-navigator v-if="isAuthenticated"></the-navigator>
    </div>
    <div>
      <member-info v-if="isAuthenticated"></member-info>
    </div>
  </header>
  <main>
    <the-notification v-if="notification" :message="notification.text" :level="notification.level"></the-notification>

    <router-view></router-view>
  </main>
</template>

<script>

import TheNavigator from "@/components/layout/TheNavigator";
import TheNotification from "@/components/layout/TheNotification";
import MemberInfo from "@/components/layout/MemberInfo";

export default {
  name: 'App',
  components: {
    MemberInfo,
    TheNotification,
    TheNavigator
  },
  async created() {
    // load from LocalStore previously saved session (if any)
    await this.$store.dispatch('chat/loadSession');
    if (this.isAuthenticated) {
      this.$router.push('/chat');
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['chat/isAuthenticated'];
    },
    notification() {
      return this.$store.getters.['chat/notification'];
    },
  },
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
