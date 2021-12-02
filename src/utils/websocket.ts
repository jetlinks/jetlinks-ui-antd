import { Token } from '@/utils/utils'
import { message, notification } from 'ant-design-vue'
let ws: WebSocket | undefined
let timer: any
let count = 0
let subs: any
const initWebSocket = () => {
  clearInterval(timer)
  const wsUrl = `ws:demo.jetlinks.cn/jetlinks/messaging/${Token.get()}?:X_Access_Token=${Token.get()}`
  if (!ws && count < 5) {
    try {
      count += 1
      ws = new WebSocket(wsUrl)
      ws.onopen = () => {
        timer = setInterval(() => {
          try {
            ws && ws.send(JSON.stringify({ type: 'ping' }))
          } catch (error) {
            console.error(error, '发送心跳错误')
          }
        }, 2000)
      }
      ws.onclose = (e) => { // 关闭
        ws = undefined
        setTimeout(initWebSocket, 5000 * count)
      }
      ws.onmessage = (e) => { // 接收数据
        const data = JSON.parse(e.data)
        if (data.type === 'error') {
          notification.error({ key: 'ws-err', message: data.message })
        }
        if (subs && subs[data.requestId]) {
          subs[data.requestId](data)
        }
      }
    } catch (error) {
      setTimeout(initWebSocket, 5000 * count)
    }
  }
  return ws
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const getWebsocket = (agentData: { id: string, topic: string, parameter: any, type: 'sub' | 'unsub' }, callback: any) => {
  if (!subs) {
    subs = {}
  }
  if (callback) {
    if (typeof callback === 'function') {
      subs[agentData.id] = callback
    } else {
      subs[agentData.id] = {}
    }
  }
  const thisWs = initWebSocket()
  const tempQueue: any[] = []
  if (thisWs) {
    try {
      if (thisWs.readyState === 1) {
        thisWs.send(JSON.stringify(agentData))
      } else {
        tempQueue.push(JSON.stringify(agentData))
      }
      if (tempQueue.length > 0) {
        if (thisWs.readyState === 1) {
          tempQueue.forEach((i: any, index: number) => {
            thisWs.send(i)
            tempQueue.splice(index, 1)
          })
        } else {
          setTimeout(() => {
            tempQueue.forEach((i: any, index: number) => {
              thisWs.send(i)
              tempQueue.splice(index, 1)
            })
          }, 2000)
        }
      }
    } catch (error) {
      initWebSocket()
      message.error({ key: 'ws', content: 'websocket服务连接失败' })
    }
  }
}

export { getWebsocket, initWebSocket }
