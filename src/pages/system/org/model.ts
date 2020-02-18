import { Effect } from '@/models/connect';
import { Reducer } from 'react';
import apis from '@/services';

export interface OrgModelState {
  result: any[];
}

export interface OrgModelType {
  namespace: string;
  state: OrgModelState;
  effects: {
    query: Effect;
    queryById: Effect;
    insert: Effect;
    remove: Effect;
  };
  reducers: {
    save: Reducer<any, any>;
  };
}

const OrgModel: OrgModelType = {
  namespace: 'org',
  state: {
    result: [],
  },
  effects: {
    *query({ payload }, { call, put }) {
      const response: any = yield call(apis.org.list, payload);
      yield put({
        type: 'save',
        payload: response.result,
      });
    },
    *queryById({ payload, callback }, { call }) {
      const response: any = yield call(apis.org.list, payload);
      callback(response);
    },
    *insert({ payload, callback }, { call }) {
      const response: any = yield call(apis.org.saveOrUpdate, payload);
      callback(response);
    },
    *remove({ payload, callback }, { call }) {
      const response: any = yield call(apis.org.remove, payload);
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

export default OrgModel;
