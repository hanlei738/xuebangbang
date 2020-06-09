import request from '@/utils/request'

export function page(params) {
  return request({
    url: '/example/page',
    method: 'post',
    data: params
  })
}

export function add(params) {
  return request({
    url: '/example/add',
    method: 'post',
    data: params
  })
}

export function get(params) {
  return request({
    url: '/example/get',
    method: 'post',
    data: params
  })
}

export function update(params) {
  return request({
    url: '/example/update',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/example/delete',
    method: 'post',
    data: params
  })
}
