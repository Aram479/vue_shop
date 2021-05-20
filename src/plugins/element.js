import Vue from 'vue'
//Message需要全局挂载
import { Button, Form, FormItem, Input, Message } from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

//全局挂载
Vue.prototype.$message = Message