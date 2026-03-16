import request from '@/utils/request'

export const getDiningPointPage = (params: any) => {
  return request({
    url: '/diningPoint/page',
    method: 'get',
    params
  })
}

export const addDiningPoint = (params: any) => {
  return request({
    url: '/diningPoint',
    method: 'post',
    data: params
  })
}

export const editDiningPoint = (params: any) => {
  return request({
    url: '/diningPoint',
    method: 'put',
    data: params
  })
}

export const deleteDiningPoint = (id: number) => {
  return request({
    url: `/diningPoint/${id}`,
    method: 'delete'
  })
}

export const queryDiningPointById = (id: number) => {
  return request({
    url: `/diningPoint/${id}`,
    method: 'get'
  })
}
