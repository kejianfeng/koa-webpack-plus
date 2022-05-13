


###
react-refresh作用是在每一个支持热更新的模块中添加热更新相关代码，避免手动添加

react-refresh-webpack-plugin作用是在webpack中启用react-resfresh功能



## 接入步骤

# Koa-Webpack-Plus
## features
 - base on webpack 5
 - drop webpacl-hot-client
 - real HMR



## 1. 在热更新服务器传入webpack配置
```
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




