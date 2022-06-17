import { Button, Card, message, Space } from 'antd';
import type { ActionType } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useRef } from 'react';
import { Store } from 'jetlinks-store';
import SystemConst from '@/utils/const';
import { observer } from '@formily/react';
import { BindModel } from '@/components/BindUser/model';
import { columns, service } from '@/components/BindUser/index';
import { useIntl } from '@@/plugin-locale/localeExports';
import { onlyMessage } from '@/utils/util';

const Bound = observer(() => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    const listener = Store.subscribe(SystemConst.BIND_USER_STATE, () =>
      actionRef.current?.reload(),
    );
    return () => listener.unsubscribe();
  });

  const handleUnBindResult = {
    next: async () => {
      onlyMessage(
        intl.formatMessage({
          id: 'pages.bindUser.theBoundUser.success',
          defaultMessage: '解绑成功',
        }),
      );
    },
    error: async () => {
      message.error(
        intl.formatMessage({
          id: 'pages.bindUser.theBoundUser.fail',
          defaultMessage: '操作失败',
        }),
      );
    },
    complete: () => {
      // 通知右侧组建刷新
      Store.set(SystemConst.BIND_USER_STATE, 'true');
      actionRef.current?.reload();
      BindModel.unBindUsers = [];
    },
  };
  const {
    dimension: { id, type },
  } = BindModel;
  const handleRoleUnBind = () => {
    service.unBindRole(BindModel.unBindUsers, type!, id!).subscribe(handleUnBindResult);
  };

  const handleOrgUnBind = () => {
    service.unBindOrg(BindModel.unBindUsers, id!).subscribe(handleUnBindResult);
  };

  const handleUnbind = async () => {
    const bindType = BindModel.dimension.type;
    switch (bindType) {
      case 'role':
        handleRoleUnBind();
        break;
      case 'org':
        handleOrgUnBind();
        break;
      default:
        message.error(
          intl.formatMessage({
            id: 'pages.bindUser.theBoundUser.typeError',
            defaultMessage: '解绑类型数据错误',
          }),
        );
    }
  };

  return (
    <Card
      title={intl.formatMessage({
        id: 'pages.bindUser.theBoundUser',
        defaultMessage: '已绑定用户',
      })}
    >
      <ProTable
        size="small"
        rowKey="id"
        rowSelection={{
          selectedRowKeys: BindModel.unBindUsers,
          onChange: (selectedRowKeys) => {
            BindModel.unBindUsers = selectedRowKeys as string[];
          },
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={24}>
            <span>
              {intl.formatMessage({
                id: 'pages.bindUser.bindTheNewUser.selected',
                defaultMessage: '已选',
              })}{' '}
              {selectedRowKeys.length}{' '}
              {intl.formatMessage({
                id: 'pages.bindUser.bindTheNewUser.item',
                defaultMessage: '项',
              })}
              <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                {intl.formatMessage({
                  id: 'pages.bindUser.bindTheNewUser.deselect',
                  defaultMessage: '取消选择',
                })}
              </a>
            </span>
          </Space>
        )}
        tableAlertOptionRender={() => (
          <Space size={16}>
            <a onClick={handleUnbind}>
              {intl.formatMessage({
                id: 'pages.bindUser.bindTheNewUser.untieInBulk',
                defaultMessage: '批量解绑',
              })}
            </a>
          </Space>
        )}
        actionRef={actionRef}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        request={async (params) => service.query(params)}
        defaultParams={{
          [`id$in-dimension$${BindModel.dimension.type}`]: BindModel.dimension.id,
        }}
        toolBarRender={() => [
          <Button
            onClick={() => {
              BindModel.bind = true;
            }}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.system.role.option.bindUser',
              defaultMessage: '绑定用户',
            })}
          </Button>,
        ]}
      />
    </Card>
  );
});

export default Bound;
