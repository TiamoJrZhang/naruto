const axios = config => {
  if (config.error) {
    return Promise.reject({
      error: 'error in axios',
    })
  } else {
    return Promise.resolve({
      ...config,
      result: config.result,
    })
  }
}

//简单的axios使用示列
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    return response
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  },
)

//简单实现中间件机制
axios.interceptors = {
  request: [],
  response: [],
}

//注册请求拦截器
axios.useRequestInterceptor = (resolved, rejected) => {
  axios.interceptors.request.push({
    resolved,
    rejected,
  })
}

//注册响应拦截器
axios.useResponseInterceptor = (resolved, rejected) => {
  axios.interceptors.response.push({
    resolved,
    rejected,
  })
}

function noop() {}

axios.run = config => {
  const chain = [
    {
      resolved: noop,
      rejected: noop,
    },
  ]

  // 把请求拦截器往数组头部推
  axios.interceptors.request.forEach(interceptor => {
    chain.unshift(interceptor)
  })

  // 把响应拦截器往数组尾部推
  axios.interceptors.response.forEach(interceptor => {
    chain.push(interceptor)
  })

  // 把config也包装成一个promise
  let promise = Promise.resolve(config)

  // 利用promise.then的能力递归执行所有的拦截器
  while (chain.length) {
    const {resolved, rejected} = chain.shift()
    promise = promise.then(resolved, rejected)
  }

  // 最后暴露给用户的就是响应拦截器处理过后的promise
  return promise
}
