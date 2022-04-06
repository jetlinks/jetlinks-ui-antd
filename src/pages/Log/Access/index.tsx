import BaseService from '@/utils/BaseService';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import type { AccessLogItem } from '@/pages/Log/Access/typings';
import moment from 'moment';
import { Tag, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import SearchComponent from '@/components/SearchComponent';
import Detail from '@/pages/Log/Access/Detail';

const service = new BaseService('logger/access');

const Access = () => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const [param, setParam] = useState({});
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<AccessLogItem>>({});

  const columns: ProColumns<AccessLogItem>[] = [
    {
      title: 'IP',
      dataIndex: 'ip',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.log.access.url',
        defaultMessage: '请求路径',
      }),
      dataIndex: 'url',
      ellipsis: true,
    },
    {
      title: '请求方法',
      dataIndex: 'httpMethod',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.description',
        defaultMessage: '说明',
      }),
      dataIndex: 'description',
      ellipsis: true,
      render: (text, record) => {
        return `${record.action}-${record.describe}`;
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.log.access.requestTime',
        defaultMessage: '请求时间',
      }),
      dataIndex: 'requestTime',
      sorter: true,
      valueType: 'dateTime',
      defaultSortOrder: 'descend',
      ellipsis: true,
      width: 200,
      renderText: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: intl.formatMessage({
        id: 'pages.log.access.requestTimeConsuming',
        defaultMessage: '请求耗时',
      }),
      renderText: (record: AccessLogItem) => (
        <Tag color="purple">{record.responseTime - record.requestTime}ms</Tag>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'pages.log.access.requestUser',
        defaultMessage: '请求用户',
      }),
      dataIndex: 'context.username',
      render: (text) => <Tag color="geekblue">{text}</Tag>,
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      render: (text, record) => [
        <a
          key="editable"
          onClick={() => {
            setVisible(true);
            setCurrent(record);
          }}
        >
          <Tooltip title={'查看'}>
            <EyeOutlined />
          </Tooltip>
        </a>,
      ],
    },
  ];
  return (
    <>
      <SearchComponent<AccessLogItem>
        field={columns}
        target="access-log"
        onSearch={(data) => {
          actionRef.current?.reset?.();
          setParam(data);
        }}
      />
      <ProTable<AccessLogItem>
        columns={columns}
        params={param}
        request={async (params) =>
          service.query({ ...params, sorts: [{ name: 'responseTime', order: 'desc' }] })
        }
        defaultParams={{ sorts: [{ responseTime: 'desc' }] }}
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
export default Access;
