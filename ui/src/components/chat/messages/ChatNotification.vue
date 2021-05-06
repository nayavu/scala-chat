<template>
  <span>{{ notification }}</span>
</template>

<script>
export default {
  name: "ChatNotification",
  props: ['notification']
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
