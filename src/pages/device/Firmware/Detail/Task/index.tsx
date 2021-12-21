import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import type { TaskItem } from '@/pages/device/Firmware/typings';
import { service, state } from '@/pages/device/Firmware';
import { Button, Tooltip } from 'antd';
import {
  CloudDownloadOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useIntl, useParams } from 'umi';
import Save from '@/pages/device/Firmware/Detail/Task/Save';
import { observer } from '@formily/react';
import Release from '@/pages/device/Firmware/Detail/Task/Release';

const Task = observer(() => {
  const intl = useIntl();
  const param = useParams<{ id: string }>();
  const columns: ProColumns<TaskItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      dataIndex: 'id',
      title: 'id',
      width: 200,
    },
    {
      dataIndex: 'name',
      title: '任务名称',
    },
    {
      dataIndex: 'mode',
      title: '升级方式',
      renderText: (text) => text.text,
    },
    {
      dataIndex: 'timeoutSeconds',
      title: '超时时间(秒)',
    },
    {
      dataIndex: 'createTime',
      valueType: 'dateTime',
      title: '创建时间',
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      render: (text, record) => [
        <a
          key="cat"
          onClick={() => {
            state.task = true;
          }}
        >
          <Tooltip title="查看">
            <EyeOutlined />
          </Tooltip>
        </a>,
        <a
          key="task"
          onClick={() => {
            state.release = true;
            state.taskItem = record;
          }}
        >
          <Tooltip title="下发任务">
            <CloudDownloadOutlined />
          </Tooltip>
        </a>,
        <a key="remove">
          <Tooltip title="删除">
            <DeleteOutlined />
          </Tooltip>
        </a>,
      ],
    },
  ];
  return (
    <>
      <ProTable
        columns={columns}
        rowKey="id"
        defaultParams={{
          firmwareId: param.id,
        }}
        toolBarRender={() => [
          <Button onClick={() => {}} key="button" icon={<PlusOutlined />} type="primary">
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </Button>,
        ]}
        request={async (params) => service.task(params)}
      />
      <Save
        close={() => {
          state.task = false;
        }}
        visible={state.task}
      />
      <Release
        close={() => {
          state.release = false;
        }}
        visible={state.release}
      />
    </>
  );
});
export default Task;
