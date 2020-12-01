/*
 * @Author: 刁琪
 * @Date: 2020-11-30 11:17:10
 * @LastEditors: わからないよう
 */
import axios from 'axios';
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? '/' : 'https://loseweight.onbetter.cn';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
export default axios