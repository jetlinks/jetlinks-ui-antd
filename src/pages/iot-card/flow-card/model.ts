import { Effect } from "dva";
import { Reducer } from "react";
import { SimpleResponse } from "@/utils/common";
import apis from "@/services";

export interface FlowCardModelState {
    result: any,
}
export interface FlowCardModelType {
    namespace: string;
    state: FlowCardModelState;
    effects: {
        update: Effect;
        query: Effect;
        queryByProduct: Effect;
        queryById: Effect;
    };
    reducers: {
        save: Reducer<any, any>;
    }
}

const FlowCardModel: FlowCardModelType = {
    namespace: 'flowCard',
    state: {
        result: {},
    },
    effects: {
        *update({ payload, callback }, { call }) {
            const response: SimpleResponse = yield call(apis.flowCard.saveOrUpdate, payload);
            callback(response);
        },
        *query({ payload }, { call, put }) {
            const response: SimpleResponse = yield call(apis.flowCard.list, payload);
            if (response.status === 200){
              yield put({
                type: 'save',
                payload: response.result,
              });
            }
        },
        *queryByProduct({ payload }, { call, put }) {
            const { productId, params } = payload
            const response: SimpleResponse = yield call(apis.flowCard.productCard, productId, params);
            if (response.status === 200){
              yield put({
                type: 'save',
                payload: response.result,
              });
            }
        },
        *queryById({ payload, callback }, { call }) {
            const response: SimpleResponse = yield call(apis.flowCard.info, payload);
            callback(response);
        },
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

export default FlowCardModel;
