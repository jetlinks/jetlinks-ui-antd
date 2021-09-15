import { PageContainer } from '@ant-design/pro-layout';
import BaseCrud from '@/components/BaseCrud';
import type { ProColumns } from '@jetlinks/pro-table';
import { CurdModel } from '@/components/BaseCrud/model';
import { message, Popconfirm, Tooltip } from 'antd';
import { CloseCircleOutlined, EditOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ActionType } from '@jetlinks/pro-table';
import { useEffect, useRef, useState } from 'react';
import type { ISchema } from '@formily/json-schema';
import Service from '@/pages/system/DataSource/service';
import { from, mergeMap, toArray } from 'rxjs';
import { map } from 'rxjs/operators';

export const service = new Service('datasource/config');

const DataSource = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const [type, setType] = useState<DataSourceType[]>([]);
  useEffect(() => {
    service
      .getType()
      .pipe(
        mergeMap((data: DataSourceType[]) => from(data)),
        map((i: DataSourceType) => ({ label: i.name, value: i.id })),
        toArray(),
      )
      .subscribe((data: Partial<DataSourceType>[]) => {
        setType(data as DataSourceType[]);
      });
  }, []);

  const columns: ProColumns<DataSourceItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: 200,
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'typeId',
    },
    {
      title: '说明',
      dataIndex: 'description',
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (value: any) => value.text,
    },
    {
      title: '操作',
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
        <a href={record.id} target="_blank" rel="noopener noreferrer" key="view">
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.data.option.disable.tips',
              defaultMessage: '确认禁用？',
            })}
            onConfirm={async () => {
              await service.update({
                id: record.id,
                // state: record.state ? 0 : 1,
              });
              message.success(
                intl.formatMessage({
                  id: 'pages.data.option.success',
                  defaultMessage: '操作成功!',
                }),
              );
              actionRef.current?.reload();
            }}
          >
            <Tooltip
              title={intl.formatMessage({
                id: `pages.data.option.${record.state ? 'disable' : 'enable'}`,
                defaultMessage: record.state ? '禁用' : '启用',
              })}
            >
              {record.state ? <CloseCircleOutlined /> : <PlayCircleOutlined />}
            </Tooltip>
          </Popconfirm>
        </a>,
      ],
    },
  ];

  const schema: ISchema = {
    type: 'object',
    properties: {
      grid: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          minColumns: [1],
          maxColumns: [2],
        },
        properties: {
          name: {
            title: '名称',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 1,
              labelCol: 6,
            },
          },
          typeId: {
            title: '类型',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 1,
              labelCol: 6,
            },
            enum: type,
          },
          'shareConfig.adminUrl': {
            title: '管理地址',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 1,
              labelCol: 6,
            },
            required: true,
            default: 'http://localhost:15672',
            'x-visible': false,
            'x-component': 'Input',
            'x-display': 'none',
            'x-reactions': {
              dependencies: ['typeId'],
              fulfill: {
                state: {
                  display: '{{$deps[0]==="rabbitmq"?"visible":"none"}}',
                },
              },
            },
          },
          'shareConfig.addresses': {
            title: '链接地址',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 1,
              labelCol: 6,
            },
            required: true,
            default: 'localhost:5672',
            'x-component': 'Input',
            'x-display': 'none',
            'x-reactions': {
              dependencies: ['typeId'],
              fulfill: {
                state: {
                  display: '{{$deps[0]==="rabbitmq"?"visible":"none"}}',
                },
              },
            },
          },
          'shareConfig.virtualHost': {
            title: '虚拟域',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 1,
              labelCol: 6,
            },
            required: true,
            default: '/',
            'x-component': 'Input',
            'x-display': 'none',
            'x-reactions': {
              dependencies: ['typeId'],
              fulfill: {
                state: {
                  display: '{{$deps[0]==="rabbitmq"?"visible":"none"}}',
                },
              },
            },
          },
          'shareConfig.username': {
            title: '用户名',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 1,
              labelCol: 6,
            },
            'x-component': 'Input',
            'x-display': 'none',
            'x-reactions': {
              dependencies: ['typeId'],
              fulfill: {
                state: {
                  display: '{{$deps[0]==="rabbitmq"?"visible":"none"}}',
                },
              },
            },
          },
          'shareConfig.password': {
            title: '密码',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 1,
              labelCol: 6,
            },
            'x-display': 'none',
            'x-reactions': {
              dependencies: ['typeId'],
              fulfill: {
                state: {
                  display: '{{$deps[0]==="rabbitmq"?"visible":"none"}}',
                },
              },
            },
            'x-component': 'Input',
          },
          'shareConfig.bootstrapServers': {
            title: '地址',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
              labelCol: 3,
              wrapperCol: 20,
            },
            'x-component': 'Select',
            'x-component-props': {
              mode: 'tags',
            },
            'x-display': 'none',
            'x-reactions': {
              dependencies: ['typeId'],
              fulfill: {
                state: {
                  display: '{{$deps[0]==="kafka"?"visible":"none"}}',
                },
              },
            },
          },
          description: {
            title: '说明',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
              labelCol: 3,
              wrapperCol: 20,
            },
            'x-component': 'Input.TextArea',
            'x-component-props': {
              rows: 4,
            },
          },
        },
      },
    },
  };

  return (
    <PageContainer>
      <BaseCrud<DataSourceItem>
        modelConfig={{
          width: 1000,
        }}
        columns={columns}
        service={service}
        title="数据源管理"
        schema={schema}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};
export default DataSource;
