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
import { Badge, Tooltip } from 'antd';
import BaseCrud from '@/components/BaseCrud';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ISchema } from '@formily/json-schema';

export const service = new BaseService<InstanceItem>('rule-engine/instance');
const Instance = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<InstanceItem>[] = [
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      ellipsis: true,
    },
    {
      dataIndex: 'state',
      title: '状态',
      render: (text: any) => (
        <Badge color={text?.value === 'stopped' ? 'red' : 'green'} text={text?.text} />
      ),
    },
    {
      dataIndex: 'description',
      title: '说明',
      ellipsis: true,
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
        <a key={'edit'} onClick={() => console.log(record)}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            })}
          >
            <EditOutlined />
          </Tooltip>
        </a>,
        <a key={'see'}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.ruleEngine.option.detail',
              defaultMessage: '查看',
            })}
          >
            <EyeOutlined />
          </Tooltip>
        </a>,
        <a key={'enabled'} onClick={() => console.log(record)}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.ruleEngine.option.start',
              defaultMessage: '启动',
            })}
          >
            <CaretRightOutlined />
          </Tooltip>
        </a>,
        <a key={'reload'} onClick={() => console.log(record)}>
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.ruleEngine.option.restart',
              defaultMessage: '重启',
            })}
          >
            <ReloadOutlined />
          </Tooltip>
        </a>,

        <a key={'delete'}>
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

  const schema: ISchema = {
    type: 'object',
    properties: {
      name: {
        title: intl.formatMessage({
          id: 'pages.table.name',
          defaultMessage: '名称',
        }),
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        name: 'name',
        'x-validator': [
          {
            max: 64,
            message: '最多可输入64个字符',
          },
          {
            required: true,
            message: '请输入名称',
          },
        ],
      },
      description: {
        title: '说明',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-component-props': {
          rows: 5,
        },
        'x-validator': [
          {
            max: 200,
            message: '最多可输入200个字符',
          },
        ],
      },
    },
  };

  return (
    <PageContainer>
      <BaseCrud
        columns={columns}
        service={service}
        search={false}
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
