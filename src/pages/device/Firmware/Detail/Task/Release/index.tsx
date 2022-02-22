import { message, Modal } from 'antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormItem, Select } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import FSelectDevices from '@/components/FSelectDevices';
import { service, state } from '@/pages/device/Firmware';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import { useIntl } from '@@/plugin-locale/localeExports';

interface Props {
  close: () => void;
  visible: boolean;
}

const Release = (props: Props) => {
  const intl = useIntl();
  const form = createForm({
    validateFirst: true,
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Select,
      FSelectDevices,
    },
  });

  const save = async () => {
    const values: { releaseType: 'all' | 'part'; part: DeviceInstance[] } = await form.submit();
    if (!(values.part?.length && values.part?.length <= 0)) {
      values.releaseType = 'all';
    }
    const resp = await service.deploy(
      state.taskItem!.id,
      values?.releaseType,
      values?.part?.map((i) => i.id),
    );
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

  const schema: ISchema = {
    type: 'object',
    properties: {
      releaseType: {
        title: '发布方式',
        'x-component': 'Select',
        'x-decorator': 'FormItem',
        default: 'all',
        enum: [
          {
            label: intl.formatMessage({
              id: 'pages.device.components.firmware.detail.task.release.allDevice',
              defaultMessage: '所有设备',
            }),
            value: 'all',
          },
          {
            label: intl.formatMessage({
              id: 'pages.device.components.firmware.detail.task.release.choiceDevice',
              defaultMessage: '选择设备',
            }),
            value: 'part',
          },
        ],
      },
      part: {
        title: intl.formatMessage({
          id: 'pages.device.components.firmware.detail.task.release.choiceDevice',
          defaultMessage: '选择设备',
        }),
        'x-decorator': 'FormItem',
        'x-component': 'FSelectDevices',
        'x-visible': false,
        'x-reactions': {
          dependencies: ['.releaseType'],
          fulfill: {
            state: {
              visible: '{{$deps[0]==="part"}}',
            },
          },
        },
      },
    },
  };
  return (
    <Modal
      title={intl.formatMessage({
        id: 'pages.device.components.firmware.detail.task.release.publishTask',
        defaultMessage: '发布任务',
      })}
      onOk={save}
      visible={props.visible}
      onCancel={() => {
        props.close();
      }}
    >
      <Form form={form}>
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};
export default Release;
