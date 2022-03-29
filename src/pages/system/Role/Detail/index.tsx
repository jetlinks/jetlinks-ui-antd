import { observer } from '@formily/react';
import { PageContainer } from '@ant-design/pro-layout';
import { useState } from 'react';
import { history } from 'umi';
import UserManage from '@/pages/system/Role/Detail/UserManage';
import Permission from '@/pages/system/Role/Detail/Permission';
import { useIntl } from '@@/plugin-locale/localeExports';

const RoleEdit = observer(() => {
  const intl = useIntl();
  const [tab, setTab] = useState<string>('permission');

  const list = [
    {
      key: 'permission',
      tab: intl.formatMessage({
        id: 'pages.system.role.access.permission',
        defaultMessage: '权限分配',
      }),
      component: <Permission />,
    },
    {
      key: 'userManagement',
      tab: intl.formatMessage({
        id: 'pages.system.role.access.userManagement',
        defaultMessage: '用户管理',
      }),
      component: <UserManage />,
    },
  ];

  return (
    <PageContainer onBack={history.goBack} tabList={list} onTabChange={setTab}>
      {list.find((k) => k.key === tab)?.component}
    </PageContainer>
  );
});
export default RoleEdit;
