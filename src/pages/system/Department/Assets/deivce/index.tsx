// 资产分配-产品分类
import ProTable from '@jetlinks/pro-table';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useRef } from 'react';
import { useParams } from 'umi';
import { observer } from '@formily/react';
import type { ProductItem } from '@/pages/system/Department/typings';
import { DisconnectOutlined, PlusOutlined } from '@ant-design/icons';
import Models from '@/pages/system/Department/Assets/productCategory/model';
import Service from '@/pages/system/Department/Assets/service';

export const service = new Service<ProductItem>();

export default observer(() => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const param = useParams<{ id: string }>();

  const handleUnBind = () => {
    // service.handleUser(param.id, Models.unBindUsers, 'unbind').subscribe({
    //   next: () => message.success('操作成功'),
    //   error: () => message.error('操作失败'),
    //   complete: () => {
    //     Models.unBindUsers = [];
    //     actionRef.current?.reload();
    //   },
    // });
  };

  const singleUnBind = (key: string) => {
    Models.unBindKeys = [key];
    handleUnBind();
  };

  const columns: ProColumns<ProductItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.system.name',
        defaultMessage: '姓名',
      }),
      search: {
        transform: (value) => ({ name$LIKE: value }),
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.tenant.memberManagement.administrators',
        defaultMessage: '管理员',
      }),
      dataIndex: 'adminMember',
      renderText: (text) => (text ? '是' : '否'),
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'state',
      renderText: (text) => text.text,
      search: false,
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (text, record) => [
        <Popconfirm
          title={intl.formatMessage({
            id: 'pages.system.role.option.unBindUser',
            defaultMessage: '是否解除绑定',
          })}
          key="unBind"
          onConfirm={() => {
            singleUnBind(record.id);
          }}
        >
          <a href="#">
            <Tooltip
              title={intl.formatMessage({
                id: 'pages.system.role.option.unBindUser',
                defaultMessage: '解除绑定',
              })}
            >
              <DisconnectOutlined />
            </Tooltip>
          </a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <ProTable<ProductItem>
      actionRef={actionRef}
      columns={columns}
      // schema={schema}
      rowKey="id"
      defaultParams={{
        id: {
          termType: 'dim-assets',
          value: {
            assetType: 'device',
            targets: [
              {
                type: 'org',
                id: param.id,
              },
            ],
          },
        },
      }}
      request={(params) => service.queryDeviceList(params)}
      rowSelection={{
        selectedRowKeys: Models.unBindKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          Models.unBindKeys = selectedRows.map((item) => item.id);
        },
      }}
      toolBarRender={() => [
        <Button
          onClick={() => {
            Models.bind = true;
          }}
          icon={<PlusOutlined />}
          type="primary"
          key="bind"
        >
          {intl.formatMessage({
            id: 'pages.system.role.option.bindUser',
            defaultMessage: '分配资产',
          })}
        </Button>,
        <Popconfirm
          title={intl.formatMessage({
            id: 'pages.system.role.option.unBindUser',
            defaultMessage: '是否批量解除绑定',
          })}
          key="unBind"
          onConfirm={handleUnBind}
        >
          <Button icon={<DisconnectOutlined />} key="bind">
            {intl.formatMessage({
              id: 'pages.system.role.option.unBindUser',
              defaultMessage: '批量解绑',
            })}
          </Button>
        </Popconfirm>,
      ]}
    />
  );
});
