import moment from 'moment'
export const downloadObject = (record: any, fileName: string) => {
  // 创建隐藏的可下载链接
  const eleLink = document.createElement('a')
  eleLink.download = `${fileName}-${record.name || moment(new Date()).format('YYYY/MM/DD HH:mm:ss')}.json`
  eleLink.style.display = 'none'
  // 字符内容转变成blob地址
  const blob = new Blob([JSON.stringify(record)])
  eleLink.href = URL.createObjectURL(blob)
  // 触发点击
  document.body.appendChild(eleLink)
  eleLink.click()
  // 然后移除
  document.body.removeChild(eleLink)
}

export const getView = (view: any) => {
  let children = []
  if (view.children && view.children.length > 0) {
    children = view.children.map((i: any) => {
      return getView(i)
    })
    return {
      title: view.name,
      value: view.id,
      key: view.id,
      children: children
    }
  } else {
    return {
      title: view.name,
      value: view.id,
      key: view.id,
      children: []
    }
  }
}

export const Token = {
  set: (token: string) => localStorage.setItem('x-access-token', token),
  get: () => localStorage.getItem('x-access-token') || Date.now().toString()
}

export const headers = {
  'X-Access-Token': Token.get()
}
