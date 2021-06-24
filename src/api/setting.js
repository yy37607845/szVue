import axios from '@/libs/api.request'

const routerIndex = [{
    path: '/multilevel',
    name: 'multilevel', // 一级目录
    meta: {
      icon: 'arrow-graph-up-right',
      title: '多级菜单'
    },
    component: Main, // 一级目录必须使用Main组件作为component
    children: [
      {
        path: 'level_2_1',
        name: 'level_2_1', // 一级目录下的二级页面
        meta: {
          icon: 'arrow-graph-up-right',
          title: '二级-1'
        },
        component: () => import('@/view/multilevel/level-1.vue') // 这引入的是页面单文件
      },
      {
        path: 'level_2_2',
        name: 'level_2_2',
        meta: {
          access: ['super_admin'], // 权限控制<Array>，包含可访问该页面的用户权限
          icon: 'arrow-graph-up-right',
          title: '二级-2'
        },
        component: parentView, // 如果该路由不是页面，而是二级即更多级目录，需要用parentView组件
        children: [
          {
            path: 'level_2_2_1',
            name: 'level_2_2_1',
            meta: {
              icon: 'arrow-graph-up-right',
              title: '三级'
            },
            component: () => import('@/view/multilevel/level-2/level-2-1.vue')
          }
        ]
      }
    ]
  }]

export const routeindex = () => {
    return routerIndex
  }

