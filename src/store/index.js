import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoading: false,
    userType: '',
    userName: '',
    userId: '',
    email: '',
    rooms: [],
    // 1: 已預約 2:未預約 3: 已取消 4: 已結束
    bookedTime: []
  },
  mutations: {
    SET_USER_DATA(state, payload) {
      state.userType = payload.userType
      state.userName = payload.userName
      state.userId = payload.userId
      state.email = payload.email
      state.rooms = payload.rooms
      state.bookedTime = payload.bookedTime
    },
    SET_LOADING(state, boolean) {
      state.isLoading = boolean;
    }
  },
  actions: {
  },
  getters: {
  }
})
