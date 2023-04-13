import {isArray} from "lodash";

export const EventEmitter = {
  list: {},
  subscribe: function(events: string[] | string, fn: Function) {
    const list = this.list
    const _events = isArray(events) ? events : [events]
    _events.forEach(event => {
      (list[event] || (list[event] = [])).push(fn)
    })
    return this
  },
  set: function(events:string, data?: any) {
    const list = this.list
    const fns: Function[] = list[events] ? [...list[events]] : []
    console.log(events, fns)
    if (!fns.length) return false;

    fns.forEach(fn => {
      fn(data)
    })

    return this
  },
  unsubscribe: function(events: string[] |string, fn: Function) {
    const list = this.list
    const _events = isArray(events) ? events : [events]
    _events.forEach(key => {
      if (key in list) {
        const fns = list[key]
        for (let i = 0; i < fns.length; i++) {
          if (fns[i] === fn) {
            fns.splice(i, 1)
            break;
          }
        }
      }
    })
    return this
  }
}
