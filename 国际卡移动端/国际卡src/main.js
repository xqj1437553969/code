// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {DatetimePicker} from 'mint-ui';
import VueI18n from 'vue-i18n'
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.use(VueI18n);
Vue.config.productionTip = false;
/* eslint-disable no-new */
const i18n = new VueI18n({
    locale: 'en',    // 语言标识
    //this.$i18n.locale // 通过切换locale的值来实现语言切换
    messages: {
      'zh': require('./common/lang/zh'),   // 中文语言包
      'en': require('./common/lang/en')    // 英文语言包
    }
})
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
