import PermissionButton from '@/components/PermissionButton';
import { DisconnectOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { FormItem, ArrayTable, Editable, Select, NumberPicker } from '@formily/antd';
import { createForm } from '@formily/core';
import { FormProvider, createSchemaField } from '@formily/react';
import { Badge, Button, Tooltip } from 'antd';
import { useState } from 'react';
import MapTree from '../mapTree';
import './index.less';

interface Props {
  metaData: Record<string, string>[];
  deviceId: string;
}

const MapTable = (props: Props) => {
  const { metaData, deviceId } = props;

  const [visible, setVisible] = useState<boolean>(false);

  const Render = (propsName: any) => {
    const text = metaData.find((item: any) => item.metadataId === propsName.value);
    return <>{text?.metadataName}</>;
  };
  const StatusRender = (propsRender: any) => {
    if (propsRender.value) {
      return <Badge status="success" text={'已绑定'} />;
    } else {
      return <Badge status="error" text={'未绑定'} />;
    }
  };
  const ActionButton = () => {
    const record = ArrayTable.useRecord?.();
    const index = ArrayTable.useIndex?.();
    return (
      <PermissionButton
        isPermission={true}
        style={{ padding: 0 }}
        disabled={!record(index)?.id}
        tooltip={{
          title: '解绑',
        }}
        popConfirm={{
          title: '确认解绑',
          disabled: !record(index)?.id,
          onConfirm: async () => {
            console.log(deviceId);
            // deteleMaster(item.id)
            // remove([record(index)?.id]);
          },
        }}
        key="unbind"
        type="link"
      >
        <DisconnectOutlined />
      </PermissionButton>
    );
  };
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Editable,
      ArrayTable,
      Select,
      NumberPicker,
      Render,
      ActionButton,
      StatusRender,
    },
  });
  const form = createForm({
    values: {
      requestList: metaData,
    },
  });

  const schema = {
    type: 'object',
    properties: {
      requestList: {
        type: 'array',
        'x-decorator': 'FormItem',
        'x-component': 'ArrayTable',
        'x-component-props': {
          pagination: {
            pageSize: 10,
          },
          scroll: { x: '100%' },
        },
        items: {
          type: 'object',
          properties: {
            column1: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { width: 200, title: '名称' },
              properties: {
                metadataId: {
                  type: 'string',
                  'x-component': 'Render',
                },
              },
            },
            column2: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { width: 200, title: '通道' },
              properties: {
                collectorId: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: '请选择',
                    showSearch: true,
                    allowClear: true,
                    showArrow: true,
                    filterOption: (input: string, option: any) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
                  },
                  // enum: masterList,
                },
              },
            },
            column3: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                width: 200,
                title: (
                  <>
                    采集器
                    <Tooltip title="边缘网关代理的真实物理设备">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </>
                ),
              },
              properties: {
                collectors: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: '请选择',
                    showSearch: true,
                    allowClear: true,
                    showArrow: true,
                    filterOption: (input: string, option: any) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
                  },
                  // 'x-reactions': ['{{useAsyncDataSource(getName)}}'],
                },
              },
            },
            column4: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { width: 200, title: '点位' },
              properties: {
                pointId: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: '请选择',
                    showSearch: true,
                    allowClear: true,
                    showArrow: true,
                    filterOption: (input: string, option: any) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
                  },
                  // 'x-reactions': ['{{useAsyncDataSource(getName)}}'],
                },
              },
            },
            column6: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                width: 100,
                title: '状态',
                // sorter: (a: any, b: any) => a.state.value.length - b.state.value.length,
              },
              properties: {
                id: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'StatusRender',
                },
              },
            },
            column7: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                title: '操作',
                dataIndex: 'operations',
                width: 50,
                fixed: 'right',
              },
              properties: {
                item: {
                  type: 'void',
                  'x-component': 'FormItem',
                  properties: {
                    remove: {
                      type: 'void',
                      'x-component': 'ActionButton',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  return (
    <div>
      <div className="top-button">
        <Button
          style={{ marginRight: 10 }}
          onClick={() => {
            setVisible(true);
          }}
        >
          批量映射
        </Button>
        <Button type="primary">保存</Button>
      </div>
      <div>
        <FormProvider form={form}>
          <SchemaField schema={schema} scope={{}} />
        </FormProvider>
      </div>
      {visible && (
        <MapTree
          close={() => {
            setVisible(false);
          }}
          deviceId={deviceId}
        />
      )}
    </div>
  );
};
export default MapTable;
