import { Effect } from "dva";
import { Reducer } from "react";
import { SimpleResponse } from "@/utils/common";
import apis from "@/services";

export interface DeviceProductModelState {
    result: any,
}

export interface DeviceProductModelType {
    namespace: string;
    state: DeviceProductModelState;
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

const DeviceProductModel: DeviceProductModelType = {
    namespace: 'deviceProduct',
    state: {
        result: {},
    },
    effects: {
        *query({ payload, callback }, { call, put }) {
            const response: SimpleResponse = yield call(apis.deviceProdcut.list, payload);
            if (response) {
                yield put({
                    type: 'save',
                    payload: response.result,
                });
            };
        },
        *queryById({ payload, callback }, { call }) {
            const response: SimpleResponse = yield call(apis.deviceProdcut.info, payload);
            callback(response);
        },
        *insert({ payload, callback }, { call }) {
            console.log('进入了insert方法');
            const response: SimpleResponse = yield call(apis.deviceProdcut.saveOrUpdate, payload);
            callback(response);
        },
        *remove({ payload, callback }, { call, put }) {
            const response: SimpleResponse = yield call(apis.deviceProdcut.remove, payload);
            callback(response);
        },
        *changeDeploy({ payload, callback }, { call, put }) {
            const response: SimpleResponse = yield call(apis.deviceProdcut.changeDeploy, payload);
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
}

export default DeviceProductModel;