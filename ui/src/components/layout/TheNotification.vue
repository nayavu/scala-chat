<template>
  <div class="message">
    <span :class="{'error': level === 'error'}">{{ message }}</span>
  </div>
</template>

<script>
export default {
  name: "TheNotification",
  props: ['message', 'level']
}
</script>

<style scoped>
.message {
  text-align: center;
  padding: 0.5rem;
  background: #d7e2ef;
}

.error {
  color: #FF0000;
}
</style>
