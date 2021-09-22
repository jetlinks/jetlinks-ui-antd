import { PageContainer } from '@ant-design/pro-layout';
import BaseService from '@/utils/BaseService';
import type { InstanceItem } from '@/pages/rule-engine/Instance/typings';
import { useRef } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import {
  CaretRightOutlined,
  EditOutlined,
  EyeOutlined,
  MinusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import BaseCrud from '@/components/BaseCrud';
import { useIntl } from '@@/plugin-locale/localeExports';

export const service = new BaseService<InstanceItem>('rule-engine/instance');
const Instance = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<InstanceItem>[] = [
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
      dataIndex: 'modelType',
      title: intl.formatMessage({
        id: 'pages.link.type',
        defaultMessage: '类型',
      }),
    },
    {
      dataIndex: 'state',
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      render: (text, record) => record.state.value,
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
        <a>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.ruleEngine.option.detail',
              defaultMessage: '查看',
            })}
          >
            <EyeOutlined />
          </Tooltip>
        </a>,
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
        <a onClick={() => console.log(record)}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.ruleEngine.option.start',
              defaultMessage: '启动',
            })}
          >
            <CaretRightOutlined />
          </Tooltip>
        </a>,
        <a onClick={() => console.log(record)}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.ruleEngine.option.restart',
              defaultMessage: '重启',
            })}
          >
            <ReloadOutlined />
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
          id: 'pages.ruleEngine.instance',
          defaultMessage: '规则实例',
        })}
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default Instance;
