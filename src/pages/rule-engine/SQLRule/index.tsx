import { PageContainer } from '@ant-design/pro-layout';
import { useRef } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import type { SQLRuleItem } from '@/pages/rule-engine/SQLRule/typings';
import { Tooltip } from 'antd';
import {
  CaretRightOutlined,
  DownloadOutlined,
  EditOutlined,
  MinusOutlined,
  ReloadOutlined,
  StopOutlined,
} from '@ant-design/icons';
import BaseCrud from '@/components/BaseCrud';
import { service } from '@/pages/rule-engine/Instance';
import { useIntl } from '@@/plugin-locale/localeExports';
import { onlyMessage } from '@/utils/util';

const SQLRule = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<SQLRuleItem>[] = [
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
      dataIndex: 'createTime',
      title: intl.formatMessage({
        id: 'pages.ruleEngine.sqlRule.time',
        defaultMessage: '创建时间',
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
        <a onClick={() => console.log(record)}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.ruleEngine.option.stop',
              defaultMessage: '停止',
            })}
          >
            <StopOutlined />
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
        <a key="download">
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.download',
              defaultMessage: '下载配置',
            })}
          >
            <DownloadOutlined
              onClick={() => {
                onlyMessage(
                  `${intl.formatMessage({
                    id: 'pages.data.option.download',
                    defaultMessage: '下载',
                  })}`,
                );
              }}
            />
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
          id: 'pages.ruleEngine.sqlRule',
          defaultMessage: '数据转发',
        })}
        schema={schema}
        defaultParams={{ modelType: 'sql_rule' }}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default SQLRule;
