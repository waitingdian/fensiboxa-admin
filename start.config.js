// PM2启动文件入口
// pm2 start start.config.js --env production
module.exports = {
    apps : [
        {
          name: "fensi-admin",
          script: "./server/index.js",
          watch: false,
          env: {
              "PORT": 2808,
              "NODE_ENV": "development"
          },
          env_production: {
              "PORT": 2808,
              "NODE_ENV": "production",
          }
        }
    ]
  }
