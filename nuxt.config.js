
module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: '粉丝盒后台管理系统',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/css/index.less'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/element-ui',
    { src: '@/plugins/axios', ssr: false },
    { src:'@/plugins/tool', ssr:false },
    { src: "@/assets/iconfont/iconfont.js", ssr: false }
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: (process.env.NODE_ENV === "production" || process.env.NODE_ENV === 'prev') ? "" : "http://47.105.221.99:8082",
    withCredentials: true,
    proxy: process.env.NODE_ENV !== 'production',
    prefix: '/api', // 表示给请求url加个前缀 /api
    credentials: true // 表示跨域请求时是否需要使用凭证
  },
  proxy: {
    '/api/': {
      target: 'http://47.105.221.99:8082', // 代理地址
      changeOrigin: true,
      pathRewrite: {
        '^/api': '' //将 /api 替换掉
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    },
    vendor: ['axios'] // 为防止重复打包
  }
}
