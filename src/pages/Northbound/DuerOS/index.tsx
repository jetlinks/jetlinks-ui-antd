import { PageContainer } from '@ant-design/pro-layout';
import SearchComponent from '@/components/SearchComponent';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { PermissionButton, ProTableCard } from '@/components';
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import { Badge, Space } from 'antd';
import { DuerOSItem } from '@/pages/Northbound/DuerOS/types';
import DuerOSCard from '@/components/ProTableCard/CardItems/duerOs';
// import { history } from '@@/core/history';
import useHistory from '@/hooks/route/useHistory';
import { getMenuPathByCode, getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import Service from './service';
import { onlyMessage } from '@/utils/util';

export const service = new Service('dueros/product');
export default () => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const [searchParams, setSearchParams] = useState<any>({});
  const { permission } = PermissionButton.usePermission('Northbound/DuerOS');
  const history = useHistory();

  const Tools = (record: any, type: 'card' | 'table') => {
    const item = [
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
        style={{ padding: 0 }}
        isPermission={permission.action}
        type="link"
        key="changeState"
        popConfirm={{
          title: intl.formatMessage({
            id: `pages.data.option.${
              record.state?.value === 'enabled' ? 'disabled' : 'enabled'
            }.tips`,
            defaultMessage: `确认${record.state?.value === 'enabled' ? '禁用' : '启用'}?`,
          }),
          onConfirm: async () => {
            const map = {
              disabled: 'enable',
              enabled: 'disable',
            };
            const resp = await service.changeState(record.id, map[record.state?.value]);
            if (resp.status === 200) {
              onlyMessage(
                intl.formatMessage({
                  id: 'pages.data.option.success',
                  defaultMessage: '操作成功!',
                }),
              );
            } else {
              onlyMessage('操作失败！', 'error');
            }

            actionRef.current?.reload();
          },
        }}
        tooltip={{
          title: intl.formatMessage({
            id: `pages.data.option.${record.state?.value === 'enabled' ? 'disabled' : 'enabled'}`,
            defaultMessage: record.state?.value === 'enabled' ? '禁用' : '启用',
          }),
        }}
      >
        {record.state?.value === 'enabled' ? (
          <>
            {' '}
            <CloseCircleOutlined /> {type === 'card' && '禁用'}
          </>
        ) : (
          <>
            <PlayCircleOutlined /> {type === 'card' && '启用'}
          </>
        )}
      </PermissionButton>,
      <PermissionButton
        key={'delete'}
        type={'link'}
        style={{ padding: 0 }}
        isPermission={permission.delete}
        disabled={record.state?.value === 'enabled'}
        tooltip={{
          title: record.state?.value === 'disabled' ? '删除' : '请先禁用该数据，再删除。',
        }}
        popConfirm={{
          title: '确认删除？',
          onConfirm: async () => {
            await service.remove(record.id);
            onlyMessage('删除成功!');
            actionRef.current?.reload();
          },
        }}
      >
        <DeleteOutlined />
      </PermissionButton>,
    ];
    if (type === 'card') {
      return item;
    } else {
      return [
        <PermissionButton
          key={'update'}
          type={'link'}
          style={{ padding: 0 }}
          isPermission={permission.view}
          tooltip={{
            title: '查看',
          }}
          onClick={() => {
            history.push(getMenuPathByParams(MENUS_CODE['Northbound/DuerOS/Detail'], record.id), {
              view: true,
            });
          }}
        >
          <EyeOutlined />
        </PermissionButton>,
        ...item,
      ];
    }
  };

  const columns: ProColumns<DuerOSItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'name',
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'page.cloud.duerOS.productName',
        defaultMessage: '产品名称',
      }),
      dataIndex: 'productName',
      // hideInSearch: true,
      ellipsis: true,
      valueType: 'select',
      request: async () => {
        const res = await service.getProduct();
        if (res.status === 200) {
          return res.result.map((pItem: any) => ({ label: pItem.name, value: pItem.name }));
        }
        return [];
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.cloud.duerOS.applianceType',
        defaultMessage: '设备类型',
      }),
      dataIndex: 'applianceType',
      renderText: (data) => data.text,
      valueType: 'select',
      request: async () => {
        const res = await service.getTypes();
        if (res.status === 200) {
          return res.result.map((pItem: any) => ({ label: pItem.name, value: pItem.id }));
        }
        return [];
      },
    },
    {
      title: '说明',
      dataIndex: 'description',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 90,
      renderText: (data) => {
        const map = {
          disabled: <Badge status="error" text="禁用" />,
          enabled: <Badge status="success" text="正常" />,
        };
        return map[data.value];
      },
      valueType: 'select',
      valueEnum: {
        disabled: {
          text: '禁用',
          status: 'disabled',
        },
        enabled: {
          text: '正常',
          status: 'enabled',
        },
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 200,
      fixed: 'right',
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
      {/* <div style={{ backgroundColor: 'white', width: '100%', height: 60, padding: 20 }}>
        <div
          style={{
            padding: 10,
            width: '100%',
            color: 'rgba(0, 0, 0, 0.55)',
            backgroundColor: '#f6f6f6',
          }}
        >
          <InfoCircleOutlined style={{ marginRight: 10 }} />
          将平台产品通过API的方式同步DuerOS平台
        </div>
      </div> */}
      <ProTableCard<DuerOSItem>
        rowKey="id"
        search={false}
        columns={columns}
        actionRef={actionRef}
        params={searchParams}
        columnEmptyText={''}
        scroll={{ x: 1366 }}
        options={{ fullScreen: true }}
        request={(params) =>
          service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
        cardRender={(record) => (
          <DuerOSCard
            {...record}
            detail={
              <PermissionButton
                key={'view'}
                type={'link'}
                style={{ padding: 0, fontSize: 24, color: '#fff' }}
                isPermission={permission.view}
                onClick={() => {
                  const url = `${getMenuPathByParams(
                    MENUS_CODE['Northbound/DuerOS/Detail'],
                    record.id,
                  )}`;
                  history.push(url, { view: true });
                }}
              >
                <EyeOutlined />
              </PermissionButton>
              // <div
              //   style={{ padding: 8, fontSize: 24 }}
              //   onClick={() => {
              //     history.push(
              //       getMenuPathByParams(MENUS_CODE['Northbound/DuerOS/Detail'], record.id),
              //       { view: true },
              //     );
              //   }}
              // >
              //   <EyeOutlined />
              // </div>
            }
            action={Tools(record, 'card')}
          />
        )}
        headerTitle={
          <Space>
            <PermissionButton
              isPermission={permission.add}
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
