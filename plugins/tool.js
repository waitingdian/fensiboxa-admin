import Vue from 'vue'

let commonJS = {
  install (Vue, option) {
    // // 该事件是核心
    // if (!sessionStorage.length) {
    //   localStorage.setItem('getSession', Date.now());
    // };
    // 该事件是核心
    window.addEventListener('storage', function(event) {
      //已有窗口
      if (event.key == 'getSession') {
        localStorage.setItem('setSession', JSON.stringify(sessionStorage));
        localStorage.removeItem('setSession');
      }
      //新开窗口
      else if(event.key == 'setSession' && !sessionStorage.length) {
        let data = JSON.parse(event.newValue);
        //赋给这个窗口的sessionStorage
        for (let key in data) {
          sessionStorage.setItem(key, data[key]);
        }
      }
    });
    Vue.prototype.format = (date, fmt) => {
      var that = new Date(date)
      fmt = fmt || "yyyy-MM-dd hh:mm:ss"
      var o = {
        "M+" : that.getMonth()+1,                 //月份
        "d+" : that.getDate(),                    //日
        "h+" : that.getHours(),                   //小时
        "m+" : that.getMinutes(),                 //分
        "s+" : that.getSeconds(),                 //秒
        "q+" : Math.floor((that.getMonth()+3)/3), //季度
        "S"  : that.getMilliseconds()             //毫秒
      };
      if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (that.getFullYear()+"").substr(4 - RegExp.$1.length));
      }
      for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
      }
      return fmt;
    }
  }
}

Vue.use(commonJS)
