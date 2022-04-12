import { Button, Modal } from 'antd';
import { useMemo } from 'react';
import { createForm } from '@formily/core';
import { createSchemaField, observer } from '@formily/react';
import { Form, FormItem, Input, Select } from '@formily/antd';
import { ISchema } from '@formily/json-schema';
import { service, state } from '@/pages/notice/Config';
import { useLocation } from 'umi';
import { useAsyncDataSource } from '@/utils/util';

const Debug = observer(() => {
  const location = useLocation<{ id: string }>();
  const id = (location as any).query?.id;

  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
        effects() {},
      }),
    [],
  );

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
    },
  });

  console.log(id, 'testt');

  const getTemplate = () => {
    return service.getTemplate(id).then((resp) => {
      return resp.result?.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    });
  };

  const schema: ISchema = {
    type: 'object',
    properties: {
      configId: {
        title: '通知模版',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-reactions': '{{useAsyncDataSource(getTemplate)}}',
      },
      bianliang: {
        title: '变量',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
      },
    },
  };
  return (
    <Modal
      title="调试"
      width="40vw"
      visible={state.debug}
      onCancel={() => (state.debug = false)}
      footer={
        <Button type="primary" onClick={() => (state.debug = false)}>
          关闭
        </Button>
      }
    >
      <Form form={form} layout={'vertical'}>
        <SchemaField schema={schema} scope={{ getTemplate, useAsyncDataSource }} />
      </Form>
    </Modal>
  );
});
export default Debug;
