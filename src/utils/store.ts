/**
 * 存储localStorage
 */
export const setStore = (params: { name: any; content: any; type: boolean}) => {
  const { name, content, type } = params
  const obj = {
    dataType: typeof (content),
    content: content,
    type: type,
    datetime: new Date().getTime()
  }
  if (type) window.sessionStorage.setItem(name, JSON.stringify(obj))
  else window.localStorage.setItem(name, JSON.stringify(obj))
}
/**
 * 获取localStorage
 */
export const getStore = (params: { name: any; type?: string; content?: any }) => {
  const { name } = params
  let obj: any = window.localStorage.getItem(name)
  let content
  if (!obj) return
  obj = JSON.parse(obj)
  if (obj.dataType === 'string') {
    content = obj.content
  } else if (obj.dataType === 'number') {
    content = Number(obj.content)
  } else if (obj.dataType === 'boolean') {
    /* eslint-disable */
    content = eval(obj.content)
  } else if (obj.dataType === 'object') {
    content = obj.content
  }
  return content
}
/**
 * 删除localStorage
 */
export const removeStore = (params: { name: any }) => {
  const { name } = params
  window.localStorage.removeItem(name)
  window.sessionStorage.removeItem(name)
}

/**
 * 获取全部localStorage
 */
export const getAllStore = (params: { type: any }) => {
  const list = []
  const { type } = params
  for (let i = 1; i <= window.sessionStorage.length; i++) {
    if (type) {
      list.push({
        name: window.sessionStorage.key(i),
        content: getStore({
          name: window.sessionStorage.key(i),
          type: 'session'
        })
      })
    } else {
      list.push(getStore({
        name: window.localStorage.key(i),
        content: getStore({
          name: window.localStorage.key(i)
        })
      }))
    }
  }

  return list
}

/**
 * 清空全部localStorage
 */
export const clearStore = (params: { type: any }) => {
  const { type } = params
  if (type) {
    window.sessionStorage.clear()
    return
  }
  window.localStorage.clear()
}
