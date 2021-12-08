import { Card } from 'antd';
import { Submit, FormButtonGroup, Form, FormItem, Input, Select } from '@formily/antd';
import { createSchemaField } from '@formily/react';
import type { Field } from '@formily/core';
import { createForm, onFieldValueChange } from '@formily/core';
import type { ISchema } from '@formily/json-schema';
import FMonacoEditor from '@/components/FMonacoEditor';
import { InstanceModel, service } from '@/pages/device/Instance';
import type { FunctionMetadata } from '@/pages/device/Product/typings';

const Functions = () => {
  const functionList = JSON.parse(InstanceModel.detail.metadata || '{}')
    .functions as FunctionMetadata[];
  const form = createForm({
    initialValues: {},
    effects() {
      onFieldValueChange('function', (field, f) => {
        const funcId = (field as Field).value;
        const params = functionList
          .find((i) => i.id === funcId)
          ?.inputs?.reduce((previousValue, currentValue) => {
            let tip = '';
            const type = currentValue.valueType?.type;
            if (type === 'enum') {
              tip = `(${currentValue.valueType.elements
                .map((e: any) => e.text + e.value)
                .join(';')})`;
            } else if (type === 'date') {
              tip = `(${currentValue.valueType.format})`;
            }
            previousValue[`${currentValue.id}`] = `${currentValue.name}${tip}`;
            return previousValue;
          }, {});
        f.setFieldState('params', async (state) => {
          state.loading = true;
          state.value = JSON.stringify(params);
          state.loading = false;
        });
      });
    },
  });
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      FMonacoEditor,
    },
  });

  const schema: ISchema = {
    type: 'object',
    properties: {
      function: {
        title: '功能列表',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: functionList.map((item: any) => ({
          label: item.name,
          value: item.id,
        })),
      },
      params: {
        title: '参数',
        'x-decorator': 'FormItem',
        'x-component': 'FMonacoEditor',
        'x-component-props': {
          height: 200,
          theme: 'dark',
          language: 'json',
          editorDidMount: (editor1: any) => {
            editor1.onDidContentSizeChange?.(() => {
              editor1.getAction('editor.action.formatDocument').run();
            });
          },
        },
      },
      result: {
        title: '结果',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
      },
    },
  };

  const invokeFunction = async () => {
    const values: any = await form.submit();

    const id = InstanceModel.detail?.id;
    if (!values || !id) {
      return;
    }
    const response = await service.invokeFunction(id, values?.function, JSON.parse(values?.params));
    form.setFieldState('result', (state) => {
      state.value = response.result;
    });
  };
  return (
    <Card title="功能调试">
      <Form form={form} layout={'vertical'}>
        <SchemaField schema={schema} />
        <FormButtonGroup>
          <Submit onSubmit={invokeFunction}>提交</Submit>
        </FormButtonGroup>
      </Form>
    </Card>
  );
};
export default Functions;
