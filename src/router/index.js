import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Error from '../views/Error.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/giver',
    name: 'Giver',
    component: () => import(/* webpackChunkName: "giver" */ '../views/giver/Giver.vue'),
    children: [
      {
        path: '',
        name: 'Setting',
        component: () => import(/* webpackChunkName: "giverSetting" */ '../views/giver/Setting.vue')
      },
      {
        path: 'myBooking',
        name: 'GiverBooking',
        component: () => import(/* webpackChunkName: "giverBooking" */ '../views/giver/MyBooking.vue'),
        children: [
          {
            path: '',
            name: 'UnBooked',
            component: () => import(/* webpackChunkName: "unbooked" */ '../components/container/MyBooking/UnBooked.vue')
          },
          {
            path: 'booked',
            name: 'Booked',
            component: () => import(/* webpackChunkName: "booked" */ '../components/container/MyBooking/Booked.vue')
          },
          {
            path: 'tobeconfirmed',
            name: 'ToBeConfirmed',
            component: () => import(/* webpackChunkName: "tobeconfirmed" */ '../components/container/MyBooking/ToBeConfirmed.vue')
          },
          {
            path: 'done',
            name: 'Done',
            component: () => import(/* webpackChunkName: "done" */ '../components/container/MyBooking/Done.vue')
          },
          {
            path: 'canceled',
            name: 'Canceled',
            component: () => import(/* webpackChunkName: "canceled" */ '../components/container/MyBooking/Canceled.vue')
          },
        ]
      }
    ]
  },
  {
    path: '/taker',
    name: 'Taker',
    component: () => import(/* webpackChunkName: "taker" */ '../views/taker/Calendar.vue'),
    children: [
      {
        path: '/myBooking',
        name: 'takerBooking',
        component: () => import(/* webpackChunkName: "takerBooking" */ '../views/taker/MyBooking.vue'),
      }
    ]
  },
  {
    path: '/error',
    name: 'Error',
    component: Error
  },
  {
    path: '*',
    redirect: '/error'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
    next()
})

export default router
