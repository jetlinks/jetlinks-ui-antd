import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { message, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import { DeleteOutlined, EditOutlined, NodeExpandOutlined, PlusOutlined } from '@ant-design/icons';
import { useHistory } from 'umi';
import { model } from '@formily/reactive';
import { observer } from '@formily/react';
import type { FirmwareItem } from '@/pages/device/Firmware/typings';
import Service from '@/pages/device/Firmware/service';
import Save from '@/pages/device/Firmware/Save';
import { PermissionButton } from '@/components';
import useDomFullHeight from '@/hooks/document/useDomFullHeight';
import usePermissions from '@/hooks/permission';
import SearchComponent from '@/components/SearchComponent';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { onlyMessage } from '@/utils/util';

export const service = new Service('firmware');

export const state = model<{
  current?: FirmwareItem;
  visible: boolean;
}>({
  visible: false,
});
const Firmware = observer(() => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const { minHeight } = useDomFullHeight(`.firmware`, 24);
  const { permission } = usePermissions('device/Firmware');
  const [param, setParam] = useState({});
  const history = useHistory<Record<string, string>>();

  const columns: ProColumns<FirmwareItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.device.firmware.name',
        defaultMessage: '固件名称',
      }),
      ellipsis: true,
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.firmware.version',
        defaultMessage: '固件版本',
      }),
      ellipsis: true,
      dataIndex: 'version',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.firmware.productName',
        defaultMessage: '所属产品',
      }),
      ellipsis: true,
      dataIndex: 'productId',
      valueType: 'select',
      render: (text: any, record: any) => record?.productName,
      request: () =>
        service
          .queryProduct({
            paging: false,
            // terms: [
            //   {
            //     column: 'state',
            //     value: 1,
            //   },
            // ],
            sorts: [{ name: 'name', order: 'desc' }],
          })
          .then((resp: any) =>
            (resp?.result || []).map((item: any) => ({
              label: item.name,
              value: item.id,
            })),
          ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.firmware.signMethod',
        defaultMessage: '签名方式',
      }),
      ellipsis: true,
      valueType: 'select',
      dataIndex: 'signMethod',
      valueEnum: {
        md5: {
          text: 'MD5',
          status: 'md5',
        },
        sha256: {
          text: 'SHA256',
          status: 'sha256',
        },
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.firmware.createTime',
        defaultMessage: '创建时间',
      }),
      dataIndex: 'createTime',
      width: '200px',
      ellipsis: true,
      valueType: 'dateTime',
      // render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      // sorter: true,
      // defaultSortOrder: 'descend',
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
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      width: 200,
      fixed: 'right',
      render: (text, record) => [
        <PermissionButton
          style={{ padding: 0 }}
          type="link"
          isPermission={permission.action}
          key="upgrade"
          onClick={() => {
            const url = `${getMenuPathByParams(MENUS_CODE['device/Firmware/Task'])}`;
            history.push(`${url}?id=${record?.id}&productId=${record?.productId}`);
          }}
          tooltip={{
            title: '升级任务',
          }}
        >
          <NodeExpandOutlined />
        </PermissionButton>,
        <PermissionButton
          style={{ padding: 0 }}
          type="link"
          isPermission={permission.update}
          key="editable"
          onClick={() => {
            state.visible = true;
            state.current = record;
          }}
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            }),
          }}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          type="link"
          key="delete"
          style={{ padding: 0 }}
          isPermission={permission.delete}
        >
          <Popconfirm
            onConfirm={async () => {
              const resp: any = await service.remove(record.id);
              if (resp.status === 200) {
                onlyMessage(
                  intl.formatMessage({
                    id: 'pages.data.option.success',
                    defaultMessage: '操作成功!',
                  }),
                );
                actionRef.current?.reload();
              } else {
                message.error(resp?.message || '删除失败！');
              }
            }}
            title="确认删除?"
          >
            <DeleteOutlined />
          </Popconfirm>
        </PermissionButton>,
      ],
    },
  ];

  return (
    <PageContainer>
      <SearchComponent<FirmwareItem>
        field={columns}
        target="firmware"
        onSearch={(data) => {
          // 重置分页数据
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTable<FirmwareItem>
        scroll={{ x: 1366 }}
        tableClassName={'firmware'}
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
          service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
        columns={columns}
        actionRef={actionRef}
      />
      <Save
        data={state.current}
        visible={state.visible}
        close={() => {
          state.visible = false;
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
});
export default Firmware;
