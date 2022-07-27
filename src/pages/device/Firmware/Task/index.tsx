import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { message, Popconfirm, Tooltip } from 'antd';
import { useRef, useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import {
  ControlOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useHistory, useLocation } from 'umi';
import { model } from '@formily/reactive';
import { observer } from '@formily/react';
import type { FirmwareItem } from '@/pages/device/Firmware/typings';
import Save from './Save';
import { onlyMessage } from '@/utils/util';
import { PermissionButton } from '@/components';
import useDomFullHeight from '@/hooks/document/useDomFullHeight';
import usePermissions from '@/hooks/permission';
import SearchComponent from '@/components/SearchComponent';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { service } from '@/pages/device/Firmware';

const UpgradeBtn = (props: { data: any; actions: any }) => {
  const { data, actions } = props;
  return (
    <a>
      <Tooltip title={data.waiting ? '停止' : '继续升级'}>
        {data.waiting ? (
          <StopOutlined
            onClick={async () => {
              const resp = await service.stopTask(data.id);
              if (resp.status === 200) {
                message.success('操作成功！');
                actions?.reload();
              }
            }}
          />
        ) : (
          <ControlOutlined
            onClick={async () => {
              const resp = await service.startTask(data.id, ['canceled']);
              if (resp.status === 200) {
                message.success('操作成功！');
                actions?.reload();
              }
            }}
          />
        )}
      </Tooltip>
    </a>
  );
};

export const state = model<{
  current?: FirmwareItem;
  visible: boolean;
}>({
  visible: false,
});
const Task = observer(() => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const { minHeight } = useDomFullHeight(`.firmware-task`, 24);
  const { permission } = usePermissions('device/Firmware');
  const [param, setParam] = useState({});
  const history = useHistory<Record<string, string>>();
  const location = useLocation<{ id: string }>();
  const id = (location as any).query?.id || '';
  const productId = (location as any).query?.productId || '';

  const columns: ProColumns<any>[] = [
    {
      title: '任务名称',
      ellipsis: true,
      dataIndex: 'name',
    },
    {
      title: '推送方式',
      ellipsis: true,
      dataIndex: 'mode',
      render: (text: any, record: any) => record?.mode?.text || '',
      valueType: 'select',
      valueEnum: {
        pull: {
          text: '设备拉取',
          status: 'pull',
        },
        push: {
          text: '平台推送',
          status: 'push',
        },
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.description',
        defaultMessage: '说明',
      }),
      ellipsis: true,
      align: 'center',
      dataIndex: 'description',
    },
    {
      title: '完成比例',
      ellipsis: true,
      // hideInSearch: true,
      dataIndex: 'progress',
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
      render: (text, record) => [
        <a
          onClick={() => {
            const url = getMenuPathByParams(MENUS_CODE['device/Firmware/Task/Detail'], record?.id);
            history.push(url);
          }}
          key="link"
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.detail',
              defaultMessage: '查看',
            })}
            key={'detail'}
          >
            <EyeOutlined />
          </Tooltip>
        </a>,
        <UpgradeBtn data={record} actions={actionRef.current} key="btn" />,
        <a key="delete">
          <Popconfirm
            title={
              record.waiting
                ? '删除将导致正在进行的任务终止，确定要删除吗？'
                : intl.formatMessage({
                    id: 'pages.data.option.remove.tips',
                    defaultMessage: '确认删除？',
                  })
            }
            onConfirm={async () => {
              await service.deleteTask(record.id);
              onlyMessage(
                intl.formatMessage({
                  id: 'pages.data.option.success',
                  defaultMessage: '操作成功!',
                }),
              );
              actionRef.current?.reload();
            }}
          >
            <Tooltip
              title={intl.formatMessage({
                id: 'pages.data.option.remove',
                defaultMessage: '删除',
              })}
            >
              <DeleteOutlined />
            </Tooltip>
          </Popconfirm>
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <SearchComponent<FirmwareItem>
        field={columns}
        target="firmware-task"
        onSearch={(data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setParam(data);
        }}
        defaultParam={[{ column: 'firmwareId', value: id }]}
      />
      <ProTable<FirmwareItem>
        scroll={{ x: 1366 }}
        tableClassName={'firmware-task'}
        tableStyle={{ minHeight }}
        search={false}
        params={param}
        rowKey="id"
        columnEmptyText={''}
        headerTitle={
          <div>
            <PermissionButton
              onClick={() => {
                state.visible = true;
              }}
              isPermission={permission.add}
              key="button"
              icon={<PlusOutlined />}
              type="primary"
            >
              {intl.formatMessage({
                id: 'pages.data.option.add',
                defaultMessage: '新增',
              })}
            </PermissionButton>
          </div>
        }
        request={async (params) =>
          service.task({
            ...params,
            sorts: [{ name: 'createTime', order: 'desc' }],
          })
        }
        columns={columns}
        actionRef={actionRef}
      />
      <Save
        data={state.current}
        ids={{ id: id, productId: productId }}
        visible={state.visible}
        save={() => {
          state.visible = false;
          actionRef.current?.reload?.();
        }}
        close={() => {
          state.visible = false;
        }}
      />
    </PageContainer>
  );
});
export default Task;
