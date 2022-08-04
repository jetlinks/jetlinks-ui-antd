import { Modal, Spin } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createForm, Field, onFieldReact, onFieldValueChange } from '@formily/core';
import { createSchemaField, observer } from '@formily/react';
import {
  ArrayTable,
  Form,
  FormItem,
  Input,
  NumberPicker,
  PreviewText,
  Select,
} from '@formily/antd';
import { ISchema } from '@formily/json-schema';
import { configService, service, state } from '@/pages/notice/Template';
import { useLocation } from 'umi';
import { onlyMessage, useAsyncDataSource } from '@/utils/util';
import { Store } from 'jetlinks-store';
import { FDatePicker } from '@/components';
import FUpload from '@/components/Upload';

const Debug = observer(() => {
  const location = useLocation<{ id: string }>();
  const id = (location as any).query?.id;

  const variableRef = useRef<any>([]);

  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
        effects() {
          onFieldValueChange('configId', async (field, form1) => {
            const value = (field as Field).value;
            const configs = Store.get('notice-config');
            const target = configs.find((item: { id: any }) => item.id === value);
            // 从缓存中获取通知配置信息
            if (target && target.variableDefinitions) {
              form1.setValuesIn('variableDefinitions', target.variableDefinitions);
            }
          });

          onFieldReact('variableDefinitions.*.type', async (field) => {
            const value = (field as Field).value;
            const format = field.query('.value').take() as Field;
            const _id = field.query('.id').take() as Field;

            const configId = field.query('configId');

            if (format && value) {
              switch (value) {
                case 'date':
                  let dateFormat = 'YYYY-MM-DD HH:mm:ss';
                  if (variableRef.current) {
                    const a = variableRef.current?.find((i: any) => i.id === _id.value);
                    dateFormat = a?.format;
                  }
                  format.setComponent(FDatePicker, {
                    showTime: true,
                    format: dateFormat === 'timestamp' ? 'X' : dateFormat,
                  });
                  break;
                case 'string':
                  format.setComponent(Input);
                  break;
                case 'number':
                  format.setComponent(NumberPicker, {});
                  break;
                case 'file':
                  format.setComponent(FUpload, {
                    type: 'file',
                  });
                  break;
                case 'other':
                  format.setComponent(Input);
                  break;
              }
            }
            if (variableRef.current) {
              const a = variableRef.current?.find((i: any) => i.id === _id.value);
              const _configId = configId.value();
              const businessType = a?.expands?.businessType;
              if (id === 'dingTalk' || id === 'weixin') {
                if (_configId) {
                  switch (businessType) {
                    case 'org':
                      // 获取org
                      const orgList = await service[id].getDepartments(_configId);
                      format.setComponent(Select);
                      format.setDataSource(orgList);
                      break;
                    case 'user':
                      // 获取user
                      const userList = await service[id].getUser(_configId);
                      format.setComponent(Select);
                      format.setDataSource(userList);
                      break;
                    case 'tag':
                      // 获取user
                      const tagList = await service[id].getTags(_configId);
                      format.setComponent(Select);
                      format.setDataSource(tagList);
                      break;
                  }
                } else if (['tag', 'org', 'user'].includes(businessType)) {
                  format.setComponent(Select);
                  format.setDataSource([]);
                }
              }
            }
          });
        },
      }),
    [state.debug, state.current],
  );

  useEffect(() => {
    // const data = state.current;
    // 从后端接口来获取变量参数
    if (state.current?.id) {
      service.getVariableDefinitions(state.current?.id || '').then((resp) => {
        const _template = resp.result;
        if (_template?.variableDefinitions?.length > 0) {
          variableRef.current = _template?.variableDefinitions;
          form.setFieldState('variableDefinitions', (state1) => {
            state1.visible = true;
            state1.value = _template?.variableDefinitions;
          });
        }
      });
    }
  }, [state.current, state.debug]);

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      ArrayTable,
      PreviewText,
      NumberPicker,
      FDatePicker,
      FUpload,
    },
  });

  const getConfig = () =>
    configService
      .queryNoPagingPost({
        terms: [
          { column: 'type$IN', value: id },
          { column: 'provider', value: state.current?.provider },
        ],
      })
      .then((resp: any) => {
        // 缓存通知配置
        Store.set('notice-config', resp.result);
        return resp.result?.map((item: { name: any; id: any }) => ({
          label: item.name,
          value: item.id,
        }));
      });

  const schema: ISchema = {
    type: 'object',
    properties: {
      configId: {
        title: '通知配置',
        type: 'string',
        required: true,
        default: state?.current?.configId,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-reactions': '{{useAsyncDataSource(getConfig)}}',
      },
      variableDefinitions: {
        required: true,
        title: '变量',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'ArrayTable',
        'x-component-props': {
          pagination: { pageSize: 9999 },
          scroll: { x: '100%' },
        },
        'x-visible': false,
        items: {
          type: 'object',
          properties: {
            column0: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '类型', width: '120px' },
              'x-hidden': true,
              properties: {
                type: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'PreviewText.Input',
                  'x-disabled': true,
                },
              },
            },
            column1: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '变量', width: '120px' },
              properties: {
                id: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'PreviewText.Input',
                  'x-disabled': true,
                },
              },
            },
            column2: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '名称', width: '120px' },
              properties: {
                name: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'PreviewText.Input',
                  'x-disabled': true,
                },
              },
            },
            column3: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { title: '值', width: '120px' },
              properties: {
                value: {
                  required: true,
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
                type: {
                  'x-hidden': true,
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            },
          },
        },
      },
    },
  };

  const [spinning, setSpinning] = useState<boolean>(false);
  const start = async () => {
    setSpinning(true);
    // const data: { configId: string; variableDefinitions: any } = await form.submit();
    form
      .submit()
      .then(async (data: any) => {
        // 应该取选择的配置信息
        if (!state.current) return;
        const resp = await service.debug(
          data.configId,
          state?.current.id,
          data.variableDefinitions?.reduce(
            (previousValue: any, currentValue: { id: any; value: any }) => {
              return {
                ...previousValue,
                [currentValue.id]: currentValue.value,
              };
            },
            {},
          ),
        );
        if (resp.status === 200) {
          onlyMessage('操作成功!');
          setSpinning(false);
          state.debug = false;
        } else {
          setSpinning(false);
        }
      })
      .catch(() => {
        setSpinning(false);
      });
  };
  return (
    <Modal
      title="调试"
      width="40vw"
      destroyOnClose
      forceRender={true}
      visible={state.debug}
      onCancel={() => (state.debug = false)}
      onOk={start}
    >
      <Spin spinning={spinning}>
        <Form form={form} layout={'vertical'}>
          <SchemaField schema={schema} scope={{ getConfig, useAsyncDataSource }} />
        </Form>
      </Spin>
    </Modal>
  );
});
export default Debug;
