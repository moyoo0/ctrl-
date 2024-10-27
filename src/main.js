import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './plugins/element.js'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'

import { request } from './request/request';

// 导入全局css
import 'assets/css/base.css'


// 创建应用实例
const app = createApp(App)

// 安装插件
app.use(router)
app.use(store)
app.use(ElementPlus)

// 设置全局属性
app.config.globalProperties.$request = request

// 关闭生产提示
app.config.productionTip = false

// 挂载应用
app.mount('#app')
