import { Effect } from "dva";
import { Reducer } from "react";
import apis from "@/services";

export interface DeviceGatewayState {
    result: any,
}

export interface DeviceGatewayType {
    namespace: string;
    state: DeviceGatewayState;
    effects: {
        query: Effect;
        remove: Effect;
        insert: Effect;
    };
    reducers: {
        save: Reducer<any, any>;
    }
}

const DeviceGateway: DeviceGatewayType = {
    namespace: 'deviceGateway',
    state: {
        result: [],
    },
    effects: {
        *query({ payload, callback }, { call, put }) {
            const response: any = yield call(apis.deviceGateway.list, payload);
            callback(response);
            yield put({
                type: 'save',
                payload: response.result.data,
            });
        },
        *remove({ payload, callback }, { call, put }) {
            const response: any = yield call(apis.deviceGateway.remove, payload);
            callback(response);
        },
        *insert({ payload, callback }, { call, put }) {
            const response: any = yield call(apis.deviceGateway.save, payload);
            callback(response);
        },
        *bind({ payload, callback }, { call, put }) {
          const response: any = yield call(apis.deviceGateway.bind, payload);
          callback(response);
        },
    },
    reducers: {
        save(state, action) {
            return {
                ...state,
                result: action.payload,
            }
        }
    }
};

export default DeviceGateway;
