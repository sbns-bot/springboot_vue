import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/global.css'//引入global


import ElementPlus from 'element-plus'//引入ElementPlus
import 'element-plus/dist/index.css'//引入ElementPlus相关样式,再使用use(ElementPlus)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'//引入国际化


createApp(App).use(store).use(router).use(ElementPlus, {locale: zhCn}).mount('#app')
//main.js用来引入组件样式
