// Modal 弹窗，用于新增、修改数据
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormItem, FormTab, Input, Select, FormGrid } from '@formily/antd';
import { message, Modal } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ISchema } from '@formily/json-schema';
import { useEffect, useState } from 'react';
import { ProviderValue } from '../index';

interface SaveModalProps {
  visible: boolean;
  type?: string;
  model: 'edit' | 'add';
  deviceId: string;
  data?: any;
  onCancel?: () => void;
  onReload?: () => void;
  service: any;
}

const Save = (props: SaveModalProps) => {
  const { data, onCancel, service } = props;
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      FormTab,
      Input,
      Select,
      FormGrid,
    },
  });

  const form = createForm({
    validateFirst: true,
  });

  useEffect(() => {
    if (form && props.visible) {
      if (props.model === 'edit') {
        form.setValues({
          channelId: data.channelId,
          name: data.name,
          id: data.id,
          manufacturer: data.manufacturer,
          address: data.address,
          ptzType: data.ptzType ? data.ptzType.value : 0,
          description: data.description,
          media_url: data.other ? data.other['media_url'] : '',
        });
      } else {
        form.setValues({
          deviceId: props.deviceId,
        });
      }
    }
  }, [props.visible]);

  const schema: ISchema = {
    type: 'object',
    properties: {
      channelId: {
        type: 'string',
        title: '通道ID',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          disabled: props.model === 'edit',
        },
      },
      name: {
        type: 'string',
        title: '通道名称',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-validator': [
          {
            max: 64,
            message: '最多可输入64个字符',
          },
          {
            required: true,
            message: '请输入通道名称',
          },
        ],
      },
      manufacturer: {
        type: 'string',
        title: '厂商',
        'x-visible': props.type === ProviderValue.GB281,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-validator': [
          {
            max: 64,
            message: '最多可输入64个字符',
          },
        ],
        'x-decorator-props': {
          gridSpan: 24,
        },
      },
      'others.media_url': {
        type: 'string',
        title: '视频地址',
        'x-visible': props.type === ProviderValue.FIXED,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-validator': [
          {
            max: 128,
            message: '最多可输入128个字符',
          },
          {
            validator: (value: string) => {
              const reg = /(http|https|rtsp|rtmp):\/\/([\w.]+\/?)\S*/;
              return new Promise((resolve) => {
                if (!value) {
                  resolve('');
                  return;
                }
                if (reg.test(value)) {
                  resolve('');
                } else {
                  resolve('请输入正确的视频地址');
                }
              });
            },
          },
        ],
      },
      address: {
        type: 'string',
        title: '安装地址',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-validator': [
          {
            max: 64,
            message: '最多可输入64个字符',
          },
        ],
      },
      ptzType: {
        type: 'string',
        title: '云台类型',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-visible': props.type === ProviderValue.GB281,
        'x-validator': [
          {
            max: 64,
            message: '最多可输入64个字符',
          },
        ],
        enum: [
          { label: '未知', value: 0 },
          { label: '球体', value: 1 },
          { label: '半球体', value: 2 },
          { label: '固定枪机', value: 3 },
          { label: '遥控枪机', value: 4 },
        ],
      },
      description: {
        type: 'string',
        title: '说明',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-component-props': {
          rows: 4,
          maxLength: 200,
          showCount: true,
        },
      },
    },
  };

  const modalClose = () => {
    if (onCancel) {
      form.reset();
      onCancel();
    }
  };

  const saveData = async () => {
    const formData: any = await form.submit();
    if (formData) {
      const { media_url, ...extraFormData } = formData;
      if (media_url) {
        extraFormData.other = {
          media_url,
        };
      }
      setLoading(true);
      const resp =
        props.model === 'edit'
          ? await service.updateChannel(formData.id, formData)
          : await service.saveChannel(formData);
      setLoading(false);

      if (resp.status === 200) {
        message.success('操作成功');
        modalClose();
        if (props.onReload) {
          props.onReload();
        }
      } else {
        message.error('操作失败');
      }
    }
  };

  return (
    <Modal
      title={intl.formatMessage({
        id: `pages.data.option.${props.model}`,
        defaultMessage: '新增',
      })}
      maskClosable={false}
      visible={props.visible}
      width={550}
      onOk={saveData}
      onCancel={() => {
        modalClose();
      }}
      confirmLoading={loading}
    >
      <div>
        <Form form={form} layout={'vertical'}>
          <SchemaField schema={schema} />
        </Form>
      </div>
    </Modal>
  );
};

export default Save;
