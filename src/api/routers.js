import axios from '@/libs/api.request'

export const getRouterReq = (access) => {
  return axios.request({
    url: 'get_router',
    params: {
      access
    },
    method: 'get'
  })
}

//获取动态路由
export const listMenus = () => {
  return axios.request({
    url: '/permission/routes/getRouters',
    method: 'get'
  })
}
