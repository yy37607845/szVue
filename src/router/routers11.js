import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/oaInfo',
    name: '人员',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'person',
        name: 'person',
        meta: {
          icon: 'ios-people',
          title: '人员'
        },
        component: () => import('@/view/oaInfo/person.vue')
      }
    ]
  },
  {
    path: '/oaInfo',
    name: '部门',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'org',
        name: 'org',
        meta: {
          icon: 'ios-people',
          title: '部门'
        },
        component: () => import('@/view/oaInfo/org.vue')
      }
    ]
  },
  {
    path: '/oaInfo',
    name: '职位',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'station',
        name: 'station',
        meta: {
          icon: 'ios-people',
          title: '职位'
        },
        component: () => import('@/view/oaInfo/station.vue')
      }
    ]
  },
  {
    path: '/multilevel',
    name: 'multilevel',
    meta: {
      showAlways : true,
      icon: 'md-menu',
      title: '项目列表'
    },
    component: Main,
    children: [
      {
        path: 'level_2_1',
        name: 'level_2_1',
        meta: {
          icon: 'md-funnel',
          title: '嵊州农信劳动竞赛大屏项目'
        },
        component: () => import('@/view/multilevel/first.vue')
      },
      {
        path: 'level_2_2',
        name: 'level_2_2',
        meta: {
          access: ['2222'], //对应sysadmin 用户
          icon: 'md-funnel',
          showAlways: true,
          title: '二级-2'
        },
        component: parentView,
        children: [
          {
            path: 'level_2_2_1',
            name: 'level_2_2_1',
            meta: {
              icon: 'md-funnel',
              title: '三级'
            },
            component: () => import('@/view/multilevel/level-2-2/level-3-1.vue')
          }
        ]
      },
      {
        path: 'level_2_3',
        name: 'level_2_3',
        meta: {
          icon: 'md-funnel',
          title: '二级-3'
        },
        component: () => import('@/view/multilevel/seconde.vue')
      }
    ]
  },

  {
    path: '/settings',
    name: 'settings',
    meta: {
      icon: 'ios-settings',
      title: '设置'
    },
    component: Main,
    children: [
      {
        path: 'project',
        name: 'project',
        meta: {
          icon: 'ios-navigate',
          title: '项目管理'
        },
        component: () => import('@/view/settings/project.vue')
      },
      {
        path: 'screen',
        name: 'screen',
        meta: {
          icon: 'ios-navigate',
          title: '大屏管理'
        },
        component: () => import('@/view/settings/screen.vue')
      },
      {
        path: 'auth',
        name: 'auth',
        meta: {
          icon: 'ios-navigate',
          title: '权限管理'
        },
        component: () => import('@/view/settings/auth.vue')
      },
    ]
  },
  
  
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]