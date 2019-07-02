import { Message } from 'element-ui';
export default function ({$axios, redirect}) {
  let adminToken = sessionStorage.getItem('adminToken');
  $axios.onRequest(config => {
      if(adminToken){
        adminToken = 'Bearer ' + adminToken
        config.headers["Authorization"] = adminToken;
      }
    if (config.method == 'get') {

    }
  });

  $axios.onResponse(function (response) {
    if ((response.config.url.indexOf('/login') != -1) && (response.data.code == 200)) {
      let adminToken = response.headers['authentication-info']
      sessionStorage.setItem('adminToken', adminToken)
    }
    if (response && response.data && response.data.code == 200) {
      return response.data
    } else {
      Message({
        message: response.data.msg,
        type: 'error'
      });
      return Promise.reject(response.data.msg);
    }
  });

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code == 401) {
      Message({
        message: error.response.data.msg,
        type: 'error'
      });
      location.href = '/login'
    } else if (code >= 400 && code < 500) {
      Message({
        message: error.response.data.msg,
        type: 'error'
      });
    } else if (code == 500) {
      Message({
        message: '服务器内部错误',
        type: 'error'
      });
    }
  })
}
