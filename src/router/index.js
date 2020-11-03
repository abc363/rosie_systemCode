// 路由js可以渲染到router-view中去
import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import Resigter from '../components/Resigter.vue'




Vue.use(Router)

export default new Router({
  routes: [
    {path:'/', redirect:'/login'},
    {path: '/login', component: Login },
    {path: '/index', component: Index },
    {path: '/resigter', component: Resigter },

  ]
})
