import axios from "axios";
// import { Message, MessageBox } from 'element-ui'

const Axios = axios.create({
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
  },
});

// Axios.interceptors.response.use(
//   response => {
//     if (response.data.code === 400002) {
//       Message({
//         type: 'error',
//         message: response.data.message
//       })

//       MessageBox.confirm('登录超时，立即跳转至登录页？', '提示', {
//         type: 'warning'
//       }).then(() => {
//         window.location.reload(true)
//       }).catch(() => {
//       })
//     }
//     // 暂无数据
//     if (response.data.code === 400031) {
//       return Promise.reject(response.data)
//     }
//     if (response.data.code !== 0) {
//       Message({
//         type: 'error',
//         message: response.data.message
//       })
//       return Promise.reject(response.data)
//     }

//     return response.data
//   },
//   error => {
//     console.log(error)
//     const msg = error.toString()
//     const url = error.request.responseURL
//     Message({ type: 'error', message: `${msg} ${url}` })
//     return Promise.reject(error)
//   }
// )

export const $http = Axios;

// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
  install(Vue) {
    // (Vue, Option)
    Object.defineProperty(Vue.prototype, "$http", { value: Axios });
  },
};
