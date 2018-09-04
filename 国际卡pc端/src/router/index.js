import Vue from 'vue'
import Router from 'vue-router'
import Activation from '@/components/Activation'
const Success = () => import('@/components/Success')
const Query = () => import('@/components/Query')
const QueryResult = () => import('@/components/QueryResult')
Vue.use(Router)
export default new Router({
  routes: [
    {
		    path:'',
		    redirect:"/activation"
	  },
	  {
	    path: '*',
	    redirect:"/activation"
	  },
    {
      path: '/activation',
      name: 'Activation',
      component: Activation
    },
    {
      path: '/activation',
      name: 'Activation',
      component: Activation
    },
    {
    	path: '/success',
      name: 'Success',
      component: Success
    },
    {
    	path: '/query',
      name: 'Query',
      component:Query
    },
    {
    	path: '/queryresult',
      name: 'QueryResult',
      component:QueryResult
    }
  ]
})
