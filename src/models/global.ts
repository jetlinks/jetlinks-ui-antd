import { Reducer } from 'redux';
import { Subscription, Effect } from 'dva';

import { NoticeIconData } from '@/components/NoticeIcon';
import { queryNotices } from '@/services/user';
import { ConnectState } from './connect.d';
import { readNotice, readNotices } from '@/pages/account/notification/service';
import encodeQueryParam from '@/utils/encodeParam';

export interface NoticeItem extends NoticeIconData {
  id: string;
  type: string;
  state: any;
  message: string;
  dataId: string;
  notifyTime: number | string;
  subscribeId: string;
  subscriber: string;
  subscriberType: string;
  topicName: any;
  topicProvider: string;
}

export interface GlobalModelState {
  collapsed: boolean;
  notices: NoticeItem[];
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    fetchNotices: Effect;
    clearNotices: Effect;
    changeNoticeReadState: Effect;
  };
  reducers: {
    changeLayoutCollapsed: Reducer<GlobalModelState>;
    saveNotices: Reducer<GlobalModelState>;
    saveClearedNotices: Reducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
  },

  effects: {
    *fetchNotices({ payload }, { call, put, select }) {
      const resp = yield call(queryNotices, payload);
      const data = resp.result.data;
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount: number = yield select(
        (state: ConnectState) =>
          state.global.notices.filter(item => item.state.value === 'unread').length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: resp.result.total,
          unreadCount: resp.result.total,
          // totalCount: 44,
          // unreadCount: 88,

        },
      });
    },
    *clearNotices({ payload }, { call, put, select }) {
      const resp = yield call(readNotices, payload);
      if (resp) {
        const all = yield call(queryNotices, encodeQueryParam({
          terms: { state: 'unread' }
        }));
        yield put({
          type: 'saveClearedNotices',
          payload: {
            notices: all.result.data,
          },
        });
        const count: number = yield select((state: ConnectState) => state.global.notices.length);
        const unreadCount: number = yield select(
          (state: ConnectState) => state.global.notices.filter(item => !item.read).length,
        );

        yield put({
          type: 'user/changeNotifyCount',
          payload: {
            // totalCount: count,
            totalCount: 0 || all.result.total,
            unreadCount: 0 || all.result.total,
            // unreadCount,
          },
        });

        yield put({
          type: 'fetchNotices',
          payload: encodeQueryParam({
            terms: { state: 'unread' }
          })
        })
      }
    },
    *changeNoticeReadState({ payload }, { call, put, select }) {
      const reps = yield call(readNotice, payload);
      if (reps) {
        yield put({
          type: 'fetchNotices',
          payload: encodeQueryParam({
            terms: { state: 'unread' }
          }),
        })
      }
      // if (reps) {
      // const notices: NoticeItem[] = yield select((state: ConnectState) =>
      //   state.global.notices.map(item => {
      //     const notice = { ...item };
      //     if (notice.id === payload) {
      //       notice.read = true;
      //       notice.state = { text: '已读', value: 'read' };
      //     }
      //     return notice;
      //   }),
      // );
      // yield put({
      //   type: 'saveNotices',
      //   payload: notices,
      // });
      // yield put({
      //   type: 'user/changeNotifyCount',
      //   payload: {
      //     totalCount: notices.length,
      //     unreadCount: notices.filter(item => !item.read).length,
      //   },
      // });
      // }
    },
  },

  reducers: {
    changeLayoutCollapsed(state = { notices: [], collapsed: true }, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }): GlobalModelState {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state = { notices: [], collapsed: true }, { payload }): GlobalModelState {
      return {
        collapsed: false,
        ...state,
        // notices: state.notices.filter((item): boolean => item.type !== payload),
        notices: state.notices,
      };
    },
  },

  subscriptions: {
    setup({ history }): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }): void => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};

export default GlobalModel;
