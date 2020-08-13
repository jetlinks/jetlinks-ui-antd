import { Icon, Tooltip, Tag, message } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'dva';
// import { formatMessage } from 'umi-plugin-react/locale';
import { ConnectProps, ConnectState } from '@/models/connect';

import Avatar from './AvatarDropdown';
// import HeaderSearch from '../HeaderSearch';
// import SelectLang from '../SelectLang';
import styles from './index.less';
import NoticeIconView from './NoticeIconView';
import encodeQueryParam from '@/utils/encodeParam';

export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends ConnectProps {
  theme?: SiderTheme;
  layout: 'sidemenu' | 'topmenu';
}

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = props => {
  const { theme, layout, dispatch } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }
  const fetchData = () => {
    if (dispatch) {
      dispatch({
        type: 'global/fetchNotices',
        payload: encodeQueryParam({
          terms: { state: 'unread' }
        })
      });
    }
  }
  return (
    <div className={className}>
      {/* <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder={formatMessage({
          id: 'component.globalHeader.search',
        })}
        defaultValue="umi ui"
        dataSource={[
          formatMessage({
            id: 'component.globalHeader.search.example1',
          }),
          formatMessage({
            id: 'component.globalHeader.search.example2',
          }),
          formatMessage({
            id: 'component.globalHeader.search.example3',
          }),
        ]}
        onSearch={() => { }}
        onPressEnter={() => { }}
      /> */}
      <Tooltip title="使用文档">
        <a
          target="_blank"
          href="http://doc.jetlinks.cn/"
          rel="noopener noreferrer"
          className={styles.action}
        >
          <Icon type="question-circle-o" />
        </a>
      </Tooltip>
      <span onClick={() => { fetchData() }}>
        <NoticeIconView />
      </span>
      <Avatar />
      {REACT_APP_ENV && <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>}
      {/* <SelectLang className={styles.action} /> */}
    </div>
  );
};

export default connect(({ settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
