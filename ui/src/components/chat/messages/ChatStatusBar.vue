<template>
  <span>{{ statusText }}</span>
</template>

<script>
export default {
  name: "ChatStatusBar",
  props: ['statusText']
}
</script>

<style scoped>
span {
  font-size: 14px;
  color: #cccccc;
  font-style: italic;
  padding: 0.25rem;
}
</style>
