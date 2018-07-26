import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Content from '@/components/Content';

import Admin from '@/components/content/Admin';
import Delete from '@/components/content/Delete'
import View from '@/components/content/View'
import Modify from '@/components/content/Modify'
import Query from '@/components/content/Query'
import Checkin from '@/components/content/Checkin'
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/content',
    name: 'Content',
    component: Content,
    children: [
      {
        path: '/content/admin',
        component: Admin
      },
      {
        path: '/content/delete',
        component: Delete
      },
      {
        path: '/content/view',
        component: View
      }, {
        path: '/content/modify',
        component: Modify
      }, {
        path: '/content/checkin',
        component: Checkin
      }, {
        path: '/content/query',
        component: Query
      }
    ]
  }
  ]
})
