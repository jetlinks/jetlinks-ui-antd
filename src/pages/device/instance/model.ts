import { Effect } from "dva";
import { Reducer } from "react";
import { SimpleResponse } from "@/utils/common";
import apis from "@/services";

export interface DeviceInstanceModelState {
    result: any,
}
export interface DeviceInstanceModelType {
    namespace: string;
    state: DeviceInstanceModelState;
    effects: {
        update: Effect;
        query: Effect;
        queryById: Effect;
        queryLog: Effect;
    };
    reducers: {
        save: Reducer<any, any>;
    }
}

const DeviceInstanceModel: DeviceInstanceModelType = {
    namespace: 'deviceInstance',
    state: {
        result: {},
    },
    effects: {
        *update({ payload, callback }, { call }) {
            const response: SimpleResponse = yield call(apis.deviceInstance.saveOrUpdate, payload);
            callback(response);
        },
        *query({ payload, callback }, { call, put }) {
            const response: SimpleResponse = yield call(apis.deviceInstance.list, payload);
            if (response.status === 200){
              yield put({
                type: 'save',
                payload: response.result,
              });
            }
        },
        *queryById({ payload, callback }, { call }) {
            const response: SimpleResponse = yield call(apis.deviceInstance.info, payload);
            callback(response);
        },
        *queryLog({ payload, callback }, { call }) {
            const response: SimpleResponse = yield call(apis.deviceInstance.logs, payload);
            callback(response);
        }
    },
    reducers: {
        save(state, action) {
            return {
                ...state,
                result: action.payload,
            };
        },
    },
};

export default DeviceInstanceModel;
