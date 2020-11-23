import { Effect } from 'dva';
import { Reducer } from 'react';
import apis from '@/services';
import { SimpleResponse } from '@/utils/common';

export interface RuleInstanceModelState {
    result: any,
}

export interface RuleInstanceModelType {
    namespace: string;
    state: RuleInstanceModelState;
    effects: {
        query: Effect;
        queryById: Effect;
        insert: Effect;
        remove: Effect;
    };
    reducers: {
        save: Reducer<any, any>;
    }
}

const RuleInstanceModel: RuleInstanceModelType = {
    namespace: 'ruleInstance',
    state: {
        result: {},
    },
    effects: {
        *query({ payload, callback }, { call, put }) {
            const response: SimpleResponse = yield call(apis.ruleInstance.list, payload);
            yield put({
                type: 'save',
                payload: response.result,
            });
        },
        *queryById({ payload, callback }, { call }) {
            const response: SimpleResponse = yield call(apis.ruleInstance.list, payload);
            callback(response);
        },
        *insert({ payload, callback }, { call }) {
            const response: SimpleResponse = yield call(apis.ruleInstance.saveOrUpdate, payload);
            callback(response);
        },
        *remove({ payload, callback }, { call, put }) {
            const response: SimpleResponse = yield call(apis.ruleInstance.remove, payload);
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

export default RuleInstanceModel;
