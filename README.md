
## 接入步骤

# Koa-Webpack-Plus
## features
 - 基于webpack 5
 - 去除webpacl-hot-client
 - 基于react-refresh--保留应用状态的快速热刷新

## 1. 在热更新服务器传入webpack配置

```
koaWebpack({ webpackConfig }).then(middleware => {
    app.use(middleware).listen(port);
  });
```

## 2. babel添加配置
```
use:[
  {
    loader: 'babel-loader',
    plugins: [
      'react-refresh/babel'
    ]
  }
]
```

## 本插件用到了react-refresh与 react-refresh-webpack-plugin

 - react-refresh作用是在每一个支持热更新的模块中添加热更新相关代码，避免手动添加

 - react-refresh-webpack-plugin作用是在webpack中启用react-resfresh功能




