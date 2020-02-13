import { Effect } from 'dva';
import { Reducer } from 'react';
import apis from '@/services';

export interface NoticeTemplateState {
  result: any;
}
export interface NoticeTemplateType {
  namespace: string;
  state: NoticeTemplateState;
  effects: {
    query: Effect;
    remove: Effect;
    insert: Effect;
  };
  reducers: {
    save: Reducer<any, any>;
  };
}

const NoticeTemplate: NoticeTemplateType = {
  namespace: 'noticeTemplate',
  state: {
    result: {},
  },
  effects: {
    *query({ payload }, { call, put }) {
      const response: any = yield call(apis.notifier.template, payload);
      yield put({
        type: 'save',
        payload: response.result,
      });
    },
    *remove({ payload, callback }, { call }) {
      const response: any = yield call(apis.notifier.remove, payload);
      callback(response);
    },
    *insert({ payload, callback }, { call }) {
      const response: any = yield call(apis.notifier.saveOrUpdate, payload);
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

export default NoticeTemplate;
