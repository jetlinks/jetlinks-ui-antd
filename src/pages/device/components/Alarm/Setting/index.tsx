import type { ProColumns } from '@jetlinks/pro-table';
import ProTable, { ActionType } from '@jetlinks/pro-table';
import type { AlarmSetting } from '@/pages/device/Product/typings';
import { Button, Popconfirm, Space, Tooltip } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import { useParams } from 'umi';
import {
  EditOutlined,
  MinusOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import Edit from '../Edit';
import { useRef, useState } from 'react';
import { service } from '@/pages/device/components/Alarm';
import { onlyMessage } from '@/utils/util';

interface Props {
  type: 'product' | 'device';
}

const Setting = (props: Props) => {
  const { type } = props;
  const intl = useIntl();
  const param = useParams<{ id: string }>();
  const [edit, setEdit] = useState<boolean>(false);
  const [data, setData] = useState<Record<string, unknown>>();
  const actionRef = useRef<ActionType>();

  const action = async (id: string, ac: 'start' | 'stop') => {
    const resp = await service.action(id, ac);
    if (resp.status === 200) {
      onlyMessage('操作成功');
    }
    actionRef.current?.reload();
  };
  const columns: ProColumns<AlarmSetting>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: intl.formatMessage({
        id: 'pages.device.category.key',
        defaultMessage: '标识',
      }),
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.createTime',
        defaultMessage: '创建时间',
      }),
      valueType: 'dateTime',
      dataIndex: 'createTime',
    },
    {
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      dataIndex: 'state',
      renderText: (state) => state.text,
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (_, record) => [
        <a
          key="editable"
          onClick={async () => {
            setEdit(true);
            setData(record);
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
        <a key="record">
          <Tooltip title="告警日志">
            <UnorderedListOutlined />
          </Tooltip>
        </a>,
        record.state.value === 'stopped' ? (
          <Popconfirm onConfirm={() => action(record.id, 'start')} title="启动此告警？">
            <a key="start">
              <Tooltip title="启动">
                <PauseCircleOutlined />
              </Tooltip>
            </a>
          </Popconfirm>
        ) : (
          <Popconfirm onConfirm={() => action(record.id, 'stop')} title="停止此告警？">
            <a key="stop">
              <Tooltip title="停止">
                <PlayCircleOutlined />
              </Tooltip>
            </a>
          </Popconfirm>
        ),

        <Popconfirm
          onConfirm={async () => {
            const resp = await service.remove(record.id);
            if (resp.status === 200) {
              onlyMessage('操作成功');
            }
            actionRef.current?.reload();
          }}
          title="确认删除此告警设置？"
        >
          <a key="remove">
            <Tooltip title="删除">
              <MinusOutlined />
            </Tooltip>
          </a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <>
      <ProTable
        actionRef={actionRef}
        tableAlertOptionRender={() => (
          <Space size={16}>
            <Button onClick={() => {}}>新增告警</Button>
          </Space>
        )}
        toolBarRender={() => [
          <Button
            onClick={() => {
              setEdit(true);
              setData({});
            }}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </Button>,
        ]}
        pagination={false}
        request={async () => {
          const response = await service.alarmList(type, param.id);
          return {
            result: { data: response.result },
            success: true,
            status: 200,
          } as any;
        }}
        columns={columns}
        rowKey="id"
        search={false}
      />
      <Edit
        type={type}
        data={data}
        visible={edit}
        close={() => {
          setEdit(false);
          setData({});
        }}
      />
    </>
  );
};
export default Setting;
