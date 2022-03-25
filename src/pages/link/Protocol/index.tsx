import { PageContainer } from '@ant-design/pro-layout';
import type { ProtocolItem } from '@/pages/link/Protocol/typings';
import { useEffect, useRef } from 'react';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import { Badge, Button, message, Popconfirm, Tooltip } from 'antd';
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, StopOutlined } from '@ant-design/icons';
import BaseCrud from '@/components/BaseCrud';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ISchema } from '@formily/json-schema';
import { CurdModel } from '@/components/BaseCrud/model';
import Service from '@/pages/link/Protocol/service';
import { onFormValuesChange, registerValidateRules } from '@formily/core';
import { Store } from 'jetlinks-store';
import { useLocation } from 'umi';
import SystemConst from '@/utils/const';

export const service = new Service('protocol');
const Protocol = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();

  const modifyState = async (id: string, type: 'deploy' | 'un-deploy') => {
    const resp = await service.modifyState(id, type);
    if (resp.status === 200) {
      message.success('插件发布成功!');
    } else {
      message.error('插件发布失败!');
    }
    actionRef.current?.reload();
  };

  const columns: ProColumns<ProtocolItem>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      sorter: true,
      ellipsis: true,
      defaultSortOrder: 'ascend',
    },
    {
      dataIndex: 'name',
      ellipsis: true,
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
    },
    {
      dataIndex: 'type',
      title: '类型',
      ellipsis: true,
    },
    {
      dataIndex: 'state',
      title: '状态',
      renderText: (text) => (
        <Badge color={text !== 1 ? 'red' : 'green'} text={text !== 1 ? '未发布' : '已发布'} />
      ),
    },
    {
      dataIndex: 'description',
      ellipsis: true,
      title: '说明',
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
            <Popconfirm title="确认发布？" onConfirm={() => modifyState(record.id, 'deploy')}>
              <Tooltip title="发布">
                <CheckCircleOutlined />
              </Tooltip>
            </Popconfirm>
          </a>
        ),
        record.state === 1 && (
          <a key="reload">
            <Popconfirm title="确认撤销？" onConfirm={() => modifyState(record.id, 'un-deploy')}>
              <Tooltip title="撤销">
                <StopOutlined />
              </Tooltip>
            </Popconfirm>
          </a>
        ),
        <Tooltip
          key="delete"
          title={
            record.state !== 1
              ? intl.formatMessage({
                  id: 'pages.data.option.remove',
                  defaultMessage: '删除',
                })
              : '请先禁用该组件，再删除。'
          }
        >
          <Button style={{ padding: 0 }} key="delete" type="link" disabled={record.state === 1}>
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
                <DeleteOutlined />
              </Tooltip>
            </Popconfirm>
          </Button>
        </Tooltip>,
      ],
    },
  ];

  registerValidateRules({
    validateId(value) {
      if (!value) return '';
      const reg = new RegExp('^[0-9a-zA-Z_\\\\-]+$');
      return reg.exec(value) ? '' : 'ID只能由数字、26个英文字母或者下划线组成';
    },
  });

  const schema: ISchema = {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          maxColumns: 1,
          minColumns: 1,
        },
        properties: {
          id: {
            title: 'ID',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 1,
            },
            'x-validator': [
              {
                required: true,
                message: '请输入ID',
              },
              {
                max: 64,
                message: '最多可输入64个字符',
              },
              {
                validateId: true,
                message: 'ID只能由数字、26个英文字母或者下划线组成',
              },
            ],
          },
          name: {
            title: '名称',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 1,
            },
            'x-validator': [
              {
                required: true,
                message: '请输入名称',
              },
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
          },
          type: {
            title: '类型',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              tooltip: <div>jar：上传协议jar包，文件格式支持.jar或.zip</div>,
            },
            'x-validator': [
              {
                required: true,
                message: '请选择类型',
              },
            ],
            enum: [
              { label: 'jar', value: 'jar' },
              { label: 'local', value: 'local' },
              // { label: 'script', value: 'script' },
            ],
          },
          configuration: {
            type: 'object',
            properties: {
              location: {
                title: '文件地址',
                'x-decorator': 'FormItem',
                'x-visible': false,
                'x-decorator-props': {
                  tooltip: (
                    <div>
                      local：填写本地协议编译目录绝对地址，如：d:/workspace/protocol/target/classes
                    </div>
                  ),
                },
                'x-validator': [
                  {
                    required: true,
                    message: '请输入文件地址',
                  },
                ],
                'x-reactions': {
                  dependencies: ['..type'],
                  fulfill: {
                    state: {
                      visible: '{{["jar","local"].includes($deps[0])}}',
                      componentType: '{{$deps[0]==="jar"?"FileUpload":"Input"}}',
                      componentProps: '{{$deps[0]==="jar"?{type:"file", accept: ".jar, .zip"}:{}}}',
                    },
                  },
                },
              },
              // provider: {
              //   title: '类名',
              //   'x-component': 'Input',
              //   'x-decorator': 'FormItem',
              //   'x-visible': false,
              //   'x-validator': [
              //     {
              //       required: true,
              //       message: '请选择类名',
              //     },
              //   ],
              //   'x-reactions': {
              //     dependencies: ['..type'],
              //     fulfill: {
              //       state: {
              //         visible: '{{["jar","local"].includes($deps[0])}}',
              //       },
              //     },
              //   },
              // },
            },
          },
          description: {
            title: '说明',
            'x-component': 'Input.TextArea',
            'x-decorator': 'FormItem',
            'x-component-props': {
              rows: 3,
              showCount: true,
              maxLength: 200,
            },
          },
        },
      },
    },
  };

  const location = useLocation();

  useEffect(() => {
    if ((location as any).query?.save === 'true') {
      CurdModel.add();
    }
    const subscription = Store.subscribe(SystemConst.BASE_UPDATE_DATA, (data) => {
      if ((window as any).onTabSaveSuccess) {
        (window as any).onTabSaveSuccess(data);
        setTimeout(() => window.close(), 300);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <PageContainer>
      <BaseCrud
        columns={columns}
        service={service}
        title={'插件管理'}
        search={false}
        modelConfig={{ width: '550px' }}
        schema={schema}
        actionRef={actionRef}
        formEffect={() => {
          onFormValuesChange((form) => {
            form.setFieldState('id', (state) => {
              state.disabled = CurdModel.model === 'edit';
            });
          });
        }}
        footer={
          <>
            <Button onClick={CurdModel.close}>取消</Button>
            <Button
              type="primary"
              onClick={() => {
                Store.set('save-data', true);
              }}
            >
              保存
            </Button>
            <Button
              type="primary"
              onClick={() => {
                Store.set('save-data', async (data: any) => {
                  // 获取到的保存的数据
                  if (data.id) {
                    await modifyState(data.id, 'deploy');
                  }
                });
              }}
            >
              保存并发布
            </Button>
          </>
        }
      />
      {/* {visible && <Debug data={current} close={() => setVisible(!visible)} />} */}
    </PageContainer>
  );
};

export default Protocol;
