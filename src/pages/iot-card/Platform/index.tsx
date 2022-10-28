import { PermissionButton } from '@/components';
import SearchComponent from '@/components/SearchComponent';
import useDomFullHeight from '@/hooks/document/useDomFullHeight';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { onlyMessage } from '@/utils/util';
import {
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@jetlinks/pro-table';
import { Badge } from 'antd';
import { useRef, useState } from 'react';
import Service from './service';
import { useHistory } from '@/hooks';

export const service = new Service('network/card/platform');

const Platform = () => {
  const { minHeight } = useDomFullHeight(`.record`, 24);
  const actionRef = useRef<ActionType>();
  const [param, setParam] = useState({});
  const history = useHistory();
  const { permission } = PermissionButton.usePermission('iot-card/Platform');

  const statusUpdate = async (data: any) => {
    const res = await service.update(data);
    if (res.status === 200) {
      onlyMessage('操作成功');
      actionRef.current?.reload();
    }
  };

  const columns: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '平台类型',
      dataIndex: 'operatorName',
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        onelink: {
          text: '移动OneLink',
          status: 'onelink',
        },
        ctwing: {
          text: '电信Ctwing',
          status: 'ctwing',
        },
        unicom: {
          text: '联通Unicom',
          status: 'unicom',
        },
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        enabled: {
          text: '启用',
          status: 'enabled',
        },
        disabled: {
          text: '禁用',
          status: 'disabled',
        },
      },
      render: (_, record: any) => (
        <Badge
          status={record.state?.value === 'disabled' ? 'error' : 'success'}
          text={record.state?.text}
        />
      ),
    },
    {
      title: '说明',
      dataIndex: 'explain',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      render: (text, record) => [
        <PermissionButton
          isPermission={permission.update}
          key="edit"
          onClick={() => {
            const url = `${getMenuPathByParams(MENUS_CODE['iot-card/Platform/Detail'], record.id)}`;
            history.push(url);
          }}
          type={'link'}
          style={{ padding: 0 }}
          tooltip={{
            title: '编辑',
          }}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          isPermission={permission.action}
          key="action"
          type={'link'}
          style={{ padding: 0 }}
          tooltip={{
            title: record.state.value === 'enabled' ? '禁用' : '启用',
          }}
          popConfirm={{
            title: `确认${record.state.value === 'enabled' ? '禁用' : '启用'}`,
            onConfirm: () => {
              if (record.state.value === 'enabled') {
                statusUpdate({
                  id: record.id,
                  config: { ...record.config },
                  state: 'disabled',
                  operatorName: record.operatorName,
                });
              } else {
                statusUpdate({
                  id: record.id,
                  config: { ...record.config },
                  state: 'enabled',
                  operatorName: record.operatorName,
                });
              }
            },
          }}
        >
          {record.state === 'enabled' ? <StopOutlined /> : <PlayCircleOutlined />}
        </PermissionButton>,
        <PermissionButton
          isPermission={permission.delete}
          tooltip={{
            title: record.state.value !== 'enabled' ? '删除' : '请先禁用再删除',
          }}
          style={{ padding: 0 }}
          disabled={record.state.value === 'enabled'}
          popConfirm={{
            title: '确认删除',
            disabled: record.state.value === 'enabled',
            onConfirm: async () => {
              const res: any = await service.remove(record.id);
              if (res.status === 200) {
                onlyMessage('操作成功');
                actionRef.current?.reload();
              }
            },
          }}
          key="delete"
          type="link"
        >
          <DeleteOutlined />
        </PermissionButton>,
      ],
    },
  ];

  return (
    <PageContainer>
      <SearchComponent
        field={columns}
        target="record"
        onSearch={(data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTable
        actionRef={actionRef}
        params={param}
        columns={columns}
        search={false}
        rowKey="id"
        tableClassName={'record'}
        columnEmptyText={''}
        tableStyle={{ minHeight }}
        headerTitle={
          <>
            <PermissionButton
              onClick={() => {
                const url = `${getMenuPathByParams(MENUS_CODE['iot-card/Platform/Detail'])}`;
                history.push(url);
              }}
              style={{ marginRight: 12 }}
              isPermission={permission.update}
              key="button"
              icon={<PlusOutlined />}
              type="primary"
            >
              新增
            </PermissionButton>
          </>
        }
        request={async (params) =>
          service.getList({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
      />
    </PageContainer>
  );
};
export default Platform;
