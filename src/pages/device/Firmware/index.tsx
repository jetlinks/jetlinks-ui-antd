import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { Button, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { useRef } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import { EditOutlined, EyeOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import { model } from '@formily/reactive';
import { observer } from '@formily/react';
import type { FirmwareItem, TaskItem } from '@/pages/device/Firmware/typings';
import Service from '@/pages/device/Firmware/service';
import Save from '@/pages/device/Firmware/Save';
import { onlyMessage } from '@/utils/util';

export const service = new Service('firmware');

export const state = model<{
  current?: FirmwareItem;
  visible: boolean;
  task: boolean;
  release: boolean;
  taskItem?: TaskItem;
  taskDetail: boolean;
  tab: 'task' | 'history';
  historyParams?: Record<string, unknown>;
}>({
  visible: false,
  task: false,
  release: false,
  taskDetail: false,
  tab: 'task',
});
const Firmware = observer(() => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  const columns: ProColumns<FirmwareItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.firmware.name',
        defaultMessage: '固件名称',
      }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.firmware.version',
        defaultMessage: '固件版本',
      }),
      dataIndex: 'version',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.firmware.productName',
        defaultMessage: '所属产品',
      }),
      dataIndex: 'productName',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.firmware.signMethod',
        defaultMessage: '签名方式',
      }),
      dataIndex: 'signMethod',
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.firmware.createTime',
        defaultMessage: '创建时间',
      }),
      dataIndex: 'createTime',
      width: '200px',
      align: 'center',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      sorter: true,
      defaultSortOrder: 'descend',
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
        <Link
          onClick={() => {
            state.current = record;
          }}
          to={`/device/firmware/detail/${record.id}`}
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
        </Link>,
        <a
          key="editable"
          onClick={() => {
            state.visible = true;
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            })}
          >
            <EditOutlined />
          </Tooltip>
        </a>,
        <a key="delete">
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.data.option.remove.tips',
              defaultMessage: '确认删除？',
            })}
            onConfirm={async () => {
              await service.remove(record.id);
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
              <MinusOutlined />
            </Tooltip>
          </Popconfirm>
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<FirmwareItem>
        toolBarRender={() => [
          <Button
            onClick={() => {
              state.visible = true;
            }}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            新增
          </Button>,
        ]}
        request={async (params) => service.query(params)}
        columns={columns}
        actionRef={actionRef}
      />
      <Save
        data={state.current}
        visible={state.visible}
        close={() => {
          state.visible = false;
        }}
      />
    </PageContainer>
  );
});
export default Firmware;
