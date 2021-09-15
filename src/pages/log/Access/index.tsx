import { PageContainer } from '@ant-design/pro-layout';
import BaseService from '@/utils/BaseService';
import React, { useRef } from 'react';
import type { ProColumns, ActionType } from '@jetlinks/pro-table';
import type { AccessLogItem } from '@/pages/log/Access/typings';
import moment from 'moment';
import { Tag, Tooltip } from 'antd';
import { CurdModel } from '@/components/BaseCrud/model';
import { EditOutlined } from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import BaseCrud from '@/components/BaseCrud';

const service = new BaseService('logger/access');
const Access: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const columns: ProColumns<AccessLogItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      // ellipsis: true
    },
    {
      title: intl.formatMessage({
        id: 'pages.log.access.requestPath',
        defaultMessage: '请求路径',
      }),
      dataIndex: 'url',
      // ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.log.access.describe',
        defaultMessage: '说明',
      }),
      dataIndex: 'describe',
      // ellipsis: true,
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
      defaultSortOrder: 'descend',
      // ellipsis: true,
      renderText: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: intl.formatMessage({
        id: 'pages.log.access.requestTimeConsuming',
        defaultMessage: '请求耗时',
      }),
      // width: 100,
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
      width: 200,
      render: (text, record) => [
        <a key="editable" onClick={() => CurdModel.update(record)}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            })}
          >
            <EditOutlined />
          </Tooltip>
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <BaseCrud<AccessLogItem>
        columns={columns}
        service={service}
        title={intl.formatMessage({
          id: 'pages.log.access',
          defaultMessage: '访问日志',
        })}
        schema={{}}
        toolBar={[]}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Access;
