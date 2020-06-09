import request from '@/utils/request'

export function page(params) {
  return request({
    url: '/order/page',
    method: 'post',
    data: params
  })
}

export function add(params) {
  return request({
    url: '/order/add',
    method: 'post',
    data: params
  })
}

export function get(params) {
  return request({
    url: '/order/get',
    method: 'post',
    data: params
  })
}

export function update(params) {
  return request({
    url: '/order/update',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/order/delete',
    method: 'post',
    data: params
  })
}
