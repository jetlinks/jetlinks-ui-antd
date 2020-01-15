import { Effect } from 'dva';
import { Reducer } from 'react';
import apis from '@/services';
// import { SimpleResponse } from '@/utils/common';

export interface CertificateModelState {
    result: any,
}

export interface CertificateModelType {
    namespace: string;
    state: CertificateModelState;
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

const CertificateModel: CertificateModelType = {
    namespace: 'certificate',
    state: {
        result: {},
    },
    effects: {
        *query({ payload, callback }, { call, put }) {
            const response: any = yield call(apis.certificate.list, payload);
            yield put({
                type: 'save',
                payload: response.result,
            });
        },
        *queryById({ payload, callback }, { call }) {
            const response: any = yield call(apis.certificate.list, payload);
            callback(response);
        },
        *insert({ payload, callback }, { call }) {
            const response: any = yield call(apis.certificate.saveOrUpdate, payload);
            callback(response);
        },
        *remove({ payload, callback }, { call, put }) {
            const response: any = yield call(apis.certificate.remove, payload);
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

export default CertificateModel;
