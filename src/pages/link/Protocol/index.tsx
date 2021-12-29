import { PageContainer } from '@ant-design/pro-layout';
import type { ProtocolItem } from '@/pages/link/Protocol/typings';
import { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { message, Popconfirm, Tag, Tooltip } from 'antd';
import {
  BugOutlined,
  CloseOutlined,
  CloudSyncOutlined,
  EditOutlined,
  MinusOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import BaseCrud from '@/components/BaseCrud';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ISchema } from '@formily/json-schema';
import { CurdModel } from '@/components/BaseCrud/model';
import Service from '@/pages/link/Protocol/service';
import Debug from '@/pages/link/Protocol/Debug';

export const service = new Service('protocol');
const Protocol = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<ProtocolItem>>({});

  const modifyState = async (id: string, type: 'deploy' | 'un-deploy') => {
    const resp = await service.modifyState(id, type);
    if (resp.status === 200) {
      message.success('操作成功!');
    } else {
      message.error('操作失败!');
    }
    actionRef.current?.reload();
  };

  const columns: ProColumns<ProtocolItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      dataIndex: 'id',
      title: 'ID',
      sorter: true,
      defaultSortOrder: 'ascend',
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
    },
    {
      dataIndex: 'state',
      title: '状态',
      renderText: (text) =>
        text === 1 ? <Tag color="#108ee9">正常</Tag> : <Tag color="#F50">禁用</Tag>,
    },
    {
      dataIndex: 'type',
      title: '类型',
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
          onClick={() => {
            CurdModel.update(record);
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
        record.state !== 1 && (
          <a key="publish">
            <Popconfirm title="发布？" onConfirm={() => modifyState(record.id, 'deploy')}>
              <Tooltip title="发布">
                <PlayCircleOutlined />
              </Tooltip>
            </Popconfirm>
          </a>
        ),
        record.state === 1 && (
          <a key="reload">
            <Popconfirm title="重新发布？" onConfirm={() => modifyState(record.id, 'deploy')}>
              <Tooltip title="重新发布">
                <CloudSyncOutlined />
              </Tooltip>
            </Popconfirm>
          </a>
        ),
        record.state === 1 && (
          <a key="unDeploy">
            <Popconfirm onConfirm={() => modifyState(record.id, 'un-deploy')} title="发布？">
              <Tooltip title="取消发布">
                <CloseOutlined />
              </Tooltip>
            </Popconfirm>
          </a>
        ),
        <a
          key="debug"
          onClick={() => {
            setVisible(true);
            setCurrent(record);
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.notice.option.debug',
              defaultMessage: '调试',
            })}
          >
            <BugOutlined />
          </Tooltip>
        </a>,
        record.state !== 1 && (
          <a key="delete">
            <Popconfirm
              title={intl.formatMessage({
                id: 'pages.data.option.remove.tips',
                defaultMessage: '确认删除？',
              })}
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
          </a>
        ),
      ],
    },
  ];

  const schema: ISchema = {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          maxColumns: 2,
          minColumns: 2,
        },
        properties: {
          id: {
            title: 'ID',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            required: true,
            'x-decorator-props': {
              gridSpan: 1,
            },
          },
          name: {
            title: '名称',
            required: true,
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 1,
            },
          },
          type: {
            title: '类型',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            required: true,
            enum: [
              { label: 'jar', value: 'jar' },
              { label: 'local', value: 'local' },
              { label: 'script', value: 'script' },
            ],
          },
          configuration: {
            type: 'object',
            properties: {
              provider: {
                title: '类名',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                'x-visible': false,
                'x-reactions': {
                  dependencies: ['..type'],
                  fulfill: {
                    state: {
                      visible: '{{["jar","local"].includes($deps[0])}}',
                    },
                  },
                },
              },
              '{url:location}': {
                title: '文件地址',
                'x-component': 'FUpload',
                'x-decorator': 'FormItem',
                'x-component-props': {
                  type: 'file',
                },
                'x-visible': false,
                'x-reactions': {
                  dependencies: ['..type'],
                  when: '{{$deps[0]==="script"}}',
                  fulfill: {
                    state: {
                      visible: false,
                    },
                  },
                  otherwise: {
                    state: {
                      visible: '{{["jar","local"].includes($deps[0])}}',
                      componentType: '{{$deps[0]==="jar"?"FUpload":"Input"}}',
                      componentProps: '{{$deps[0]==="jar"?{type:"file"}:{}}}',
                    },
                  },
                },
              },
              protocol: {
                title: '协议标识',
                'x-component': 'Input',
                'x-decorator': 'FormItem',
              },
              transport: {
                title: '链接协议',
                'x-component': 'Select',
                'x-decorator': 'FormItem',
                enum: [
                  { label: 'MQTT', value: 'MQTT' },
                  { label: 'UDP', value: 'UDP' },
                  { label: 'CoAP', value: 'CoAP' },
                  { label: 'TCP', value: 'TCP' },
                  { label: 'HTTP', value: 'HTTP' },
                  { label: 'HTTPS', value: 'HTTPS' },
                ],
              },
              script: {
                title: '脚本',
                'x-component': 'FMonacoEditor',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  labelCol: 2,
                  wrapperCol: 22,
                },
                default: `//解码,收到设备上行消息时
codec.decoder(function (context) {
  var message = context.getMessage();
  return {
    messageType:"REPORT_PROPERTY"//消息类型
  };
});

//编码读取设备属性消息
codec.encoder("READ_PROPERTY",function(context){
  var message = context.getMessage();
  var properties = message.properties;
})`,
                'x-component-props': {
                  height: 200,
                  theme: 'dark',
                  language: 'javascript',
                  editorDidMount: (editor1: any) => {
                    editor1.onDidContentSizeChange?.(() => {
                      editor1.getAction('editor.action.formatDocument').run();
                    });
                  },
                },
                'x-visible': false,
                'x-reactions': {
                  dependencies: ['..type'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0]==="script"}}',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  return (
    <PageContainer>
      <BaseCrud
        columns={columns}
        service={service}
        title={intl.formatMessage({
          id: 'pages.link.protocol',
          defaultMessage: '协议管理',
        })}
        modelConfig={{ width: '50vw' }}
        schema={schema}
        actionRef={actionRef}
      />
      {visible && <Debug data={current} close={() => setVisible(!visible)} />}
    </PageContainer>
  );
};

export default Protocol;
