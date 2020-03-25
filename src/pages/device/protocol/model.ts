import { Effect } from 'dva';
import { Reducer } from 'react';
import apis from '@/services';
import { SimpleResponse } from '@/utils/common';

export interface ProtocolModelState {
    result: any,
}

export interface ProtocolModelType {
    namespace: string;
    state: ProtocolModelState;
    effects: {
        query: Effect;
        queryById: Effect;
        insert: Effect;
        remove: Effect;
        changeDeploy: Effect;
    };
    reducers: {
        save: Reducer<any, any>;
    }
}

const ProtocolModel: ProtocolModelType = {
    namespace: 'protocol',
    state: {
        result: {},
    },
    effects: {
        *query({ payload, callback }, { call, put }) {
            const response: SimpleResponse = yield call(apis.protocol.list, payload);
            yield put({
                type: 'save',
                payload: response.result,
            });
        },
        *queryById({ payload, callback }, { call }) {
            const response: SimpleResponse = yield call(apis.protocol.list, payload);
            callback(response);
        },
        *insert({ payload, callback }, { call }) {
            const response: SimpleResponse = yield call(apis.protocol.saveOrUpdate, payload);
            callback(response);
        },
        *remove({ payload, callback }, { call }) {
            const response: SimpleResponse = yield call(apis.protocol.remove, payload);
            callback(response);
        },
        *changeDeploy({ payload, callback }, { call }) {
            const response: SimpleResponse = yield call(apis.protocol.changeDeploy, payload);
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

export default ProtocolModel;
