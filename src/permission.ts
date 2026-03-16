import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import Cookies from 'js-cookie'

NProgress.configure({ 'showSpinner': false })

router.beforeEach(async (to: Route, _: Route, next: any) => {
  NProgress.start()
  if (Cookies.get('token')) {
    const role = Cookies.get('role') || 'ADMIN'; // 获取用户角色
    
    // 权限校验
    if (to.meta.roles && to.meta.roles.length > 0) {
      if (to.meta.roles.includes(role)) {
        next()
      } else {
        // 无权限，重定向到 404 或首页
        // 简单处理：如果是 ADMIN 去 dashboard，其他角色去各自首页
        if (role === 'ADMIN') next('/dashboard');
        else if (role === 'OPERATOR') next('/order');
        else if (role === 'VOLUNTEER') next('/volunteer-tasks');
        else if (role === 'FAMILY') next('/family-order');
        else next('/404');
        NProgress.done();
      }
    } else {
      next()
    }
  } else {
    if (!to.meta.notNeedAuth) {
      next('/login')
    } else {
      next()
    }
  }
})

router.afterEach((to: Route) => {
  NProgress.done()
  document.title = to.meta.title
})
