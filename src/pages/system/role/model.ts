import { Effect } from '@/models/connect';
import { Reducer } from 'react';
import apis from '@/services';

export interface RoleModelState {
  result: any;
}

export interface RoleModelType {
  namespace: string;
  state: RoleModelState;
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

const RoleModel: RoleModelType = {
  namespace: 'role',
  state: {
    result: {},
  },
  effects: {
    *query({ payload }, { call, put }) {
      const response: any = yield call(apis.role.list, payload);
      yield put({
        type: 'save',
        payload: response.result,
      });
    },
    *queryById({ payload, callback }, { call }) {
      const response: any = yield call(apis.role.list, payload);
      callback(response);
    },
    *insert({ payload, callback }, { call }) {
      const response: any = yield call(apis.role.saveOrUpdate, payload);
      callback(response);
    },
    *remove({ payload, callback }, { call }) {
      const response: any = yield call(apis.role.remove, payload);
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

export default RoleModel;
