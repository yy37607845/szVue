import axios from '@/libs/api.request'

export const getDpData = (userName) => {
    const data = {
      userName
    }
    return axios.request({
      url: '/permission/getArtByPermission',
      data,
      method: 'post'
    })
  }

//获取所有人员信息
export const getAllUserInfo = ()=>{
  return axios.request({
    url: '/permission/users/getAllUserInfo',
    method: 'get'
  })
}
//分页查询人员信息
export const queryUserByPage = ({pageNo, pageSize})=>{
  const data = {
    pageNo,
    pageSize
  }
  return axios.request({
    url: '/permission/users/queryUserByPage',
    data,
    method: 'post'
  })
}
//获取所有组织信息
export const getAllOrg = ()=>{
  return axios.request({
    url: '/permission/org/getAllOrg',
    method: 'get'
  })
}

//获取所有岗位信息
export const getAllStation = () => {
  return axios.request({
    url: '/permission/station/getAllStation',
    method: 'get'
  })
}

//根据用户id或者用户名搜索人员信息
export const queryUserByUserId = (userId) => {
  const data = {
    userId
  }
  return axios.request({
    url: '/permission/users/queryUserByUserId',
    data,
    method: 'post'
  })
}

//同步人员信息
export const syncPerson = () => {
  return axios.request({
    url: '/permission/OASystem/syncUser',
    method: 'post'
  })
}

//根据组织id或者组织名搜索组织
export const queryOrgByName = (orgName) => {
  const data = {
    orgName
  }
  return axios.request({
    url: '/permission/org/queryOrgByName',
    data,
    method: 'post'
  })
}

//同步组织信息
export const syncOrg = () => {
  return axios.request({
    url: '/permission/OASystem/syncOrg',
    method: 'post'
  })
}

//根据职位名称搜索
export const queryStationByName = (stationName) => {
  const data = {
    stationName
  }
  return axios.request({
    url: '/permission/station/queryStationByName',
    data,
    method: 'post'
  })
}

//同步职位信息
export const syncStation = () => {
  return axios.request({
    url: '/permission/OASystem/syncStation',
    method: 'post'
  })
}

//获取项目信息
export const getAllProject = () => {
  return axios.request({
    url: '/permission/settings/getAllProject',
    method: 'get'
  })
} 

//新增 or 更新项目
export const insertOrUpdateProject = (id, name, description) => {
  //不传主键id值时 新增项目
  if(id == ''){
    const data = {
      name,
      description
    }
    return axios.request({
      url: '/permission/settings/insertProject',
      data,
      method: 'post'
    })
  }else{
    const data = {
      id,
      name,
      description
    }
    return axios.request({
      url: '/permission/settings/updateProject',
      data,
      method: 'post'
    })
  }
}

//更新项目 关联部门
export const updateRelatedOrg = (projectId,orgArr) =>{
  const data = {
    projectId,
    orgArr
  }
  return axios.request({
    url: '/permission/settings/updateRelatedOrg',
    data,
    method: 'post'
  })
}

//根据项目名称搜索项目
export const queryProjectByName = (projectName) => {
  const data = {
    projectName
  }
  return axios.request({
    url: '/permission/settings/queryProjectByName',
    data,
    method: 'post'
  })
}

//删除项目
export const delProjectById = (id) => {
  const data = {
    id
  }
  return axios.request({
    url: '/permission/settings/deleteProjectById',
    data,
    method: 'post'
  })
}

//获取所有发布大屏
export const getAllArtOnline = () => {
  return axios.request({
    url: '/permission/settings/getAllArtOnline',
    method: 'get'
  })
}

//根据大屏名称搜索
export const queryArtByName = (name) => {
  const data = {name}
  return axios.request({
    url: '/permission/settings/queryArtByName',
    data,
    method: 'post'
  })
}

//新增大屏
export const insertArt = (artId) => {
  const data = {artId}
  return axios.request({
    url: '/permission/settings/insertScreen',
    data,
    method: 'post'
  })
}

//修改大屏名称
export const updateArtNameById = (artId, name) => {
  const data = {
    artId,
    name
  }
  return axios.request({
    url: '/permission/settings/updateArtNameById',
    data,
    method: 'post'
  })
}

//删除大屏
export const deleteArtById = (artId) => {
  const data = {artId}
  return axios.request({
    url: '/permission/settings/delArtById',
    data,
    method: 'post'
  })
}

//获取级联 已上线大屏
export const getOnlineArt = () => {
  return axios.request({
    url: '/permission/settings/getOnlineArt',
    method: 'get'
  })
}

//大屏管理获取所有项目列表
export const getSelectProject = () => {
  return axios.request({
    url: '/permission/settings/getSelectProject',
    method: 'get'
  })
}

//大屏关联项目
export const artRelProject = (artId, projectIds) => {
  const data = {
    artId,
    projectIds
  }
  return axios.request({
    url: '/permission/settings/artRelProject',
    data,
    method: 'post'
  })
}

//大屏获取职位树
export const getStationTree = (artId) => {
  const data = {artId}
  return axios.request({
    url: '/permission/settings/getStationPermission',
    data,
    method: 'post'
  })
}

//大屏获取所有职位
export const getAllStationSome = () => {
  return axios.request({
    url: '/permission/station/getAllStationSome',
    method: 'get'
  })
}

//大屏设置权限
export const setPermission = (artId, stationArr) => {
  const data = {
    artId,
    stationArr
  }
  return axios.request({
    url: '/permission/settings/setPermission',
    data,
    method: 'post'
  })
}

//获取个人项目列表
export const getPersonProjectList = (orgId, userId) => {
  const data = {orgId, userId}
  return axios.request({
    url: '/permission/screen/getProjectMenuByOrgId',
    data,
    method: 'post'
  })
}

//根据个人项目获取有权限的大屏
export const getAllScreenByProjectId = (projectId) => {
  const data = {projectId}
  return axios.request({
    url: '/permission/screen/getArtTableByProjectId',
    data,
    method: 'post'
  })
}