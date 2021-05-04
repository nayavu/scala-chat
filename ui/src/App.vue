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
    <router-view></router-view>
  </main>
</template>

<script>

import TheNavigator from "@/components/layout/TheNavigator";
import UserInfo from "@/components/layout/UserInfo";

export default {
  name: 'App',
  components: {
    UserInfo,
    TheNavigator
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['auth/isAuthenticated'];
    }
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

main {
  height: calc(100% - 70px)
}

div#app {
  height: 100%;
}

</style>
