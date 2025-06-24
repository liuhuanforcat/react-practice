/*
 * @Date: 2023-05-02 23:13:01
 * @LastEditors: liuhuan 1057016137@qq.com
 * @LastEditTime: 2024-04-17 19:22:22
 */
import axios from "axios";
const instance = axios.create({
    baseURL: 'http://localhost:3000',
  timeout: 15000,
  // 允许服务端发送cookie
  withCredentials: true
})
//全局拦截器
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  //获取请求头中的token
//   config.headers.token = getToken();
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

//封装axious请求
export const get = (url: string, params: any = {}) =>
  instance.get(url, { params })

export const post = (url: string, data: any = {}) =>
  instance.post(url, data).then((res) => res.data)

export const put = (url: string, data: any = {}) =>
  instance.put(url, data).then((res) => res.data)

export const patch = (url: string, data: any = {}) =>
  instance.patch(url, data).then((res) => res.data)

export const del = (url: string) =>
  instance.delete(url).then((res) => res.data)
