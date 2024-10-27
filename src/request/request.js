import axios from 'axios';
import qs from 'qs'


export function request(url, params, method, type, header) {
    const instance = axios.create({
        baseURL: '/api',
        timeout: 10000,
        withCredentials: true,
    })

    // axios拦截器
    instance.interceptors.request.use(config => {
        return config
    })


    if (method && method === 'post') {
        if (type && type === "params") {
            if (params) {
                // 如果header是json，转化为json字符串
                if (header === 'json') {
                    return instance.request({
                        url,
                        data: params,
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                    })
                    // 如果params类型是数组类型
                } else if (type === 'paramsSerializer') {
                    return instance.request({
                        url,
                        data: qs.stringify(params, { arrayFormat: 'repeat' }),
                        method: 'post',
                    })
                }
                // 如果header不是json
                else {
                    return instance.request({
                        url,
                        data: params,
                        method: 'post',
                    })
                }
            }
            else {
                return instance.post(url)
            }
        }
        else {
            // restful的形式,拼接REST风格的URL
            if (params) {
                for (const key in params) {
                    // 拼接url
                    url = url + '/' + params[key];
                }
            }
            return instance.post(url);
        }
    } else if (!method || method === 'get') {
        if (type === 'restful' || !type) {
            // restful的形式
            if (params) {
                for (const key in params) {
                    // 拼接url
                    url = url + '/' + params[key];
                }
            }
            return instance.get(url);
        } else if (type === 'params') {
            console.log(params);
            params = {
                params: params
            }
            return instance.get(url, params)
        }
    } else if (method && method === 'put') {
        if (params) {
            return instance.put(url, params)
        } else {
            return instance.put(url)
        }
    } else if (method && method === 'delete') {
        // restful的形式
        if (params) {
            for (const key in params) {
                // 拼接url
                url = url + '/' + params[key];
            }
        }
        return instance.delete(url);
    }
}

