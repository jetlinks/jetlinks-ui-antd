import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormGrid, FormItem, Input, NumberPicker, Select } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import { service } from '@/pages/link/Channel/Modbus';
import { Modal } from '@/components';
import { useEffect } from 'react';
import { onlyMessage } from '@/utils/util';
// import { onlyMessage } from '@/utils/util';

interface Props {
  data: any;
  close: () => void;
  device?: any;
}

const SaveChannel = (props: Props) => {
  const form = createForm({
    validateFirst: true,
    initialValues: props.data,
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      FormGrid,
      NumberPicker,
    },
  });

  const schema: ISchema = {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-decorator': 'FormGrid',
        'x-decorator-props': {
          maxColumns: 2,
          minColumns: 2,
          columnGap: 24,
        },
        properties: {
          name: {
            title: '名称',
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请输入名称',
            },
            name: 'name',
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
              {
                required: true,
                message: '请输入名称',
              },
            ],
          },
          host: {
            title: 'IP',
            'x-decorator-props': {
              gridSpan: 2,
            },
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入IP',
            },
            'x-validator': ['ipv4'],
            name: 'host',
            required: true,
          },
          port: {
            title: '端口',
            'x-decorator-props': {
              gridSpan: 2,
            },
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-component-props': {
              placeholder: '请输入端口',
            },
            default: 502,
            'x-validator': [
              {
                min: 1,
                max: 65535,
                message: '请输入1～65535之间的正整数',
              },
            ],
            name: 'host',
            required: true,
          },
          description: {
            title: '说明',
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
            'x-component-props': {
              rows: 5,
              placeholder: '请输入说明',
            },
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-validator': [
              {
                max: 200,
                message: '最多可输入200个字符',
              },
            ],
          },
        },
      },
    },
  };

  const save = async () => {
    const value = await form.submit<any>();
    if (props.data.id) {
      console.log(value);
      const res = await service.editMaster(props.data.id, value);
      if (res.status === 200) {
        onlyMessage('保存成功');
        props.close();
      }
    } else {
      const res = await service.saveMaster(value);
      if (res.status === 200) {
        onlyMessage('保存成功');
        props.close();
      }
    }
  };

  useEffect(() => {
    console.log(props.data.id);
  }, []);
  return (
    <Modal
      title={props.data.id ? '编辑通道' : '新增通道'}
      maskClosable={false}
      visible
      onCancel={props.close}
      onOk={save}
      width="35vw"
      permissionCode={'link/Channel/Modbus'}
      permission={['add', 'edit']}
    >
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};
export default SaveChannel;
