import { Button, message } from 'antd';
import { createForm, registerValidateRules } from '@formily/core';
import { createSchemaField } from '@formily/react';
import React, { useEffect, useState } from 'react';
import * as ICONS from '@ant-design/icons';
import { Form, FormGrid, FormItem, Input, Select } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import { service } from '@/pages/link/Protocol';
import { Modal } from '@/components';
import FileUpload from '../FileUpload';
import type { ProtocolItem } from '@/pages/link/Protocol/typings';

interface Props {
  data: ProtocolItem | undefined;
  close: () => void;
  reload: () => void;
}

const Save = (props: Props) => {
  const [data, setData] = useState<ProtocolItem | undefined>(props.data);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const form = createForm({
    validateFirst: true,
    initialValues: data || {},
  });

  registerValidateRules({
    validateId(value) {
      if (!value) return '';
      const reg = new RegExp('^[0-9a-zA-Z_\\\\-]+$');
      return reg.exec(value) ? '' : 'ID只能由数字、26个英文字母或者下划线组成';
    },
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      FileUpload,
      FormGrid,
    },
    scope: {
      icon(name: any) {
        return React.createElement(ICONS[name]);
      },
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
            'x-disabled': !!props.data?.id,
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
              {
                triggerType: 'onBlur',
                validator: (value: string) => {
                  if (!value) return;
                  return new Promise((resolve) => {
                    service
                      .validator(value)
                      .then((resp) => {
                        if (!!resp?.result) {
                          resolve('ID已存在');
                        } else {
                          resolve('');
                        }
                      })
                      .catch(() => '验证失败!');
                  });
                },
              },
            ],
            'x-component-props': {
              placeholder: '请输入ID',
            },
          },
          name: {
            title: '名称',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 1,
            },
            'x-component-props': {
              placeholder: '请输入名称',
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
            'x-disabled': !!props.data?.id,
            'x-decorator-props': {
              tooltip: <div>jar：上传协议jar包，文件格式支持.jar或.zip</div>,
            },
            'x-component-props': {
              placeholder: '请选择类型',
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
                      componentProps:
                        '{{$deps[0]==="jar"?{type:"file", accept: ".jar, .zip"}:{placeholder: "请输入文件地址"}}}',
                    },
                  },
                },
              },
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

  const save = async (deploy: boolean) => {
    const value = await form.submit<ProtocolItem>();
    let response = undefined;
    if (props.data?.id) {
      response = await service.save(value);
    } else {
      response = await service.update(value);
    }
    if (response && response.status === 200) {
      message.success('操作成功');
      if (deploy) {
        await service.modifyState(value.id, 'deploy');
      }
      props.reload();
    }
  };

  return (
    <Modal
      title={props?.data?.id ? '编辑' : '新增'}
      maskClosable={false}
      visible
      onCancel={props.close}
      width={700}
      permissionCode={'link/Protocol'}
      permission={['add', 'edit']}
      footer={
        <>
          <Button onClick={props.close}>取消</Button>
          <Button
            type="primary"
            onClick={() => {
              save(false);
            }}
          >
            保存
          </Button>
          <Button
            type="primary"
            onClick={() => {
              save(true);
            }}
          >
            保存并发布
          </Button>
        </>
      }
    >
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};
export default Save;
