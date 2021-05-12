import { Effect } from "@/models/connect";
import { Reducer } from "react";
import apis from "@/services";
import { SimpleResponse } from "@/utils/common";


export interface PermissionModelState {
    result: any,
}
export interface PermissionModelType {
    namespace: string;
    state: PermissionModelState;
    effects: {
        query: Effect;
        queryById: Effect;
        insert: Effect;
        remove: Effect;
        update: Effect;
    };
    reducers: {
        save: Reducer<any, any>;
    }
}

const PermissionModel: PermissionModelType = {
    namespace: 'permission',
    state: {
        result: {},
    },
    effects: {
        *query({ payload, callback }, { call, put }) {
            const response: SimpleResponse = yield call(apis.permission.list, payload);
            yield put({
                type: 'save',
                payload: response.result,
            });
        },
        *queryById({ payload, callback }, { call }) {
            const response: SimpleResponse = yield call(apis.permission.list, payload);
            callback(response);
        },
        *insert({ payload, callback }, { call }) {
            const response: SimpleResponse = yield call(apis.permission.add, payload);
            callback(response);
        },
        *update({ payload, callback }, { call }) {
            const response: SimpleResponse = yield call(apis.permission.save, payload);
            callback(response);
        },
        *remove({ payload, callback }, { call, put }) {
            const response: SimpleResponse = yield call(apis.permission.remove, payload);
            callback(response);
        }
    },
    reducers: {
        save(state, action) {
            return {
                ...state,
                result: action.payload,
            }
        },
    },
}

export default PermissionModel;
