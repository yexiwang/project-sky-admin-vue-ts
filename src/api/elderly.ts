import request from '@/utils/request'

export const getElderlyPage = (params: any) => {
  return request({
    url: '/elderly/page',
    method: 'get',
    params
  })
}

export const addElderly = (params: any) => {
  return request({
    url: '/elderly',
    method: 'post',
    data: params
  })
}

export const editElderly = (params: any) => {
  return request({
    url: '/elderly',
    method: 'put',
    data: params
  })
}

export const deleteElderly = (id: number) => {
  return request({
    url: `/elderly/${id}`,
    method: 'delete'
  })
}

export const queryElderlyById = (id: number) => {
  return request({
    url: `/elderly/${id}`,
    method: 'get'
  })
}
