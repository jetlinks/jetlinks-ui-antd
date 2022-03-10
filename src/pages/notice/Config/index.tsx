import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import {
  ArrowDownOutlined,
  BarsOutlined,
  BugOutlined,
  EditOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { message, Popconfirm, Tooltip } from 'antd';
import { useMemo, useRef, useState } from 'react';
import BaseCrud from '@/components/BaseCrud';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ISchema } from '@formily/json-schema';
import { downloadObject, useAsyncDataSource } from '@/utils/util';
import { CurdModel } from '@/components/BaseCrud/model';
import Service from '@/pages/notice/Config/service';
import { createForm, onFieldValueChange } from '@formily/core';
import { observer } from '@formily/react';

export const service = new Service('notifier/config');

const Config = observer(() => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const providerRef = useRef<NetworkType[]>([]);
  const oldTypeRef = useRef();

  const [configSchema, setConfigSchema] = useState<ISchema>({});
  const [loading, setLoading] = useState<boolean>(false);
  const createSchema = async () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const DForm = form;
    if (!DForm?.values) return;
    DForm.setValuesIn('provider', DForm.values.provider);
    const resp = await service.getMetadata(
      DForm?.values?.type,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      currentType || DForm.values?.provider,
    );
    const properties = resp.result?.properties as ConfigMetadata[];
    setConfigSchema({
      type: 'object',
      properties: properties?.reduce((previousValue, currentValue) => {
        if (currentValue.type?.type === 'array') {
          // 单独处理邮件的其他配置功能
          previousValue[currentValue.property] = {
            type: 'array',
            title: '其他配置',
            'x-component': 'ArrayItems',
            'x-decorator': 'FormItem',
            items: {
              type: 'object',
              properties: {
                space: {
                  type: 'void',
                  'x-component': 'Space',
                  properties: {
                    sort: {
                      type: 'void',
                      'x-decorator': 'FormItem',
                      'x-component': 'ArrayItems.SortHandle',
                    },
                    name: {
                      type: 'string',
                      title: 'key',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                    },
                    value: {
                      type: 'string',
                      title: 'value',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                    },
                    description: {
                      type: 'string',
                      title: '备注',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                    },
                    remove: {
                      type: 'void',
                      'x-decorator': 'FormItem',
                      'x-component': 'ArrayItems.Remove',
                    },
                  },
                },
              },
            },
            properties: {
              add: {
                type: 'void',
                title: '添加条目',
                'x-component': 'ArrayItems.Addition',
              },
            },
          };
        } else {
          previousValue[currentValue.property] = {
            title: currentValue.name,
            type: 'string',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
          };
        }
        return previousValue;
      }, {}),
    });
    DForm.setValues(CurdModel.current);
    setLoading(false);
  };
  const schema: ISchema = {
    type: 'object',
    properties: {
      name: {
        title: '名称',
        'x-component': 'Input',
        'x-decorator': 'FormItem',
      },
      type: {
        title: '类型',
        'x-component': 'Select',
        'x-decorator': 'FormItem',
        'x-reactions': ['{{useAsyncDataSource(getTypes)}}'],
      },
      provider: {
        title: '服务商',
        'x-component': 'Select',
        'x-decorator': 'FormItem',
      },
      configuration: configSchema,
    },
  };

  const formEvent = () => {
    onFieldValueChange('type', async (field, f) => {
      const type = field.value;
      if (!type) return;
      f.setFieldState('provider', (state) => {
        state.value = undefined;
        state.dataSource = providerRef.current
          .find((item) => type === item.id)
          ?.providerInfos.map((i) => ({ label: i.name, value: i.id }));
      });
    });
    onFieldValueChange('provider', async (field) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      currentType = field.value;
      await createSchema();
    });
  };

  const form = useMemo(
    () =>
      createForm({
        effects: formEvent,
        initialValues: CurdModel.current,
      }),
    [],
  );

  let currentType = form.values.provider;

  if (oldTypeRef.current !== currentType) {
    form.clearFormGraph('configuration.*'); // 回收字段模型
    form.deleteValuesIn('configuration.*');
  }

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
        id: 'pages.table.provider',
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
        <a
          key="edit"
          onClick={async () => {
            setLoading(true);
            CurdModel.update(record);
            form.setValues(record);
            await createSchema();
            CurdModel.model = 'edit';
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
        <a onClick={() => downloadObject(record, '通知配置')} key="download">
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.download',
              defaultMessage: '下载配置',
            })}
          >
            <ArrowDownOutlined />
          </Tooltip>
        </a>,
        <a key="debug">
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.notice.option.debug',
              defaultMessage: '调试',
            })}
          >
            <BugOutlined />
          </Tooltip>
        </a>,
        <a key="record">
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.record',
              defaultMessage: '通知记录',
            })}
          >
            <BarsOutlined />
          </Tooltip>
        </a>,
        <a key="remove">
          <Popconfirm
            onConfirm={async () => {
              await service.remove(record.id);
              message.success(
                intl.formatMessage({
                  id: 'pages.data.option.success',
                  defaultMessage: '操作成功!',
                }),
              );
              actionRef.current?.reload();
            }}
            title="确认删除?"
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

  const getTypes = async () =>
    service.getTypes().then((resp) => {
      providerRef.current = resp.result;
      return resp.result.map((item: NetworkType) => ({
        label: item.name,
        value: item.id,
      }));
    });

  return (
    <PageContainer>
      <BaseCrud
        columns={columns}
        service={service}
        title={intl.formatMessage({
          id: 'pages.notice.config',
          defaultMessage: '通知配置',
        })}
        modelConfig={{
          width: '50vw',
          loading: loading,
        }}
        schema={schema}
        form={form}
        schemaConfig={{ scope: { useAsyncDataSource, getTypes } }}
        actionRef={actionRef}
      />
    </PageContainer>
  );
});
export default Config;
