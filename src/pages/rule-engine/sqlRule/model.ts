import { Effect } from 'dva';
import { Reducer } from 'react';
import apis from '@/services';
import { SimpleResponse } from '@/utils/common';

export interface RuleModelModelState {
    result: any,
}

export interface RuleModelModelType {
    namespace: string;
    state: RuleModelModelState;
    effects: {
        query: Effect;
        queryById: Effect;
        saveOrUpdate: Effect;
        remove: Effect;
        insert: Effect;
    };
    reducers: {
        save: Reducer<any, any>;
    }
}

const RuleModelModel: RuleModelModelType = {
    namespace: 'ruleModel',
    state: {
        result: {},
    },
    effects: {
        *query({ payload, callback }, { call, put }) {
            const response: SimpleResponse = yield call(apis.ruleModel.list, payload);
            yield put({
                type: 'save',
                payload: response.result,
            });
        },
        *queryById({ payload, callback }, { call }) {
            const response: SimpleResponse = yield call(apis.ruleModel.list, payload);
            callback(response);
        },
        *saveOrUpdate({ payload, callback }, { call }) {
            const response: SimpleResponse = yield call(apis.ruleModel.saveOrUpdate, payload);
            callback(response);
        },
        *remove({ payload, callback }, { call, put }) {
            const response: SimpleResponse = yield call(apis.ruleModel.remove, payload);
            callback(response);
        },
        *insert({ payload, callback }, { call }) {
            const response: SimpleResponse = yield call(apis.ruleModel.add, payload);
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

export default RuleModelModel;
