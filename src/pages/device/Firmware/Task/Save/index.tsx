import { Modal } from 'antd';
import type { FirmwareItem } from '@/pages/device/Firmware/typings';
import { createSchemaField } from '@formily/react';
import { Form, FormGrid, FormItem, Input, Select, NumberPicker, Radio } from '@formily/antd';
import { createForm, onFieldValueChange, onFormInit } from '@formily/core';
import type { ISchema } from '@formily/json-schema';
import { service } from '@/pages/device/Firmware';
import { useEffect, useRef } from 'react';
import { onlyMessage } from '@/utils/util';
import FSelectDevices from '@/components/FSelectDevices';
import type { DeviceInstance } from '@/pages/device/Instance/typings';

interface Props {
  ids: { id: string; productId: string };
  data?: FirmwareItem;
  close: () => void;
  save: () => void;
  visible: boolean;
}

const Save = (props: Props) => {
  const { data, close, visible, ids } = props;

  const form = createForm({
    validateFirst: true,
    initialValues: data,
    effects() {
      onFormInit(async (form1) => {
        if (!data?.id) return;
        form1.setInitialValues({ ...data, upload: { url: data?.url } });
      });
      onFieldValueChange('mode', async (field) => {
        field
          .query('timeoutSeconds')
          .take()
          .setDecoratorProps({
            gridSpan: field.value === 'push' ? 1 : 2,
          });
        field
          .query('responseTimeoutSeconds')
          .take()
          .setDecoratorProps({
            gridSpan: field.value === 'push' ? 1 : 2,
          });
      });
      onFieldValueChange('releaseType', async (field) => {
        field.setDecoratorProps({
          gridSpan: field.value === 'all' ? 2 : 1,
        });
      });
    },
  });

  const devices = useRef<DeviceInstance[]>([]);

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      FormGrid,
      Input,
      Select,
      NumberPicker,
      Radio,
      FSelectDevices,
    },
  });

  useEffect(() => {
    if (visible) {
      service.queryDevice().then((resp) => {
        if (resp.status === 200) {
          devices.current = resp.result;
        }
      });
    }
  }, [visible]);

  const save = async () => {
    const values: any = await form.submit();
    if (values?.releaseType !== 'all') {
      values.deviceId = devices.current.map((item) => item.id);
    } else {
      values.deviceId = undefined;
    }
    const resp = await service.saveTask({
      ...values,
      firmwareId: ids?.id,
      productId: ids?.productId,
    });
    if (resp.status === 200) {
      onlyMessage('保存成功！');
    } else {
      onlyMessage('保存失败！', 'error');
    }
  };

  const schema: ISchema = {
    type: 'object',
    properties: {
      grid: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          minColumns: 2,
          maxColumns: 2,
        },
        properties: {
          name: {
            title: '任务名称',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入任务名称',
            },
            required: true,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-validator': [
              {
                required: true,
                message: '请输入任务名称',
              },
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
          },
          mode: {
            title: '推送方式',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            enum: [
              { label: '平台推送', value: 'push' },
              { label: '设备拉取', value: 'pull' },
            ],
            'x-component-props': {
              placeholder: '请选择推送方式',
            },
            'x-decorator-props': {
              gridSpan: 2,
            },
            required: true,
            'x-validator': [
              {
                required: true,
                message: '请选择推送方式',
              },
            ],
          },
          responseTimeoutSeconds: {
            title: '响应超时时间',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-component-props': {
              placeholder: '请输入响应超时时间(秒)',
            },
            'x-visible': false,
            required: true,
            'x-validator': [
              {
                required: true,
                message: '请输入响应超时时间',
              },
              {
                maximum: 99999,
                minimum: 1,
              },
            ],
            'x-reactions': {
              dependencies: ['.mode'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]==="push"}}',
                },
              },
            },
          },
          timeoutSeconds: {
            title: '升级超时时间',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-component-props': {
              placeholder: '请输入升级超时时间(秒)',
            },
            'x-visible': false,
            required: true,
            'x-validator': [
              {
                required: true,
                message: '请输入升级超时时间',
              },
              {
                maximum: 99999,
                minimum: 1,
              },
            ],
            'x-reactions': {
              dependencies: ['.mode'],
              fulfill: {
                state: {
                  visible: '{{!!$deps[0]}}',
                },
              },
            },
          },
          releaseType: {
            type: 'number',
            title: '升级设备',
            default: 'all',
            'x-visible': false,
            enum: [
              { label: '所有设备', value: 'all' },
              { label: '选择设备', value: 'part' },
            ],
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            required: true,
            'x-validator': [
              {
                required: true,
                message: '请选择升级设备',
              },
            ],
            'x-reactions': {
              dependencies: ['.mode'],
              fulfill: {
                state: {
                  visible: '{{!!$deps[0]}}',
                },
              },
            },
          },
          deviceId: {
            title: '选择设备',
            'x-decorator': 'FormItem',
            'x-component': 'FSelectDevices',
            'x-visible': false,
            required: true,
            'x-reactions': {
              dependencies: ['.releaseType'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]==="part"}}',
                },
              },
            },
            'x-validator': [
              {
                required: true,
                message: '请选择设备',
              },
            ],
          },
          description: {
            title: '说明',
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
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

  return (
    <Modal
      maskClosable={false}
      width="50vw"
      title={data?.id ? '编辑任务' : '新增任务'}
      onCancel={() => close()}
      onOk={() => save()}
      visible={visible}
    >
      <Form form={form} labelCol={5} wrapperCol={16} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};
export default Save;
