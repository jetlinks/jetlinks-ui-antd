import { Button, Modal } from 'antd';
import { FormItem, Checkbox, NumberPicker, FormGrid, Form } from '@formily/antd';
import { createForm, registerValidateRules } from '@formily/core';
import { createSchemaField } from '@formily/react';
import RadioCard from '@/components/RadioCard';
import service from '@/pages/DataCollect/service';
import { onlyMessage } from '@/utils/util';

interface Props {
  data: any[];
  close: () => void;
  reload: () => void;
}

export default (props: Props) => {
  const SchemaField = createSchemaField({
    components: {
      Form,
      FormItem,
      Checkbox,
      FormGrid,
      RadioCard,
      NumberPicker,
    },
  });

  const form = createForm({
    initialValues: {},
  });

  registerValidateRules({
    checkLength(value) {
      if (!value) return '';
      if (String(value).length > 64) {
        return {
          type: 'error',
          message: '最多可输入64个字符',
        };
      }
      if (!(Number(value) % 1 === 0) || Number(value) <= 0) {
        return {
          type: 'error',
          message: '请输入正整数',
        };
      }
      return '';
    },
  });

  const schema = {
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
          accessModes: {
            title: '访问类型',
            type: 'array',
            'x-component': 'RadioCard',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component-props': {
              placeholder: '请选择访问类型',
              model: 'multiple',
              itemStyle: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                minWidth: '130px',
                height: '50px',
              },
              options: [
                { label: '读', value: 'read' },
                { label: '写', value: 'write' },
                { label: '订阅', value: 'subscribe' },
              ],
            },
            // 'x-validator': [
            //   {
            //     required: true,
            //     message: '请选择访问类型',
            //   },
            // ],
          },
          interval: {
            title: '采集频率',
            'x-component': 'NumberPicker',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
              tooltip: '采集频率为0时不执行轮询任务',
            },
            // 'x-reactions': {
            //   dependencies: ['..accessModes'],
            //   fulfill: {
            //     state: {
            //       visible: '{{($deps[0] || []).includes("subscribe")}}',
            //     },
            //   },
            // },
            'x-component-props': {
              placeholder: '请输入采集频率',
              addonAfter: '毫秒',
              stringMode: true,
              style: {
                width: '100%',
              },
            },
            'x-validator': [
              {
                min: 0,
                message: '请输入正整数',
              },
              {
                checkLength: true,
              },
            ],
          },
          features: {
            title: '',
            type: 'array',
            'x-component': 'Checkbox.Group',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 2,
            },
            // 'x-reactions': {
            //   dependencies: ['.accessModes'],
            //   fulfill: {
            //     state: {
            //       visible: '{{($deps[0] || []).includes("subscribe")}}',
            //     },
            //   },
            // },
            enum: [
              {
                label: '只推送变化的数据',
                value: 'changedOnly',
              },
            ],
          },
        },
      },
    },
  };

  return (
    <Modal
      title={'批量编辑'}
      maskClosable={false}
      visible
      onCancel={props.close}
      width={600}
      footer={[
        <Button key={1} onClick={props.close}>
          取消
        </Button>,
        <Button
          type="primary"
          key={2}
          onClick={async () => {
            const value = await form.submit<any>();
            const obj = {
              ...props.data[0],
              accessModes: value?.accessModes.map((item: any) => item?.value || item),
            };
            if (value?.accessModes && value?.accessModes?.length) {
              obj.accessModes = value.accessModes;
            }
            if (value?.features && value?.features?.length) {
              obj.features = value.features;
            }
            if (Number(value.interval) >= 0) {
              obj.configuration = {
                ...obj.configuration,
                interval: Number(value.interval),
              };
            }
            const arr = props.data.map((item) => {
              return {
                ...item,
                ...obj,
                pointKey: item?.pointKey || item?.configuration?.nodeId,
              };
            });
            const response = await service.savePointBatch(arr);
            if (response && response?.status === 200) {
              onlyMessage('操作成功');
              props.reload();
            }
          }}
        >
          确定
        </Button>,
      ]}
    >
      <div style={{ margin: '5px 0 20px 0' }}>
        将批量修改{(props?.data || []).length}条数据的访问类型、采集频率、只推送变化的数据
      </div>
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};
