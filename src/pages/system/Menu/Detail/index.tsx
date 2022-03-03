// 菜单管理-详情
import { PageContainer } from '@ant-design/pro-layout';
import { useIntl } from '@@/plugin-locale/localeExports';
import { useEffect, useState } from 'react';
import BaseDetail from './edit';
import Buttons from './buttons';
import { useLocation } from 'umi';
import { service } from '@/pages/system/Menu';
import { useRequest } from 'umi';

type LocationType = {
  id?: string;
};

export default () => {
  const intl = useIntl();
  const [tabKey, setTabKey] = useState('detail');
  const location = useLocation<LocationType>();

  const { data, run: queryData } = useRequest(service.queryDetail, {
    manual: true,
    formatResult: (response) => {
      return response.result;
    },
  });

  /**
   * 获取当前菜单详情
   */
  const queryDetail = () => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      queryData(id);
    }
  };

  useEffect(() => {
    queryDetail();
    /* eslint-disable */
  }, []);

  return (
    <PageContainer
      tabList={[
        {
          tab: intl.formatMessage({
            id: 'pages.system.menu.detail',
            defaultMessage: '基本详情',
          }),
          key: 'detail',
        },
        {
          tab: intl.formatMessage({
            id: 'pages.system.menu.buttons',
            defaultMessage: '按钮管理',
          }),
          key: 'buttons',
        },
      ]}
      onTabChange={(key) => {
        setTabKey(key);
      }}
    >
      {tabKey === 'detail' ? (
        <div style={{ background: '#fff', padding: '16px 24px' }}>
          <div style={{ width: 660 }}>
            {' '}
            <BaseDetail data={data} onLoad={queryDetail} />{' '}
          </div>
        </div>
      ) : (
        <Buttons data={data} onLoad={queryDetail} />
      )}
    </PageContainer>
  );
};
