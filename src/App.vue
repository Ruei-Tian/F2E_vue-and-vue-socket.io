<template>
  <div id="app">
    <ChatRoom></ChatRoom>
    <!-- <router-view></router-view> -->
</div>
</template>

<script>
import ChatRoom from './views/TestChatRoom'
export default {
  name: 'App',
  components: {
    ChatRoom
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active,
    &.active {
      color: #42b983;
    }
    
  }

</style>
