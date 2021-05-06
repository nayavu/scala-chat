<template>
  <div class="form">
    <form @submit.prevent="doLogin">
      <div class="form-control">
        <label for="nickname">Nickname:</label>
        <input type="text" id="nickname" ref="nickname">
      </div>
      <div class="form-message" v-if="errorMessage">
        <span class="error">{{ errorMessage }}</span>
      </div>
      <div>
        <button>Join</button>
      </div>
    </form>
  </div>
</template>

<script>


export default {
  name: "MemberLogin",
  data() {
    return {
      errorMessage: null
    }
  },
  methods: {
    async doLogin() {
      try {
        await this.$store.dispatch('chat/join', { nickname: this.$refs.nickname.value });
        this.$router.push('/chat');
      } catch (e) {
        this.errorMessage = e.message || 'Could not join the chat';
      }
    }
  }
}
</script>

<style scoped>

.form {
  border: 1px solid;
  width: 50%;
  margin: 2rem auto;
  text-align: left;
}

form {
  margin: 1rem;
  padding: 0;
}

.form-control, .form-message {
  margin-bottom: 1rem;
}

label {
  font-weight: bold;
  margin: 0 0.5rem 0.5rem 0;
  display: block;
}

input {
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
  display: block;
  width: 100%;
}

input:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}

span.error {
  color: #FF0000;
}


</style>
