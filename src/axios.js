/*
 * @Author: 刁琪
 * @Date: 2020-11-30 11:17:10
 * @LastEditors: 掉漆
 */
import axios from 'axios';
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? '/' : 'https://perm.diaoshifu.buzz';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
export default axios