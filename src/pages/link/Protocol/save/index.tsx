import { Button, Modal } from 'antd';
import { createForm, registerValidateRules } from '@formily/core';
import { createSchemaField } from '@formily/react';
import React, { useEffect, useState } from 'react';
import * as ICONS from '@ant-design/icons';
import { Form, FormGrid, FormItem, Input, Select } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import { service } from '@/pages/link/Protocol';
import FileUpload from '../FileUpload';
import type { ProtocolItem } from '@/pages/link/Protocol/typings';
import { PermissionButton, RadioCard } from '@/components';
import { onlyMessage } from '@/utils/util';

interface Props {
  data: ProtocolItem | undefined;
  close: () => void;
  reload: () => void;
}

const Save = (props: Props) => {
  const [data, setData] = useState<ProtocolItem | undefined>(props.data);
  const { permission } = PermissionButton.usePermission('link/Protocol');
  // const [count, setCount] = useState<number>(0);

  useEffect(() => {
    setData(props.data);
    // if (props.data?.id) {
    //   service
    //     .productCount({
    //       terms: [
    //         {
    //           terms: [
    //             {
    //               column: 'message_protocol',
    //               value: props.data.id,
    //             },
    //           ],
    //         },
    //       ],
    //     })
    //     .then((resp) => {
    //       if (resp.status === 200) {
    //         setCount(resp.result);
    //       }
    //     });
    // }
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
      RadioCard,
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
          maxColumns: 2,
          minColumns: 2,
          columnGap: 24,
        },
        properties: {
          // id: {
          //   title: 'ID',
          //   'x-component': 'Input',
          //   'x-decorator': 'FormItem',
          //   'x-disabled': !!props.data?.id,
          //   'x-decorator-props': {
          //     gridSpan: 2,
          //   },
          //   'x-validator': [
          //     {
          //       required: true,
          //       message: '请输入ID',
          //     },
          //     {
          //       max: 64,
          //       message: '最多可输入64个字符',
          //     },
          //     {
          //       validateId: true,
          //       message: 'ID只能由数字、26个英文字母或者下划线组成',
          //     },
          //     {
          //       triggerType: 'onBlur',
          //       validator: (value: string) => {
          //         if (!value) return;
          //         return new Promise((resolve) => {
          //           service
          //             .validator(value)
          //             .then((resp) => {
          //               if (!!resp?.result) {
          //                 resolve('ID已存在');
          //               } else {
          //                 resolve('');
          //               }
          //             })
          //             .catch(() => '验证失败!');
          //         });
          //       },
          //     },
          //   ],
          //   'x-component-props': {
          //     placeholder: '请输入ID',
          //   },
          // },
          name: {
            title: '名称',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
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
            'x-component': 'RadioCard',
            'x-decorator': 'FormItem',
            'x-disabled': !!props.data?.id,
            'x-decorator-props': {
              gridSpan: 2,
            },
            default: 'jar',
            'x-component-props': {
              model: 'singular',
              itemStyle: {
                width: '50%',
              },
              options: [
                {
                  label: 'Jar',
                  value: 'jar',
                  imgUrl: require('/public/images/jar.png'),
                },
                {
                  label: 'Local',
                  value: 'local',
                  imgUrl: require('/public/images/local.png'),
                },
              ],
            },
            'x-validator': [
              {
                required: true,
                message: '请选择类型',
              },
            ],
            // enum: [
            //   { label: 'jar', value: 'jar' },
            //   { label: 'local', value: 'local' },
            //   // { label: 'script', value: 'script' },
            // ],
          },
          configuration: {
            type: 'object',
            properties: {
              location: {
                title: '文件地址',
                'x-decorator': 'FormItem',
                'x-visible': false,
                'x-decorator-props': {
                  gridSpan: 2,
                },
                // 'x-disabled': !!count,
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
                      decoratorProps:
                        '{{$deps[0]!=="jar"?{gridSpan:"2",tooltip:"local:填写本地协议编译目录绝对地址,如:d:/protocol/target/classes"}:{gridSpan:"2",tooltip:"jar:上传协议jar包,文件格式支持.jar或.zip"}}}',
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
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              rows: 3,
              showCount: true,
              maxLength: 200,
              placeholder: '请输入说明',
            },
          },
        },
      },
    },
  };

  const save = async () => {
    const value = await form.submit<ProtocolItem>();
    const response: any = await service.savePatch({ ...props.data, ...value });
    if (response && response?.status === 200) {
      onlyMessage('操作成功');
      props.reload();
      if ((window as any).onTabSaveSuccess) {
        (window as any).onTabSaveSuccess(response);
        setTimeout(() => window.close(), 300);
      }
    }
  };

  return (
    <Modal
      title={props?.data?.id ? '编辑' : '新增'}
      maskClosable={false}
      visible
      onCancel={props.close}
      width={700}
      footer={[
        <Button key={1} onClick={props.close}>
          取消
        </Button>,
        <Button
          type="primary"
          key={2}
          onClick={() => {
            save();
          }}
          disabled={props.data?.id ? !permission.update : !permission.add}
        >
          确定
        </Button>,
        // <Button
        //   key={3}
        //   type="primary"
        //   onClick={() => {
        //     save(true);
        //   }}
        //   disabled={
        //     props.data?.id
        //       ? !permission.update && !permission.action
        //       : !permission.add && !permission.action
        //   }
        // >
        //   保存并发布
        // </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};
export default Save;
