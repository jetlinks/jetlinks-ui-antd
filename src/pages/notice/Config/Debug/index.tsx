import { Button, Modal } from 'antd';
import { useMemo } from 'react';
import { createForm } from '@formily/core';
import { createSchemaField, observer } from '@formily/react';
import { Form, FormItem, Input, Select } from '@formily/antd';
import { ISchema } from '@formily/json-schema';
import { state } from '@/pages/notice/Template';
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

  const getTemplate = () => {};
  // const getConfig = () =>
  //   configService
  //     .queryNoPagingPost({
  //       terms: [{column: 'type$IN', value: id}],
  //     })
  //     .then((resp: any) => {
  //       return resp.result?.map((item) => ({
  //         label: item.name,
  //         value: item.id,
  //       }));
  //     });

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
