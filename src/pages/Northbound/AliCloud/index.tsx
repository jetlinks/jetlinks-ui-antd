import { PageContainer } from '@ant-design/pro-layout';
import SearchComponent from '@/components/SearchComponent';
import { useRef, useState } from 'react';
import { history } from 'umi';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { PermissionButton, ProTableCard } from '@/components';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import AliyunCard from '@/components/ProTableCard/CardItems/aliyun';
import Service from './service';

export const service = new Service('device/aliyun/bridge');

const AliCloud = () => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const [searchParams, setSearchParams] = useState<any>({});

  const { permission } = PermissionButton.usePermission('Northbound/AliCloud');

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
        onClick={() => {}}
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
        disabled={record.state.value === 'started'}
        popConfirm={{
          title: '确认删除？',
          disabled: record.state.value === 'started',
          onConfirm: () => {},
        }}
        tooltip={{
          title:
            record.state.value === 'started' ? <span>请先禁用,再删除</span> : <span>删除</span>,
        }}
      >
        <DeleteOutlined />
      </PermissionButton>,
    ];
  };

  const columns: ProColumns<AliCloudType>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '网桥产品',
      dataIndex: 'name1',
    },
    {
      title: '说明',
      dataIndex: 'description',
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
      <SearchComponent<AliCloudType>
        field={columns}
        target="device-instance"
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
          将平台产品与设备数据通过API的方式同步到阿里云物联网平台
        </div>
      </div>
      <ProTableCard<AliCloudType>
        rowKey="id"
        search={false}
        columns={columns}
        actionRef={actionRef}
        params={searchParams}
        options={{ fullScreen: true }}
        request={(params) =>
          service.query({
            ...params,
            sorts: [
              {
                name: 'createTime',
                order: 'desc',
              },
            ],
          })
        }
        pagination={{ pageSize: 10 }}
        headerTitle={[
          <PermissionButton
            onClick={() => {
              const url = `${getMenuPathByParams(MENUS_CODE['Northbound/AliCloud/Detail'])}`;
              console.log(url);
              history.push(url);
            }}
            style={{ marginRight: 12 }}
            isPermission={permission.add}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </PermissionButton>,
        ]}
        cardRender={(record) => (
          <AliyunCard
            {...record}
            actions={[
              <PermissionButton
                type={'link'}
                onClick={() => {}}
                key={'edit'}
                isPermission={permission.update}
              >
                <EditOutlined />
                {intl.formatMessage({
                  id: 'pages.data.option.edit',
                  defaultMessage: '编辑',
                })}
              </PermissionButton>,
              <PermissionButton
                key="delete"
                isPermission={permission.delete}
                type={'link'}
                style={{ padding: 0 }}
                // tooltip={
                //   record.state.value !== 'notActive'
                //     ? { title: intl.formatMessage({ id: 'pages.device.instance.deleteTip' }) }
                //     : undefined
                // }
                // disabled={record.state.value !== 'notActive'}
                // popConfirm={{
                //   title: intl.formatMessage({
                //     id: 'pages.data.option.remove.tips',
                //   }),
                //   disabled: record.state.value !== 'notActive',
                //   onConfirm: async () => {
                //     if (record.state.value === 'notActive') {
                //       await service.remove(record.id);
                //       message.success(
                //         intl.formatMessage({
                //           id: 'pages.data.option.success',
                //           defaultMessage: '操作成功!',
                //         }),
                //       );
                //       actionRef.current?.reload();
                //     } else {
                //       message.error(intl.formatMessage({ id: 'pages.device.instance.deleteTip' }));
                //     }
                //   },
                // }}
              >
                <DeleteOutlined />
              </PermissionButton>,
            ]}
          />
        )}
      />
    </PageContainer>
  );
};

export default AliCloud;
