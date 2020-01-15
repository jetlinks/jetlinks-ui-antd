import { Effect } from 'dva';
import { Reducer } from 'react';
import apis from '@/services';
// import { SimpleResponse } from '@/utils/common';

export interface GatewayModelState {
    result: any,
}

export interface GatewayModelType {
    namespace: string;
    state: GatewayModelState;
    effects: {
        query: Effect;
        remove: Effect;
        insert: Effect;
    };
    reducers: {
        save: Reducer<any, any>;
    }
}

const GatewayModel: GatewayModelType = {
    namespace: 'gateway',
    state: {
        result: {},
    },
    effects: {
        *query({ payload, callback }, { call, put }) {
            const response: any = yield call(apis.gateway.list, payload);
            yield put({
                type: 'save',
                payload: response.result,
            });
        },
        *remove({ payload, callback }, { call, put }) {
            const response: any = yield call(apis.gateway.remove, payload);
            callback(response);
        },
        *insert({ payload, callback }, { call, put }) {
            const response: any = yield call(apis.gateway.insert, payload);
            callback(response);
        }
    },
    reducers: {
        save(state, action) {
            return {
                ...state,
                result: { ...action.payload },
            }
        }
    }
};

export default GatewayModel;
