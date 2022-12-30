import { Modal } from 'antd';
import { FormItem, Input, Form } from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import service from '../../../../service';
import { onlyMessage } from '@/utils/util';

interface Props {
  data: Partial<PointItem>;
  onCancel: () => void;
}

const WritePoint = (props: Props) => {
  const { data } = props;

  const SchemaField = createSchemaField({
    components: {
      Input,
      FormItem,
      Form,
    },
  });

  const form = createForm();
  const schema = {
    type: 'object',
    properties: {
      propertyValue: {
        type: 'string',
        title: data?.name || '自定义属性',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入',
        },
      },
    },
  };

  const handleSetPropertyValue = async (propertyValue: string) => {
    if (data?.collectorId && data?.id) {
      const resp = await service.writePoint(data.collectorId, [
        {
          pointId: data.id,
          value: propertyValue,
        },
      ]);
      if (resp.status === 200) {
        onlyMessage('操作成功');
      }
      props.onCancel();
    }
  };
  return (
    <Modal
      maskClosable={false}
      title="编辑"
      visible
      onOk={async () => {
        const values: any = await form.submit();
        if (!!values) {
          handleSetPropertyValue(values?.propertyValue);
        }
      }}
      onCancel={() => {
        props.onCancel();
      }}
    >
      <div style={{ marginTop: '30px' }}>
        <Form form={form} layout="vertical">
          <SchemaField schema={schema} />
        </Form>
      </div>
    </Modal>
  );
};

export default WritePoint;
