import { Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import { useModel, SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';
import { Store } from 'jetlinks-store';
import { useIntl } from '@@/plugin-locale/localeExports';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');

  const [subscribeTopic] = useSendWebsocketMessage();

  useEffect(() => {
    Store.set('sendMessage', subscribeTopic);
  }, []);
  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <Space className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder={intl.formatMessage({
          id: 'component.globalHeader.search',
          defaultMessage: '站内搜索',
        })}
        defaultValue="umi ui"
        options={[
          { label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>, value: 'umi ui' },
          {
            label: <a href="https://ant.design/">Ant Design</a>,
            value: 'Ant Design',
          },
          {
            label: <a href="https://protable.ant.design/">Pro Table</a>,
            value: 'Pro Table',
          },
          {
            label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
            value: 'Pro Layout',
          },
        ]}
        // onSearch={value => {
        //   console.log('input', value);
        // }}
      />
      <span
        className={styles.action}
        onClick={() => {
          window.open('https://pro.ant.design/docs/getting-started');
        }}
      >
        <QuestionCircleOutlined />
      </span>
      <Avatar menu={true} />
      <SelectLang className={styles.action} />
    </Space>
  );
};
export default GlobalHeaderRight;
