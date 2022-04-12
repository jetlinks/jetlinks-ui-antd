import { message, Modal } from 'antd';
import { useMemo } from 'react';
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
import { service, state } from '@/pages/notice/Config';
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
          onFieldValueChange('templateId', (field, form1) => {
            const value = field.value;
            // 找到模版详情；
            const list = Store.get('notice-template-list');

            const _template = list.find((item: any) => item.id === value);
            form1.setValuesIn('variableDefinitions', _template.variableDefinitions);
          });
          onFieldReact('variableDefinitions.*.type', (field) => {
            const value = (field as Field).value;
            const format = field.query('.value').take() as any;
            switch (value) {
              case 'date':
                format.setComponent(DatePicker);
                break;
              case 'string':
                format.setComponent(Input);
                break;
              case 'number':
                format.setComponent(NumberPicker);
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
          });
        },
      }),
    [state.debug],
  );

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      ArrayTable,
      PreviewText,
    },
  });

  const getTemplate = () =>
    service
      .getTemplate(state.current?.id || '', {
        terms: [
          { column: 'type', value: id },
          { column: 'provider', value: state.current?.provider },
        ],
      })
      .then((resp) => {
        Store.set('notice-template-list', resp.result);
        return resp.result?.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
      });

  const schema: ISchema = {
    type: 'object',
    properties: {
      templateId: {
        title: '通知模版',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-reactions': '{{useAsyncDataSource(getTemplate)}}',
      },
      variableDefinitions: {
        title: '变量',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'ArrayTable',
        'x-component-props': {
          pagination: { pageSize: 9999 },
          scroll: { x: '100%' },
        },
        items: {
          type: 'object',
          properties: {
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
              },
            },
          },
        },
      },
    },
  };

  const start = async () => {
    const data: { templateId: string; variableDefinitions: any } = await form.submit();
    // 应该取选择的配置信息
    if (!state.current) return;
    const templateId = data.templateId;
    const list = Store.get('notice-template-list');
    const _template = list.find((item: any) => item.id === templateId);

    const resp = await service.debug(state?.current.id, {
      template: _template,
      context: data.variableDefinitions?.reduce(
        (previousValue: any, currentValue: { id: any; value: any }) => {
          return {
            ...previousValue,
            [currentValue.id]: currentValue.value,
          };
        },
        {},
      ),
    });
    if (resp.status === 200) {
      message.success('操作成功!');
    }
  };
  return (
    <Modal
      title="调试"
      width="40vw"
      visible={state.debug}
      onCancel={() => (state.debug = false)}
      onOk={start}
    >
      <Form form={form} layout={'vertical'}>
        <SchemaField schema={schema} scope={{ getTemplate, useAsyncDataSource }} />
      </Form>
    </Modal>
  );
});
export default Debug;
