import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index'
import Register from './views/Register'
import Login from './views/Login.vue'
import Notfound from './views/404'
import Home from './views/Home'
import Infoshow from './views/Infoshow'
import FundList from './views/FundList'
import InvasionList1 from './views/InvasionList1'
import InvasionList2 from './views/InvasionList2'
import InvasionList3 from './views/InvasionList3'
import InvasionList5 from './views/InvasionList5'
import InvasionMap from './views/InvasionMap'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children:[
        {path:'',component:Home},
        {path:'/home',name:"home",component:Home},
        {path:'/invasionList1',name:"invasionList1",component:InvasionList1},
        {path:'/invasionList2',name:"invasionList2",component:InvasionList2},
        {path:'/invasionList3',name:"invasionList3",component:InvasionList3},
        {path:'/invasionList5',name:"invasionList5",component:InvasionList5},
        {path:'/invasionMap',name:"invasionMap",component:InvasionMap},
        {path:'/infoshow',name:"infoshow",component:Infoshow},
        {path:'/fundList',name:"fundList",component:FundList},
      ]
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '*',
      name: '/404',
      component: Notfound
    }
    
  ]
});

// 路由守卫 防止跳转index token使用
router.beforeEach((to,from,next) => {
  const isLogin = localStorage.eleToken ? true :false;
  if(to.path == "/login" ||to.path == '/register'){
    next();
  }else{
    // 判断真的跳转
    isLogin ? next() : next('/login');
  }
})
export default router;
