import { Effect } from 'dva';
import { Reducer } from 'redux';

import { queryCurrent, query as queryUsers } from '@/services/user';
import { router } from 'umi';

export interface CurrentUser {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userid?: string;
  unreadCount?: number;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response) {
        // 取出login 后缓存的数据
        const loginStorage = localStorage.getItem('hsweb-autz');
        if (loginStorage) {
          const tempLogin = JSON.parse(loginStorage);
          tempLogin.permissions = response.result.permissions;
          localStorage.setItem('hsweb-autz', JSON.stringify(tempLogin));
        } else {
          localStorage.setItem('hsweb-autz', JSON.stringify(response.result));
        }
        yield put({
          type: 'saveCurrentUser',
          payload: response.result.user,
        });
      } else {
        router.push('/user/login');
      }
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        // currentUser: action.payload || {},
        currentUser: {
          ...state?.currentUser,
          ...action.payload
        }
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
