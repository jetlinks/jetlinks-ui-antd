import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { message } from 'antd';
import { useRef, useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import {
  ControlOutlined,
  // DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useHistory, useLocation } from 'umi';
import { model } from '@formily/reactive';
import { observer } from '@formily/react';
import type { FirmwareItem } from '@/pages/device/Firmware/typings';
import Save from './Save';
// import { onlyMessage } from '@/utils/util';
import { PermissionButton, AIcon } from '@/components';
import useDomFullHeight from '@/hooks/document/useDomFullHeight';
import usePermissions from '@/hooks/permission';
import SearchComponent from '@/components/SearchComponent';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { service } from '@/pages/device/Firmware';

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
  const id = (location as any).query?.id || localStorage.getItem('TaskId');
  const productId = (location as any).query?.productId || localStorage.getItem('TaskProductId');

  const UpgradeBtn = (props: { data: any; actions: any }) => {
    const { data, actions } = props;
    if (data.waiting > 0 && data?.state?.value === 'processing') {
      return (
        <PermissionButton
          key={'stop'}
          type={'link'}
          style={{ padding: 0 }}
          isPermission={permission.update}
          tooltip={{
            title: '停止',
          }}
          onClick={async () => {
            const resp = await service.stopTask(data.id);
            if (resp.status === 200) {
              message.success('操作成功！');
              actions?.reload();
            }
          }}
        >
          <StopOutlined />
        </PermissionButton>
      );
    } else if (data?.state?.value === 'canceled') {
      return (
        // <a>
        //   <Tooltip title={'继续升级'}>
        //     <ControlOutlined
        //       onClick={async () => {
        //         const resp = await service.startTask(data.id, ['canceled']);
        //         if (resp.status === 200) {
        //           message.success('操作成功！');
        //           actions?.reload();
        //         }
        //       }}
        //     />
        //   </Tooltip>
        // </a>
        <PermissionButton
          key={'stop'}
          type={'link'}
          style={{ padding: 0 }}
          isPermission={permission.update}
          tooltip={{
            title: '继续升级',
          }}
          onClick={async () => {
            const resp = await service.startTask(data.id, ['canceled']);
            if (resp.status === 200) {
              message.success('操作成功！');
              actions?.reload();
            }
          }}
        >
          <ControlOutlined />
        </PermissionButton>
      );
    }
    return null;
  };

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
      dataIndex: 'description',
    },
    {
      title: '完成比例',
      ellipsis: true,
      hideInSearch: true,
      dataIndex: 'progress',
      renderText: (text) => <>{text}%</>,
      // valueType: 'digit',
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      width: 200,
      fixed: 'right',
      render: (text, record) => [
        <PermissionButton
          key={'api'}
          type={'link'}
          style={{ padding: 0 }}
          isPermission={permission.view}
          tooltip={{
            title: '详情',
          }}
          onClick={() => {
            const url = getMenuPathByParams(MENUS_CODE['device/Firmware/Task/Detail'], record?.id);
            history.push(url);
          }}
        >
          <AIcon type={'icon-details'} />
        </PermissionButton>,
        <PermissionButton
          key="link"
          type={'link'}
          style={{ padding: 0 }}
          isPermission={permission.view}
          tooltip={{
            title: '查看',
          }}
          onClick={() => {
            state.visible = true;
            state.current = record;
          }}
        >
          <EyeOutlined />
        </PermissionButton>,
        <UpgradeBtn data={record} actions={actionRef.current} key="btn" />,
        // <PermissionButton
        //   key="delete"
        //   type={'link'}
        //   style={{ padding: 0 }}
        //   isPermission={permission.delete}
        //   tooltip={{
        //     title: '删除',
        //   }}
        //   popConfirm={{
        //     title:
        //       record.waiting > 0 || record.processing > 0
        //         ? '删除将导致正在进行的任务终止，确定要删除吗？'
        //         : intl.formatMessage({
        //             id: 'pages.data.option.remove.tips',
        //             defaultMessage: '确认删除？',
        //           }),
        //     onConfirm: async () => {
        //       const resp = await service.deleteTask(record.id);
        //       if (resp.status === 200) {
        //         onlyMessage(
        //           intl.formatMessage({
        //             id: 'pages.data.option.success',
        //             defaultMessage: '操作成功!',
        //           }),
        //         );
        //         actionRef.current?.reload();
        //       } else {
        //         message.error(resp?.message || '删除失败！');
        //       }
        //     },
        //   }}
        // >
        //   <DeleteOutlined />
        // </PermissionButton>,
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
                state.current = undefined;
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
      {state.visible && (
        <Save
          data={state.current}
          ids={{ id: id, productId: productId }}
          save={() => {
            state.visible = false;
            actionRef.current?.reload?.();
          }}
          close={() => {
            state.visible = false;
          }}
        />
      )}
    </PageContainer>
  );
});
export default Task;
