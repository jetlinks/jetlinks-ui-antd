import { PageContainer } from '@ant-design/pro-layout';
import SearchComponent from '@/components/SearchComponent';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { PermissionButton, ProTableCard } from '@/components';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import { message, Space } from 'antd';
import { DuerOSItem } from '@/pages/Northbound/DuerOS/types';
import DuerOSCard from '@/components/ProTableCard/CardItems/duerOs';
import { history } from '@@/core/history';
import { getMenuPathByCode, getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import Service from './service';

export const service = new Service('dueros/product');
export default () => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const [searchParams, setSearchParams] = useState<any>({});
  const { permission } = PermissionButton.usePermission('Northbound/DuerOS');

  const Tools = (record: any, type: 'card' | 'table') => {
    return [
      <PermissionButton
        key={'update'}
        type={'link'}
        style={{ padding: 0 }}
        isPermission={permission.update}
        tooltip={
          type === 'table'
            ? {
                title: intl.formatMessage({
                  id: 'pages.data.option.edit',
                  defaultMessage: '编辑',
                }),
              }
            : undefined
        }
        onClick={() => {
          history.push(getMenuPathByParams(MENUS_CODE['Northbound/DuerOS/Detail'], record.id));
        }}
      >
        <EditOutlined />
        {type !== 'table' &&
          intl.formatMessage({
            id: 'pages.data.option.edit',
            defaultMessage: '编辑',
          })}
      </PermissionButton>,
      <PermissionButton
        key={'delete'}
        type={'link'}
        style={{ padding: 0 }}
        isPermission={permission.delete}
        popConfirm={{
          title: '确认删除？',
          onConfirm: async () => {
            await service.remove(record.id);
            message.success('删除成功!');
            actionRef.current?.reload();
          },
        }}
        tooltip={{
          title: '删除',
        }}
      >
        <DeleteOutlined />
      </PermissionButton>,
    ];
  };

  const columns: ProColumns<DuerOSItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'page.cloud.duerOS.productName',
        defaultMessage: '产品',
      }),
      dataIndex: 'productName',
    },
    {
      title: intl.formatMessage({
        id: 'pages.cloud.duerOS.applianceType',
        defaultMessage: '设备类型',
      }),
      dataIndex: 'applianceType',
      renderText: (data) => data.text,
    },
    {
      title: intl.formatMessage({
        id: 'pages.cloud.duerOS.manufacturerName',
        defaultMessage: '厂家名称',
      }),
      dataIndex: 'manufacturerName',
    },
    {
      title: intl.formatMessage({
        id: 'pages.cloud.duerOS.version',
        defaultMessage: '动作数量',
      }),
      dataIndex: 'version',
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (text, record) => Tools(record, 'table'),
    },
  ];

  return (
    <PageContainer>
      <SearchComponent<DuerOSItem>
        field={columns}
        target="northbound-dueros"
        onSearch={(data) => {
          actionRef.current?.reset?.();
          setSearchParams(data);
        }}
      />
      <div style={{ backgroundColor: 'white', width: '100%', height: 60, padding: 20 }}>
        <div
          style={{
            padding: 10,
            width: '100%',
            color: 'rgba(0, 0, 0, 0.55)',
            backgroundColor: '#f6f6f6',
          }}
        >
          <ExclamationCircleFilled style={{ marginRight: 10 }} />
          将平台产品通过API的方式同步DuerOS平台
        </div>
      </div>
      <ProTableCard<DuerOSItem>
        rowKey="id"
        search={false}
        columns={columns}
        actionRef={actionRef}
        params={searchParams}
        options={{ fullScreen: true }}
        request={(params) =>
          service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
        cardRender={(record) => <DuerOSCard {...record} action={Tools(record, 'card')} />}
        headerTitle={
          <Space>
            <PermissionButton
              isPermission={true}
              onClick={() => {
                history.push(getMenuPathByCode(MENUS_CODE['Northbound/DuerOS/Detail']));
              }}
              key="button"
              icon={<PlusOutlined />}
              type="primary"
            >
              {intl.formatMessage({
                id: 'pages.data.option.add',
                defaultMessage: '新增',
              })}
            </PermissionButton>
          </Space>
        }
      />
      {/*<Save/>*/}
    </PageContainer>
  );
};
