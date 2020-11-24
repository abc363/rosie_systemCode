// 路由js可以渲染到router-view中去
import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import Resigter from '../components/Resigter.vue'




Vue.use(Router)

const router = new Router({
  routes: [
    {path:'/', redirect:'/login'},
    {path: '/login',component: Login },
    {
      path: '/index', 
      component: Index, 
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      }
    },
    {path: '/resigter', component: Resigter },

  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
      if (window.sessionStorage.getItem("username")) {  // 通过vuex state获取当前的token是否存在
          next();
      }
      else {
          next({
              path: '/',
              // query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
          })
      }
  }
  else {
      next();
  }
})
export default router;