// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import {
  Input,
  Button,
  Select,
  Option,
  DatePicker,
  Message,
  Icon,
  Loading,
  Card
} from 'element-ui';
import App from './App'
import router from './router'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import ElementLocale from 'element-ui/lib/locale'
//import promise from 'es6-promise';
//promise.polyfill();
Vue.use(VueI18n);
Vue.use(Input);
Vue.use(Button);
Vue.use(Select);
Vue.use(Option);
Vue.use(DatePicker);
Vue.use(Icon);
Vue.use(Loading.directive);
Vue.use(Card);
Vue.prototype.$message = Message;
Vue.config.productionTip = false;
/* eslint-disable no-new */
const i18n = new VueI18n({
    locale: 'en',    // 语言标识
    //this.$i18n.locale // 通过切换locale的值来实现语言切换
    messages: {
      'zh': Object.assign(require('./common/lang/zh'),zhLocale),   // 中文语言包
      'en': Object.assign(require('./common/lang/en'),enLocale)  // 英文语言包
    }
})
ElementLocale.i18n((key, value) => i18n.t(key, value))
Vue.filter('formattodate', function (value) {
     return formatToDate(value)
})
new Vue({
  el:'#app',
  i18n, 
  router,
  components: { App },
  template: '<App/>'
})
