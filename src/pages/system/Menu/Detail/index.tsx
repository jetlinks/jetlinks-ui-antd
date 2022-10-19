// 菜单管理-详情
import { PageContainer } from '@ant-design/pro-layout';
import { useIntl } from '@@/plugin-locale/localeExports';
import { useEffect, useState } from 'react';
import BaseDetail from './edit';
import Buttons from './buttons';
import { useLocation, useParams, useRequest } from 'umi';
import { service } from '@/pages/system/Menu';

type LocationType = {
  id?: string;
};

export default () => {
  const intl = useIntl();
  const [tabKey, setTabKey] = useState('detail');
  const [pId, setPid] = useState<string | null>(null);
  const location = useLocation<LocationType>();
  const params: any = new URLSearchParams(location.search);
  const param = useParams<{ id?: string }>();

  const { data, run: queryData } = useRequest(service.queryDetail, {
    manual: true,
    formatResult: (response) => {
      return response.result;
    },
  });

  /**
   * 获取当前菜单详情
   */
  const queryDetail = (editId?: string) => {
    const id = editId || param.id;
    const _pId = params.get('pId');
    if (id && id !== ':id') {
      queryData(id);
    }
    if (_pId) {
      setPid(_pId);
    }
  };

  useEffect(() => {
    queryDetail();
    /* eslint-disable */
  }, [location]);

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
        data?.appId
          ? {}
          : {
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
      {tabKey === 'detail' && (param.id !== ':id' ? data : true) ? (
        <BaseDetail
          data={{
            ...data,
            parentId: pId,
          }}
          basePath={params.get('basePath')}
          onLoad={queryDetail}
        />
      ) : (
        <Buttons data={data} onLoad={queryDetail} />
      )}
    </PageContainer>
  );
};
