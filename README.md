# weapp-cli

完整小程序目录 - minigroparm - 可以直接copy使用

注意修改 /src/project.config.json 项目配置信息

## 开发命令

+ start - 监听文件变更并启动开发
+ build - 打包（正式包）
+ test - 打包（测试包）
+ lint - eslint语法检查

## 内置lib包

+ request（/lib/request 基于业务封装，可自行修改）
+ router
+ redux

## 支持

+ 支持scss

## commit检查

commit代码前会强制进行eslint语法检查 不通过则不能commit

## 目录介绍/开发规范

+ api - 对微信api的封装,除此文件夹外,其他地方不允许出现wx.XX()
+ assets - 静态资源 icon等
+ components - 自定义业务组件
+ lib - 依赖包 (包括第三方的/自己开发的)
+ packages - 分包
+ pages - 页面
+ router - 路由层 路由统一定义 方便管理
+ service - 服务端接口定义 方便管理
+ sf-design-mini 视觉组件 (暂时无法统一 可自行修改)
+ store - redux 封装
+ templates - 模版
+ utils - 工具类函数 (包括第三方的/自己开发的)
