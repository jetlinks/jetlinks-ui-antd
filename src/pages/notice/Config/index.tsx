import { PageContainer } from '@ant-design/pro-layout';
import BaseService from '@/utils/BaseService';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import {
  ArrowDownOutlined,
  BarsOutlined,
  BugOutlined,
  EditOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useRef } from 'react';
import BaseCrud from '@/components/BaseCrud';
import { useIntl } from '@@/plugin-locale/localeExports';

export const service = new BaseService<ConfigItem>('notifier/config');

const Config = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<ConfigItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
    },
    {
      dataIndex: 'type',
      title: intl.formatMessage({
        id: 'pages.notice.config.type',
        defaultMessage: '通知类型',
      }),
    },
    {
      dataIndex: 'provider',
      title: intl.formatMessage({
        id: 'pages.notice.config.service',
        defaultMessage: '服务商',
      }),
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
        <a onClick={() => console.log(record)}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            })}
          >
            <EditOutlined />
          </Tooltip>
        </a>,
        <a>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.remove',
              defaultMessage: '删除',
            })}
          >
            <MinusOutlined />
          </Tooltip>
        </a>,
        <a>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.download',
              defaultMessage: '下载配置',
            })}
          >
            <ArrowDownOutlined />
          </Tooltip>
        </a>,
        <a>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.notice.option.debug',
              defaultMessage: '调试',
            })}
          >
            <BugOutlined />
          </Tooltip>
        </a>,
        <a>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.notice.option.record',
              defaultMessage: '通知记录',
            })}
          >
            <BarsOutlined />
          </Tooltip>
        </a>,
      ],
    },
  ];

  const schema = {};

  return (
    <PageContainer>
      <BaseCrud
        columns={columns}
        service={service}
        title={intl.formatMessage({
          id: 'pages.notice.config',
          defaultMessage: '通知配置',
        })}
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Config;
