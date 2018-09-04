// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//import ElementUI from 'element-ui'
//import 'element-ui/lib/theme-chalk/index.css'
//Vue.use(ElementUI);
import {
  Dialog,
  Input,
  Select,
  Option,
  OptionGroup,
  Button,
  DatePicker,
  Form,
  FormItem,
  Upload,
  Cascader,
  Loading,
  MessageBox,
  Message,
  Collapse,
  CollapseItem
} from 'element-ui';
Vue.use(Dialog);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(DatePicker);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Upload);
Vue.use(Cascader);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;
Vue.filter('pricefilter', function (value) {
     return value.split(" ")[0];
})
Vue.filter('namefilter', function (value) {
     return value.split(" ")[1]; 
})
Vue.filter('packagenamefilter', function (value) {
     return value.replace(" ",""); 
})
Vue.filter('descfilter', function (value) {
     return value.replace(/<[^>]*>/g,"，"); 
})
Vue.filter('formattotime', function (value) {
     return formatToTime(value)
})
Vue.filter('formattodate', function (value) {
     return formatToDate(value)
})
window.eventBus = new Vue();
const {baseUrl,getImgUrl} = require("./api/api.js");
Vue.prototype.baseUrl = baseUrl;
Vue.prototype.getImgUrl = getImgUrl;
Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
