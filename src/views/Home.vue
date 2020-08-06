<template>
  <div class="home">
      <h1>
          <router-link to="/">Who are you?</router-link>
      </h1>
      <form @keyup.enter.prevent="login">
        <label>
          Your Name
          <input type="text" name="" v-model.trim="userName"></label>
        <label>
          Your Position
          <input type="text" name="" v-model.trim="userType">
          </label>
      </form>
     <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Home',
  data() {
    return {
      userName: '',
      userType: ''
    }
  },
  methods: {
    login() {
      if(!this.userName || !this.userType) return;
      console.log('loging....');

      axios.get(`http://localhost:3000/jsondb/users?userName=${this.userName}&userType=${this.userType}`)
      .then((res) => {
        if(!res.data.length) {
          console.log('there is no result');
          return;
        }

        this.$store.commit('SET_USER_DATA', res.data[0]);
        this.$router.push(`/${this.userType}`)
      })
      .catch((err) => console.log(err))
    }
  }

}
</script>

<style lang="scss">
h1>a {
  text-decoration: none;
}

label {
  display: block;
  margin-bottom: 10px;

  input {
    padding: 10px 5px;
  }
}
</style>
