import { Form, FormButtonGroup, FormItem, Input, Submit } from '@formily/antd';
import { createSchemaField } from '@formily/react';
import { Card, message, Spin } from 'antd';
import { createForm } from '@formily/core';
import { useEffect, useState } from 'react';
import { service } from '@/pages/system/Role';
import { useParams, history } from 'umi';

const Info = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [type, setType] = useState<'edit' | 'disabled'>('disabled');
  const [data, setData] = useState<RoleItem>();
  const params = useParams<{ id: string }>();
  const getDetail = async (id: string) => {
    const res = await service.detail(id);
    if (res.status === 200) {
      setData(res.result);
      setLoading(false);
    }
  };

  useEffect(() => {
    const { id } = params;
    if (id) {
      getDetail(id);
    } else {
      history.goBack();
    }
  }, [params, params.id]);

  const SchemaField = createSchemaField({
    components: {
      Input,
      FormItem,
    },
  });

  const form = createForm({
    validateFirst: true,
    initialValues: {
      id: data?.id,
      name: data?.name,
      description: data?.description,
    },
  });

  const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: '名称',
        required: true,
        'x-disabled': type === 'disabled',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      description: {
        type: 'string',
        title: '角色描述',
        required: false,
        'x-disabled': type === 'disabled',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
      },
    },
  };

  const save = async () => {
    const values: RoleItem = await form.submit();
    const resp = await service.modify(values.id, values);
    if (resp.status === 200) {
      message.success('操作成功！');
      getDetail(values.id);
      setType('disabled');
    }
  };

  return (
    <Card>
      <div style={{ width: '500px' }}>
        <Spin spinning={loading}>
          <Form form={form} labelCol={5} wrapperCol={16}>
            <SchemaField schema={schema} />
            <FormButtonGroup.FormItem>
              <Submit
                block
                size="large"
                onClick={() => {
                  if (type === 'edit') {
                    save();
                  } else {
                    setType('edit');
                  }
                }}
              >
                {type === 'disabled' ? '编辑' : '保存'}
              </Submit>
            </FormButtonGroup.FormItem>
          </Form>
        </Spin>
      </div>
    </Card>
  );
};

export default Info;
