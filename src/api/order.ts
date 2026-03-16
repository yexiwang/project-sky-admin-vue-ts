import request from '@/utils/request'

// 查询列表页接口
export const getOrderDetailPage = (params: any) => {
  return request({
    url: '/order/conditionSearch',
    method: 'get',
    params
  })
}

// 查看接口
export const queryOrderDetailById = (params: any) => {
  return request({
    url: `/order/details/${params.orderId}`,
    method: 'get'
  })
}

// 派送接口 (志愿者确认取餐)
export const deliveryOrder = (params: any) => {
  return request({
    url: `/order/delivery/${params.id}`,
    method: 'put' /*  */
  })
}
//完成接口 (志愿者确认送达)
export const completeOrder = (params: any) => {
  return request({
    url: `/order/complete/${params.id}`,
    method: 'put' /*  */
  })
}

//订单取消
export const orderCancel = (params: any) => {
  return request({
    url: '/order/cancel',
    method: 'put' /*  */,
    data: { ...params }
  })
}

//接单 (调度派单)
export const orderAccept = (params: any) => {
  return request({
    url: '/order/confirm',
    method: 'put' /*  */,
    data: { ...params }
  })
}

//助餐点标记出餐
export const markMealReady = (params: any) => {
  return request({
    url: `/order/mealReady/${params.id}`,
    method: 'put'
  })
}

//拒单
export const orderReject = (params: any) => {
  return request({
    url: '/order/rejection',
    method: 'put' /*  */,
    data: { ...params }
  })
}

//获取待处理，待派送，派送中数量
export const getOrderListBy = (params: any) => {
  return request({
    url: '/order/statistics',
    method: 'get' /*  */
  })
}
