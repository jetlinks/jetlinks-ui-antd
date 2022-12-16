import { useIntl } from '@@/plugin-locale/localeExports';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import type { SystemLogItem } from '@/pages/Log/System/typings';
import { Tag, Tooltip } from 'antd';
import moment from 'moment';
// import BaseService from '@/utils/BaseService';
import Service from '../service';
import { EyeOutlined } from '@ant-design/icons';
import SearchComponent from '@/components/SearchComponent';
import Detail from '@/pages/Log/System/Detail';
import { useDomFullHeight } from '@/hooks';

const service = new Service('logger/system');
const System = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [param, setParam] = useState({});
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<SystemLogItem>>({});
  const { minHeight } = useDomFullHeight(`.systemLog`, 24);

  const columns: ProColumns<SystemLogItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'name',
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '日志级别',
      dataIndex: 'level',
      width: 80,
      render: (text) => <Tag color={text === 'ERROR' ? 'red' : 'orange'}>{text}</Tag>,
      valueType: 'select',
      valueEnum: {
        ERROR: {
          text: 'ERROR',
          status: 'ERROR',
        },
        INFO: {
          text: 'INFO',
          status: 'INFO',
        },
        DEBUG: {
          text: 'DEBUG',
          status: 'DEBUG',
        },
        WARN: {
          text: 'WARN',
          status: 'WARN',
        },
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.log.system.logContent',
        defaultMessage: '日志内容',
      }),
      dataIndex: 'message',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.log.system.serviceName',
        defaultMessage: '服务名',
      }),
      dataIndex: 'context.server',
      width: 150,
      ellipsis: true,
      valueType: 'select',
      render: (text, record) => record?.context?.server || '',
      request: async () => {
        const res = await service.getServer();
        if (res.status === 200) {
          return res.result.map((item: any) => ({ label: item.name, value: item.id }));
        }
        return [];
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.log.system.creationTime',
        defaultMessage: '创建时间',
      }),
      dataIndex: 'createTime',
      width: 200,
      sorter: true,
      ellipsis: true,
      valueType: 'dateTime',
      defaultSortOrder: 'descend',
      renderText: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'left',
      width: 100,
      fixed: 'right',
      render: (text, record) => [
        <a
          key="editable"
          onClick={() => {
            setVisible(true);
            setCurrent(record);
          }}
        >
          <Tooltip title="查看">
            <EyeOutlined />
          </Tooltip>
        </a>,
      ],
    },
  ];
  return (
    <>
      <SearchComponent<SystemLogItem>
        field={columns}
        target="system-log"
        onSearch={(data) => {
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTable<SystemLogItem>
        columns={columns}
        params={param}
        columnEmptyText={''}
        scroll={{ x: 1366 }}
        tableClassName={'systemLog'}
        tableStyle={{ minHeight }}
        request={async (params) =>
          service.query({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
        }
        defaultParams={{ sorts: [{ createTime: 'desc' }] }}
        search={false}
        actionRef={actionRef}
      />
      {visible && (
        <Detail
          data={current}
          close={() => {
            setVisible(false);
            setCurrent({});
          }}
        />
      )}
    </>
  );
};
export default System;
