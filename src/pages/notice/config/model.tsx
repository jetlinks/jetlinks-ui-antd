import { Effect } from 'dva';
import { Reducer } from 'react';
import apis from '@/services';

export interface NoticeConfigState {
  result: any;
}
export interface NoticeConfigType {
  namespace: string;
  state: NoticeConfigState;
  effects: {
    query: Effect;
    remove: Effect;
    insert: Effect;
  };
  reducers: {
    save: Reducer<any, any>;
  };
}

const NoticeConfig: NoticeConfigType = {
  namespace: 'noticeConfig',
  state: {
    result: [],
  },
  effects: {
    *query({ payload }, { call, put }) {
      const response: any = yield call(apis.notifier.config, payload);
      yield put({
        type: 'save',
        payload: response.result,
      });
    },
    *remove({ payload, callback }, { call }) {
      const response: any = yield call(apis.notifier.removeConfig, payload);
      callback(response);
    },
    *insert({ payload, callback }, { call }) {
      const response: any = yield call(apis.notifier.saveOrUpdateConfig, payload);
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

export default NoticeConfig;
