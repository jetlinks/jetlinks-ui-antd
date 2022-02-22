import { message, Modal } from 'antd';
import { service, state } from '../../..';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormItem, Input, NumberPicker, Select } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import { useIntl } from '@@/plugin-locale/localeExports';

interface Props {
  visible: boolean;
  close: () => void;
}

const Save = (props: Props) => {
  const intl = useIntl();
  const form = createForm({
    validateFirst: true,
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      NumberPicker,
    },
  });

  const schema: ISchema = {
    type: 'object',
    properties: {
      name: {
        title: intl.formatMessage({
          id: 'pages.device.components.firmware.detail.task.save.name',
          defaultMessage: '名称',
        }),
        'x-component': 'Input',
        'x-decorator': 'FormItem',
      },
      timeoutSeconds: {
        title: intl.formatMessage({
          id: 'pages.device.components.firmware.detail.task.save.TimeoutTime',
          defaultMessage: '超时时间',
        }),
        'x-component': 'NumberPicker',
        'x-decorator': 'FormItem',
      },
      mode: {
        title: intl.formatMessage({
          id: 'pages.device.components.firmware.detail.task.save.pushWay',
          defaultMessage: '推送方式',
        }),
        'x-component': 'Select',
        'x-decorator': 'FormItem',
        enum: [
          {
            label: intl.formatMessage({
              id: 'pages.device.components.firmware.detail.task.save.platformPush',
              defaultMessage: '平台推送',
            }),
            value: 'push',
          },
          {
            label: intl.formatMessage({
              id: 'pages.device.components.firmware.detail.task.save.devicePull',
              defaultMessage: '设备拉取',
            }),
            value: 'pull',
          },
        ],
      },
      description: {
        title: intl.formatMessage({
          id: 'pages.device.components.firmware.detail.task.save.name',
          defaultMessage: '名称',
        }),
        'x-component': 'Input.TextArea',
        'x-decorator': 'FormItem',
      },
    },
  };

  const save = async () => {
    const values: Record<string, unknown> = await form.submit();
    // 判断current 没有数据应该回退上一页
    values.productId = state.current?.productId;
    values.firmwareId = state.current?.id;
    const resp = await service.saveTask(values);
    if (resp.status === 200) {
      message.success(
        intl.formatMessage({
          id: 'pages.data.option.success',
          defaultMessage: '操作成功！',
        }),
      );
    } else {
      message.error(
        intl.formatMessage({
          id: 'pages.data.option.error',
          defaultMessage: '操作失败',
        }),
      );
    }
    props.close();
  };
  return (
    <Modal
      onOk={save}
      width="40vw"
      visible={props.visible}
      onCancel={() => props.close()}
      title={intl.formatMessage({
        id: 'pages.device.components.firmware.detail.task.save.createTask',
        defaultMessage: '新建任务',
      })}
    >
      <Form form={form} labelCol={5} wrapperCol={16}>
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};
export default Save;
