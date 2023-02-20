//引入axios
import axios from "axios";
//通过axios创建对象-request对象,用于发送请求到后端
const request=axios.create({
    timeout:5000
})

//request拦截器的处理
//1. 可以对请求做统一的处理
//2. 比如统一的加入token, Content-Type等
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(response => {
        let res = response.data; //取出返回 data 的内容
// 如果是返回的文件
        if (response.config.responseType === 'blob') {
            return res
        }
// 如果返回的是 string ,就转成 json 对象
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        return res;
    },error => {
        console.log('err' + error) // 输出错误信息
        return Promise.reject(error)
    }
)

//导出request对象, 在其它文件就可以使用
export default request