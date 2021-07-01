import { Reducer } from 'redux';
import { Effect } from 'dva';
import { info } from '@/pages/edge-gateway/device/service';
import { getEdgeState } from '@/services/edge'

export interface EdgeModelState {
    status?: 200 | 400 | undefined;
    type?: string;
    id?: string
    online?: string
}

export interface EdgeModelType {
    namespace: string;
    state: EdgeModelState;
    effects: {
        getInfo: Effect;
        getID: Effect;
        getState: Effect;
    }
    reducers: {
        changeEdgeInfo: Reducer<EdgeModelState>
        updateId: Reducer<EdgeModelState>
        updateEdgeState: Reducer<EdgeModelState>
    }
}

const Model: EdgeModelType = {
    namespace: 'edge',
    state: {
        id: '',
        online: 'offline'
    },
    effects: {
        *getID(_, { call, put }) {
            const result = yield call(info)
            yield put({
                type: 'updateId',
                id: result.result.edgeDeviceId
            })
            if (result) {
            }
        },
        *getState({ payload }, { call, put }) {

            if (payload) {
                const result = yield call(getEdgeState, payload)
                console.log(result)
                if (result) {

                }
            }
        },
        async getInfo(_, { call, put }) {
            const result = await info('localDevice')
            if (result && result.result) {
                put({
                    type: 'changeEdgeInfo',
                    payload: result.result
                })
            }
        }
    },
    reducers: {
        changeEdgeInfo(state, { payload }) {
            return {
                ...state,
                status: payload.status,
                type: payload.type,
                online: payload.online
            }
        },
        updateId(state, { id }) {
            return {
                ...state,
                id
            }
        },
        updateEdgeState(state, { payload }) {
            return {
                ...state,
                online: payload
            }
        }
    }
}

export default Model;