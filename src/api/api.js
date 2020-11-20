/*
 * @Description: 
 * @Author: wish.WuJunLong
 * @Date: 2020-10-22 09:26:28
 * @LastEditTime: 2020-11-20 10:27:09
 * @LastEditors: wish.WuJunLong
 */
import axios from 'axios';

import {message} from 'antd'

let baseUrl = ""
if (process.env.NODE_ENV === 'development') {
    // baseUrl = 'http://192.168.0.31:7996';
    baseUrl = 'http://192.168.0.69:7996';
} else if (process.env.NODE_ENV === 'production') {
    baseUrl = 'http://192.168.0.69:7996';
}

axios.defaults.baseURL = baseUrl; 

let instance = axios.create({
  timeout: 1000 * 12,
});

// http request 拦截器
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    token && (config.headers.Authorization = 'Bearer ' + token);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// http response 拦截器
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if(!localStorage.getItem('token')){
      message.destroy();
      message.error('获取数据失败，请重新获取权限')
    }else {
      message.destroy();
      message.error(error.response?error.response.data.msg: '请求失败，请联系管理员');
      localStorage.removeItem('token')
    }
    return Promise.reject(error);
      
    // if(String(error).indexOf('Network Error') > 0){
    //   message.destroy();
    //   message.error('token失效，请重新获取权限')
    //   localStorage.removeItem('token')
    //   return Promise.reject(error);
    // }else{
    //   message.destroy();
    //   message.error(error.response?error.response.data.msg: '请求失败，请联系管理员');
    //   return Promise.reject(error);
    // }
  }
);

export default instance;
