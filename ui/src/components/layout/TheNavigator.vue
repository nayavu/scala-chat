<template>
  <nav>
    <ul>
      <li><router-link to="/chat">Chat</router-link></li>
      <li><router-link to="/visualization">Visualization</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "TheNavigator",
}
</script>

<style scoped>

nav {
  display: block;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  display: inline-block;
  padding: 0.5rem;
}

a {
  text-decoration: none;
  color: #dddddd;
  font-size: 16px;
  font-weight: bold;
  padding: 0.5rem 0.75rem;
}

a:hover, a.router-link-active {
  background: #2d4290;
}
</style>
