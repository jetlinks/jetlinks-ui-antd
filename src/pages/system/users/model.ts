import { Effect } from 'dva';
import { Reducer } from 'react';
import apis from '@/services';
import { SimpleResponse } from '@/utils/common';

export interface UsersModelState {
  result: any;
}

export interface UsersModelType {
  namespace: string;
  state: UsersModelState;
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

const UsersModel: UsersModelType = {
  namespace: 'users',
  state: {
    result: {},
  },
  effects: {
    *query({ payload, callback }, { call, put }) {
      const response: SimpleResponse = yield call(apis.users.list, payload);
      yield put({
        type: 'save',
        payload: response.result,
      });
    },
    *queryById({ payload, callback }, { call }) {
      const response: SimpleResponse = yield call(apis.users.list, payload);
      callback(response);
    },
    *insert({ payload, callback }, { call }) {
      const response: SimpleResponse = yield call(apis.users.saveOrUpdate, payload);
      callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response: SimpleResponse = yield call(apis.users.remove, payload);
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

export default UsersModel;
