import { Reducer } from 'redux';
import { Effect } from 'dva';
import defaultSettings, { DefaultSettings } from '../../config/defaultSettings';

export interface SettingModelType {
  namespace: 'settings';
  state: DefaultSettings;
  effects: {
    settingData: Effect
  },
  reducers: {
    changeSetting: Reducer<DefaultSettings>;
  };
}

const updateColorWeak: (colorWeak: boolean) => void = colorWeak => {
  const root = document.getElementById('root');
  if (root) {
    root.className = colorWeak ? 'colorWeak' : '';
  }
};

const SettingModel: SettingModelType = {
  namespace: 'settings',
  state: defaultSettings,
  effects: {
    *settingData({ payload }, { put }) {
      console.log('触发');
      yield put({
        type: 'changeSetting',
        payload
      })
    }
  },
  reducers: {
    changeSetting(state, { payload }) {
      const { colorWeak, contentWidth } = payload;
      console.log(payload, state, 'steee');
      if (state && state.contentWidth !== contentWidth && window.dispatchEvent) {
        window.dispatchEvent(new Event('resize'));
      }
      updateColorWeak(!!colorWeak);
      return {
        ...state,
        ...payload,
      };
    },
  },
};
export default SettingModel;
