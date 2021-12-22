import { message, Modal } from 'antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormItem, Select } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import FSelectDevices from '@/components/FSelectDevices';
import { service, state } from '@/pages/device/Firmware';
import type { DeviceInstance } from '@/pages/device/Instance/typings';

interface Props {
  close: () => void;
  visible: boolean;
}

const Release = (props: Props) => {
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
      message.success('操作成功');
    } else {
      message.error('操作失败');
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
          { label: '所有设备', value: 'all' },
          { label: '选择设备', value: 'part' },
        ],
      },
      part: {
        title: '选择设备',
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
      title="发布任务"
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
