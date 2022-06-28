// Modal 弹窗，用于新增、修改数据
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormGrid, FormItem, FormTab, Input, Select, Password } from '@formily/antd';
import { Modal } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import type { ISchema } from '@formily/json-schema';
import { useEffect, useState } from 'react';
import { ProviderValue } from '../index';
import { onlyMessage } from '@/utils/util';

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
      Password,
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
          media_url: data.others ? data.others['media_url'] : '',
          username: data.others ? data.others['media_username'] : '',
          password: data.others ? data.others['media_password'] : '',
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
      grid: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          maxColumns: 2,
          minColumns: 1,
          columnGap: 12,
        },
        properties: {
          channelId: {
            type: 'string',
            title: '通道ID',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              disabled: props.model === 'edit',
              placeholder: '请输入通道ID',
            },
            'x-decorator-props': {
              gridSpan: 1,
              tooltip: '若不填写，系统将自动生成唯一ID',
            },
          },
          name: {
            type: 'string',
            title: '通道名称',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入通道名称',
            },
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
            'x-decorator-props': {
              gridSpan: 1,
            },
          },
          manufacturer: {
            type: 'string',
            title: '厂商',
            'x-visible': props.type === ProviderValue.GB281,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入厂商名称',
            },
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
            'x-decorator-props': {
              gridSpan: 2,
            },
          },
          media_url: {
            type: 'string',
            title: '视频地址',
            required: true,
            'x-visible': props.type === ProviderValue.FIXED,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入视频地址',
            },
            'x-validator': [
              {
                required: true,
                message: '请输入视频地址',
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
            'x-decorator-props': {
              gridSpan: 2,
              tooltip: '不同厂家的RTSP固定地址规则不同，请按对应厂家的规则填写',
            },
          },
          username: {
            type: 'string',
            title: '用户名',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入用户名',
            },
            'x-decorator-props': {
              gridSpan: 1,
            },
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
          },
          password: {
            type: 'string',
            title: '密码',
            'x-decorator': 'FormItem',
            'x-component': 'Password',
            'x-component-props': {
              placeholder: '请输入密码',
              checkStrength: true,
            },
            'x-decorator-props': {
              gridSpan: 1,
            },
          },
          address: {
            type: 'string',
            title: '安装地址',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入安装地址',
            },
            'x-validator': [
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
            'x-decorator-props': {
              gridSpan: 2,
            },
          },
          ptzType: {
            type: 'string',
            title: '云台类型',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-visible': props.type === ProviderValue.GB281,
            'x-component-props': {
              placeholder: '请选择云台类型',
            },
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
            'x-decorator-props': {
              gridSpan: 2,
            },
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
            'x-decorator-props': {
              gridSpan: 2,
            },
          },
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
      const { media_url, password, username, ...extraFormData } = formData;
      if (media_url || password || username) {
        extraFormData.others = {
          media_url,
          media_password: password,
          media_username: username,
        };
      }
      setLoading(true);
      const resp =
        props.model === 'edit'
          ? await service.updateChannel(formData.id, extraFormData)
          : await service.saveChannel(extraFormData);
      setLoading(false);

      if (resp.status === 200) {
        onlyMessage('操作成功');
        modalClose();
        if (props.onReload) {
          props.onReload();
        }
      } else {
        onlyMessage('操作失败', 'error');
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
      width={650}
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
