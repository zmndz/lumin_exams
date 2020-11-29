export function execute(method, resource, data, params) {
  return window.$nuxt
    .$axios({
      method,
      url: resource,
      data,
      params
    })
    .then((res) => {
        if (res) {
          return res.data
        } else {
          return false;
        }
    })
    .catch((err)=>{
      console.log('err: ', err)
    })
}
