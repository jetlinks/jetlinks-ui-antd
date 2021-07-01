import request from "@/utils/request";

export const geteWayInfo = (deviceId: string) => request.post(`/jetlinks/edge/operations/${deviceId}/device-gateway-info/invoke`)

export const getEdgeState = (deviceId: string) => request.get(`/jetlinks/edge/operations/${deviceId}/state`)