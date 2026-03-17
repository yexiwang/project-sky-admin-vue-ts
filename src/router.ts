import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/layout/index.vue';
import {
  getToken,
  setToken,
  removeToken,
  getStoreId,
  setStoreId,
  removeStoreId,
  setUserInfo,
  getUserInfo,
  removeUserInfo
} from '@/utils/cookies';
import store from '@/store';

Vue.use(Router);

const router = new Router({
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: () =>
        import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
      meta: { title: '社区老年助餐服务系统', hidden: true, notNeedAuth: true }
    },
    {
      path: '/404',
      component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
      meta: { title: '社区老年助餐服务系统', hidden: true, notNeedAuth: true }
    },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          component: () =>
            import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
          name: 'Dashboard',
          meta: {
            title: '工作台',
            icon: 'dashboard',
            affix: true,
            roles: ['ADMIN']
          }
        },
        // 社区管理员 & 操作员 功能
        {
          path: '/statistics',
          component: () =>
            import(/* webpackChunkName: "shopTable" */ '@/views/statistics/index.vue'),
          meta: {
            title: '数据统计',
            icon: 'icon-statistics',
            roles: ['ADMIN']
          }
        },
        {
          path: 'order',
          component: () =>
            import(/* webpackChunkName: "shopTable" */ '@/views/orderDetails/index.vue'),
          meta: {
            title: '订单调度',
            icon: 'icon-order',
            roles: ['ADMIN', 'OPERATOR']
          }
        },
        // 助餐点管理 (New)
        {
          path: 'diningPoint',
          component: () =>
            import(/* webpackChunkName: "shopTable" */ '@/views/diningPoint/index.vue'),
          meta: {
            title: '助餐点管理',
            icon: 'icon-shop', // 需确认图标
            roles: ['ADMIN']
          }
        },
        // 老人档案管理 (New)
        {
          path: 'elderly',
          component: () =>
            import(/* webpackChunkName: "shopTable" */ '@/views/elderly/index.vue'),
          meta: {
            title: '老人档案',
            icon: 'icon-user', // 需确认图标
            roles: ['ADMIN']
          }
        },
        {
          path: 'setmeal',
          component: () =>
            import(/* webpackChunkName: "shopTable" */ '@/views/setmeal/index.vue'),
          meta: {
            title: '套餐管理',
            icon: 'icon-combo',
            roles: ['ADMIN']
          }
        },
        {
          path: 'dish',
          component: () =>
            import(/* webpackChunkName: "shopTable" */ '@/views/dish/index.vue'),
          meta: {
            title: '菜品管理',
            icon: 'icon-dish',
            roles: ['ADMIN']
          }
        },
        {
          path: '/dish/add',
          component: () =>
            import(/* webpackChunkName: "shopTable" */ '@/views/dish/addDishtype.vue'),
          meta: {
            title: '添加菜品',
            hidden: true,
            roles: ['ADMIN']
          }
        },

        {
          path: 'category',
          component: () =>
            import(/* webpackChunkName: "shopTable" */ '@/views/category/index.vue'),
          meta: {
            title: '分类管理',
            icon: 'icon-category',
            roles: ['ADMIN']
          }
        },
        {
          path: 'employee',
          component: () =>
            import(/* webpackChunkName: "shopTable" */ '@/views/employee/index.vue'),
          meta: {
            title: '员工管理',
            icon: 'icon-employee',
            roles: ['ADMIN']
          }
        },

        {
          path: '/employee/add',
          component: () =>
            import(/* webpackChunkName: "dashboard" */ '@/views/employee/addEmployee.vue'),
          meta: {
            title: '添加员工',
            hidden: true,
            roles: ['ADMIN']
          }
        },

        {
          path: '/setmeal/add',
          component: () =>
            import(/* webpackChunkName: "shopTable" */ '@/views/setmeal/addSetmeal.vue'),
          meta: {
            title: '添加套餐',
            hidden: true,
            roles: ['ADMIN']
          }
        },

        // 志愿者功能 (New)
        {
          path: 'volunteer-tasks',
          component: () =>
            import(/* webpackChunkName: "volunteer" */ '@/views/volunteer/index.vue'),
          meta: {
            title: '我的任务',
            icon: 'icon-order',
            roles: ['VOLUNTEER']
          }
        },

        // 家属功能 (New)
        {
          path: 'family-order',
          component: () =>
            import(/* webpackChunkName: "family" */ '@/views/family/index.vue'),
          meta: {
            title: '点餐',
            icon: 'icon-dish',
            roles: ['FAMILY']
          }
        },
        {
          path: 'family-history',
          component: () =>
            import(/* webpackChunkName: "family" */ '@/views/family/history.vue'),
          meta: {
            title: '历史订单',
            icon: 'icon-order',
            roles: ['FAMILY']
          }
        }
      ]
    },
    {
      path: '*',
      redirect: '/404',
      meta: { hidden: true }
    }
  ]
});

export default router;
