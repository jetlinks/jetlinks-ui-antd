import { Button, Drawer, message } from 'antd';
import type { Field } from '@formily/core';
import { createForm } from '@formily/core';
import {
  ArrayCollapse,
  ArrayItems,
  Editable,
  Form,
  FormItem,
  FormLayout,
  FormTab,
  Input,
  NumberPicker,
  Radio,
  Select,
  Space,
  Switch,
} from '@formily/antd';
import { createSchemaField } from '@formily/react';
import type { ISchema } from '@formily/json-schema';
import { useIntl } from '@@/plugin-locale/localeExports';

import './index.less';
import FAutoComplete from '@/components/FAutoComplete';
import { action } from '@formily/reactive';
import { productModel } from '@/pages/device/Product';
import FSelectDevice from '@/components/FSelectDevice';
import Trigger from '@/components/AlarmEditor/Trigger';
import Action from '@/components/AlarmEditor/Action';
import { service } from '@/pages/device/components/Alarm';
import { useParams } from 'umi';

interface Props {
  visible: boolean;
  close: () => void;
  data: any;
  type: 'product' | 'device';
}

const EditAlarm = (props: Props) => {
  const { visible, close, type } = props;

  const params = useParams<{ id: string }>();
  const intl = useIntl();
  const form = createForm({
    initialValues: props.data?.alarmRule,
    effects() {
      Trigger.effects();
      Action.effects();
    },
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      NumberPicker,
      Radio,
      Editable,
      ArrayItems,
      ArrayCollapse,
      Space,
      FormLayout,
      FormTab,
      FAutoComplete,
      FSelectDevice,
      Switch,
    },
  });

  const formTab = FormTab.createFormTab!();

  const loadNotifierType = async (field: Field) => {
    const ac = field.query('...executor').get('value');
    if (!ac) return [];
    return service.notifier.types();
  };

  const useAsyncDataSource = (ser: (arg0: any) => Promise<any>) => (field: Field) => {
    field.loading = true;
    ser(field).then(
      action.bound?.((data) => {
        field.dataSource = (data.result || []).map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
        field.loading = false;
      }),
    );
  };

  const schema: ISchema = {
    type: 'object',
    properties: {
      collapse: {
        type: 'void',
        'x-component': 'FormTab',
        'x-component-props': {
          formTab: '{{formTab}}',
          tabPosition: 'right',
        },
        properties: {
          tab1: {
            type: 'void',
            'x-component': 'FormTab.TabPane',
            'x-component-props': {
              tab: '触发条件',
            },
            properties: Trigger.schema,
          },
          tab2: {
            type: 'void',
            'x-component': 'FormTab.TabPane',
            'x-component-props': {
              tab: '转换配置',
            },
            properties: {
              properties: {
                // title: '转换',
                type: 'array',
                'x-component': 'ArrayItems',
                'x-decorator': 'FormItem',
                items: {
                  type: 'object',
                  properties: {
                    space: {
                      type: 'void',
                      'x-component': 'Space',
                      properties: {
                        sort: {
                          type: 'void',
                          'x-decorator': 'FormItem',
                          'x-component': 'ArrayItems.SortHandle',
                        },
                        property: {
                          type: 'string',
                          // title: '属性',
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                          'x-component-props': {
                            placeholder: '属性',
                          },
                        },
                        alias: {
                          type: 'string',
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                          'x-component-props': {
                            placeholder: '别名',
                          },
                        },
                        remove: {
                          type: 'void',
                          'x-decorator': 'FormItem',
                          'x-component': 'ArrayItems.Remove',
                        },
                        moveUp: {
                          type: 'void',
                          'x-decorator': 'FormItem',
                          'x-component': 'ArrayItems.MoveUp',
                        },
                        moveDown: {
                          type: 'void',
                          'x-decorator': 'FormItem',
                          'x-component': 'ArrayItems.MoveDown',
                        },
                      },
                    },
                  },
                },
                properties: {
                  add: {
                    type: 'void',
                    title: '添加条目',
                    'x-component': 'ArrayItems.Addition',
                  },
                },
              },
            },
          },
          tab3: {
            type: 'void',
            'x-component': 'FormTab.TabPane',
            'x-component-props': {
              tab: '执行动作',
            },
            properties: Action.schema,
          },
        },
      },
      name: {
        title: intl.formatMessage({
          id: 'pages.table.name',
          defaultMessage: '名称',
        }),
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-index': 1,
      },
      shakeLimit: {
        'x-index': 2,
        type: 'object',
        properties: {
          enabled: {
            type: 'boolean',
            'x-component': 'Switch',
            'x-decorator': 'FormItem',
            'x-component-props': {
              checkedChildren: '防抖',
              unCheckedChildren: '防抖',
            },
          },
          config: {
            type: 'void',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              asterisk: true,
              feedbackLayout: 'none',
            },
            'x-visible': false,
            'x-component': 'Space',
            'x-reactions': {
              dependencies: ['.enabled'],
              fulfill: {
                state: {
                  visible: '{{$deps[0]}}',
                },
              },
            },
            properties: {
              time: {
                type: 'number',
                'x-component': 'NumberPicker',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  addonAfter: '秒内发生',
                },
                required: true,
              },
              threshold: {
                type: 'number',
                'x-component': 'NumberPicker',
                'x-decorator': 'FormItem',

                'x-decorator-props': {
                  addonAfter: '次及以上时,处理',
                },
              },
              alarmFirst: {
                type: 'boolean',
                'x-component': 'Radio.Group',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  style: {
                    width: '200px',
                  },
                },
                'x-component-props': {
                  buttonStyle: 'solid',
                  optionType: 'button',
                  size: 'small',
                },
                enum: [
                  {
                    label: '第一次',
                    value: true,
                  },
                  {
                    label: '最后一次',
                    value: false,
                  },
                ],
              },
            },
          },
        },
      },
      description: {
        title: '说明',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-component-props': {
          rows: 5,
        },
      },
    },
  };

  const handleSubmit = async () => {
    const alarmRule = (await form.submit()) as any;
    const id = params?.id;
    if (id) {
      const data = {
        name: alarmRule?.name,
        target: type,
        targetId: id,
        id: props.data.id,
        alarmRule: {
          ...alarmRule,
          productId: productModel.current?.id,
          productName: productModel.current?.name,
        },
      };
      await service.saveAlarm(type, id, data);
      message.success('保存成功');
      props.close();
    }
  };
  return (
    <Drawer
      title="编辑告警"
      visible={visible}
      onClose={() => close()}
      width="40vw"
      extra={
        <Button type="primary" onClick={handleSubmit}>
          保存数据
        </Button>
      }
    >
      <Form form={form} layout="vertical" size="small">
        <SchemaField schema={schema} scope={{ formTab, useAsyncDataSource, loadNotifierType }} />
      </Form>
    </Drawer>
  );
};
export default EditAlarm;
