// 资产分配-产品分类
import ProTable from '@jetlinks/pro-table';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useRef } from 'react';
import { useParams } from 'umi';
import { observer } from '@formily/react';
import type { ProductCategoryItem } from '@/pages/system/Department/typings';
import { DisconnectOutlined, PlusOutlined } from '@ant-design/icons';
import Models from '@/pages/system/Department/Assets/productCategory/model';
import Service from '@/pages/system/Department/Assets/service';
import Bind from './bind';

export const service = new Service<ProductCategoryItem>('assets');

export default observer(() => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const param = useParams<{ id: string }>();

  const handleUnBind = () => {
    // service.unBind({})
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

  const columns: ProColumns<ProductCategoryItem>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 48,
    },
    {
      dataIndex: 'key',
      title: intl.formatMessage({
        id: 'pages.device.category.key',
        defaultMessage: '标识',
      }),
      search: {
        transform: (value) => ({ name$LIKE: value }),
      },
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.device.category.name',
        defaultMessage: '分类名称',
      }),
      search: false,
    },
    {
      dataIndex: 'description',
      title: intl.formatMessage({
        id: 'pages.system.description',
        defaultMessage: '说明',
      }),
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

  const closeModal = () => {
    Models.bind = false;
  };

  return (
    <>
      <Bind
        visible={Models.bind}
        onCancel={closeModal}
        reload={() => actionRef.current?.reload()}
      />
      <ProTable<ProductCategoryItem>
        actionRef={actionRef}
        columns={columns}
        // schema={schema}
        rowKey="id"
        params={{
          terms: [
            {
              column: 'id',
              termType: 'dim-assets',
              value: {
                assetType: 'deviceCategory',
                targets: [
                  {
                    type: 'org',
                    id: param.id,
                  },
                ],
              },
            },
          ],
        }}
        request={(params) => {
          console.log(params);
          return service.queryProductCategoryList(params);
        }}
        postData={(data) => {
          console.log(data);
          return data;
        }}
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
    </>
  );
});
