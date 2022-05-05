import { message, Modal } from 'antd';
import { useEffect, useMemo } from 'react';
import { createForm, Field, onFieldReact, onFieldValueChange } from '@formily/core';
import { createSchemaField, observer } from '@formily/react';
import {
  ArrayTable,
  DatePicker,
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
import { useAsyncDataSource } from '@/utils/util';
import { Store } from 'jetlinks-store';
import FUpload from '@/components/Upload';

const Debug = observer(() => {
  const location = useLocation<{ id: string }>();
  const id = (location as any).query?.id;

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

          onFieldReact('variableDefinitions.*.type', (field) => {
            const value = (field as Field).value;
            const format = field.query('.value').take() as Field;
            if (format && value) {
              switch (value) {
                case 'date':
                  format.setComponent(DatePicker, {
                    showTime: true,
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
          });
        },
      }),
    [state.debug, state.current],
  );

  useEffect(() => {
    const data = state.current;
    if (data?.variableDefinitions?.length > 0) {
      form.setFieldState('variableDefinitions', (state1) => {
        state1.visible = true;
        state1.value = data?.variableDefinitions;
      });
    }
  }, [state.current]);

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      ArrayTable,
      PreviewText,
      NumberPicker,
      DatePicker,
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

  const start = async () => {
    const data: { configId: string; variableDefinitions: any } = await form.submit();
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
      message.success('操作成功!');
    }
  };
  return (
    <Modal
      title="调试"
      width="40vw"
      destroyOnClose
      visible={state.debug}
      onCancel={() => (state.debug = false)}
      onOk={start}
    >
      <Form form={form} layout={'vertical'}>
        <SchemaField schema={schema} scope={{ getConfig, useAsyncDataSource }} />
      </Form>
    </Modal>
  );
});
export default Debug;
