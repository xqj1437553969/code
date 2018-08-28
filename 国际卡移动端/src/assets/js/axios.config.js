import axios from 'axios'; // 引入axios
// 创建实例时设置配置的默认值 
// 注意这个实例 在之后的api请求接口时全部用的是server
let service = axios.create({ baseURL:'../'});
// 是否正在刷新的标志
window.isRefreshing = false;
// 存储请求的数组
let refreshSubscribers = [];
//将所有的请求都push到数组中
function subscribeTokenRefresh(cb) { 
	refreshSubscribers.push(cb);
}
// 数组中的请求得到新的token之后自执行，用新的token去请求数据
function onRrefreshed(token) { 
	refreshSubscribers.map(cb => cb(token));
}
// 刷新token的过期时间判断 
function isRefreshTokenExpired() { 
	let oData = loadTimeStamp(); // 这是在登陆时候保存的时间戳 
	let nDta = new Date().getTime(); let stamp = nDta - oData;
	let minutes = parseInt((stamp % (1000 * 60 * 60)) / (1000 * 60)); 
	return minutes >= 30? true : false;
}
function getRefreshToken() { 
	// 刷新token 注意这里用到的service 
	return service.post(proApi.api.refreshUserTokenApi)
	       .then((res) => { return Promise.resolve(res.data)
	       })
}
