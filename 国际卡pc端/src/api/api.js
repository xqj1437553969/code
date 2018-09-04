//根据开发环境和生产环境配置不同的接口
//console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV=="development"){
	//开发环境，使用服务器代理
	module.exports = {
	   baseUrl:'/api/fuwii',
	   getImgUrl:'/api'
    }
}else{
	//生产环境
	module.exports = {
	   baseUrl:'..',
	   getImgUrl:''
    }
}