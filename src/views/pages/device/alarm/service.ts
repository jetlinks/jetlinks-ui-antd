import Axios from '@/utils/axios'
import { baseUrl } from '@/utils/base-service'
export function getAlarmList (id: string, type: string): Promise<any> {
  return Axios({
    url: `${baseUrl}/device/alarm/${type}/${id}`,
    method: 'GET'
  })
}

export function deleteAlarm (id: string): Promise<any> {
  return Axios({
    url: `${baseUrl}/device/alarm/${id}`,
    method: 'Delete'
  })
}

export function startAlarm (id: string): Promise<any> {
  return Axios({
    url: `${baseUrl}/device/alarm/${id}/_start`,
    method: 'POST'
  })
}

export function stopAlarm (id: string): Promise<any> {
  return Axios({
    url: `${baseUrl}/device/alarm/${id}/_stop`,
    method: 'POST'
  })
}

export function getAlarmLogList (data: any): Promise<any> {
  return Axios({
    url: `${baseUrl}/device/alarm/history/_query`,
    method: 'GET',
    params: data
  })
}

export function solveLog (id: string, data: string): Promise<any> {
  return Axios({
    url: `${baseUrl}/device/alarm/history/${id}/_solve`,
    method: 'PUT',
    data
  })
}
