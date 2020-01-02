import { Effect } from "@/models/connect";
import { Reducer } from "react";
import apis from "@/services";
import { SimpleResponse } from "@/utils/common";

export interface OpenApiModelState {
    result: any,
}

export interface OpenApiModelType {
    namespace: string;
    state: OpenApiModelState;
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

const OpenApiModel: OpenApiModelType = {
    namespace: 'openApi',
    state: {
        result: {},
    },
    effects: {
        *query({ payload, callback }, { call, put }) {
            const response: SimpleResponse = yield call(apis.openApi.list, payload);
            yield put({
                type: 'save',
                payload: response.result,
            });
        },
        *queryById({ payload, callback }, { call }) {
            const response: SimpleResponse = yield call(apis.openApi.list, payload);
            callback(response);
        },
        *insert({ payload, callback }, { call }) {
            const response: SimpleResponse = yield call(apis.openApi.update, payload);
            callback(response);
        },
        *remove({ payload, callback }, { call, put }) {
            const response: SimpleResponse = yield call(apis.openApi.remove, payload);
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

export default OpenApiModel;
