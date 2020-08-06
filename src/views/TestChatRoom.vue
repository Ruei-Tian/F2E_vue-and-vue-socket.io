<template>
    <form v-if="!logIn" class="form-login" @submit.prevent="login">
      <label for="userName">
        <span>Your Nick Name</span>
        <input type="text" v-model.trim="userName" id="userName" autocomplete="off">
      </label>
    </form>
    <div v-else>
      <div class="user">
        You are 
         <!-- <span>{{ userId }}</span> -->
         <span>{{ userName }}</span>
      </div>
    <div class="invite-msg" v-if="inviteMsg.msg">
      <span>{{ inviteMsg.msg }}</span>
      <button @click="join(inviteMsg.roomName)">Join!</button>
    </div>
    <ul class="list-users" v-if="!joinRoom">
      <li v-for="user in onlineList" :key="user.id">
        <button @click="startChat(user.id)" :disabled="user.status !== 'free'">{{ user.name }}</button>
      </li>
    </ul>
    <div id="chat-window" v-else> 
      <div id="messages">
        <!-- <h1>{{ connections }} connections</h1> -->
        <div 
          v-for="(message, index) in messages" 
          :key="message.content + message.author + index"
          :class="{[message.type] : true, 'self': message.author === userName}">
          <span 
            v-if="message.type === 'message'" 
            :class="`${message.type}-author`">{{ message.author }}:</span>
          <span 
            :class="`${message.type}-content`">{{ message.content }}</span>
        </div>
      </div>
    <div class="hint" v-show="hint">{{ hint }}</div>
    <form @submit.prevent="addMessage">
      <input autocomplete="off" v-model="inputText" />
    </form>
  </div>
  <button @click="leave" v-if="joinRoom">離開聊天室</button>
  </div>

</template>

<script>
// import io from 'socket.io-client';
// const socket = io('http://localhost:3000');
export default {
  name: 'TestChatRoom',
  data() {
    return {
      activeRoom: '',
      logIn: false,
      joinRoom: false,
      userName: '',
      userId: '',
      users: [],
      messages: [],

      inviteMsg: {
        msg: '',
        roomName: ''
      },

      inputText: null,
      info: [],

      typing: false,
      hint: ''
    }
  },
  computed: {
    onlineList() {
      return this.users.filter((user) => user.id != this.userId)
    }
  },
  sockets: {
    //取得此次登入的 id 作為 userId
    transferId(id) {
      this.userId = id;
    },
    // 有人加入或離開時通知
    sendInfo(info) {
      this.messages.push(info);
    },
    // 刪除已離開的 user
    removeUser(user) {
       let targetIndex = this.users.findIndex((el) => el.id === user.id);
        this.users.splice(targetIndex, 1);
    },
    //將新登入的 user 加入清單
    updateUser(users) {
        this.users = users;
    },
    //收取個人訊息
    inviteMsg(res) {
        this.inviteMsg.msg = `${res.creator} invite you to join the chat!`
        this.inviteMsg.roomName = res.roomName;
    },
    addMessage(msg) {
        this.messages.push(msg);
    },
    toggleHint(msg){
        this.hint = msg.content;
    }
  },
  mounted() {  
      window.onbeforeunload = () => {
        this.$socket.emit('logout', {
        name: this.userName,
        id: this.userId
      });
      this.$socket.emit('leaveRoom', {
        roomName: this.activeRoom,
        userName: this.userName,
      })
      }
  },
  beforeDestroy() {
      this.$socket.emit('logout', {
        name: this.userName,
        id: this.userId
      });
      this.$socket.emit('leaveRoom', {
        roomName: this.activeRoom,
        userName: this.userName,
      })
  },
  methods: {
    login() {
      console.log(this.userName, this.userId);
      if(!this.userName) return;
      if(!this.userId) return;

      this.logIn = true;
      // this.$socket.emit('joined', this.userName);
      this.$socket.emit('login', {
        name: this.userName,
        id: this.userId,
        status: 'free'
      })
      
    },
    createOrJoinRoom(id) {
      let roomName = id + this.userId;
      //在伺服器邀請對方加入
      this.$socket.emit('createOrJoinRoom', {
        roomName,
        creatBy: this.userId,
        creator: this.userName,
        invited: id
      });
      this.activeRoom = roomName;
      //邀請後自己先進入房間
      this.$socket.emit('joined', {
        name: this.userName,
        id: this.userId,
        roomName: this.activeRoom
      });
    },
    startChat(targetId) {
      //創建房間並邀請對方加入
        this.createOrJoinRoom(targetId);
        this.joinRoom = true; 
        this.$socket.emit('changeStatus', {
        name: this.userName,
        id: this.userId,
        status: 'chat'
      })
    },
    join(roomName) {
      this.$socket.emit('joined', {
        name: this.userName,
        id: this.userId,
        roomName: this.inviteMsg.roomName
      });
      this.$socket.emit('joinRoom', this.inviteMsg.roomName);
      
      this.joinRoom = true;
      this.$socket.emit('changeStatus', {
        name: this.userName,
        id: this.userId,
        status: 'chat'
      })
      this.activeRoom = this.inviteMsg.roomName;
      this.inviteMsg = {
        msg: '',
        roomName: ''
      };
    },
    addMessage() {
      let newMessage = {
          author: this.userName,
          content: this.inputText,
          type: 'message'
      };

        this.messages.push(newMessage)
        this.$socket.emit('addMessage', {
          room: this.activeRoom,
          msg: newMessage
        });
        this.inputText = '';
    },
    leave() {
      this.$socket.emit('leaveRoom', {
        roomName: this.activeRoom,
        userName: this.userName,
      })
      this.activeRoom = '';
      this.joinRoom = false;
      this.$socket.emit('changeStatus', {
        name: this.userName,
        id: this.userId,
        status: 'free'
      })
      this.messages = [];
    }
  },
  watch: {
    inputText() {
      this.typing = this.inputText ? true : false;
      this.$socket.emit('type', {typing: this.typing, author: this.userName})
    }
  }
}

</script>

<style lang="scss">

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font: 13px Helvetica, Arial; }
input {
  padding: 10px 20px;
}
form.form-login {
    label>span {
      display: block;
      margin-bottom: 10px;
    }
}

.list-users {
  li {
    margin: 10px;
    button {
      padding: 5px;
      width: 100%;
      cursor: pointer;
    }
  }
}

#chat-window {
  min-height: 500px;
  border: 1px solid #999;
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  >form {
    width: 100%;
    input {
      width: 100%;
    }
  }

  >#messages {
    >div {
      padding: 10px;
      letter-spacing: 0.05em;
    }
    >.info {
      background-color: #999;
      color: #fff;
    }

    >.message {
      text-align: left;

      &.self {
        text-align: right;
      }
    }
  } 

  >.hint {
    margin-top: auto;
    margin-bottom: 5px;
  }
}

</style>