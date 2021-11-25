import { Button, Drawer, message } from 'antd';
import type { Field } from '@formily/core';
import { createForm, onFieldValueChange } from '@formily/core';
import { TreeSelect, Form, FormItem, FormLayout, Input, Radio, Select } from '@formily/antd';
import { createSchemaField } from '@formily/react';
import type { ISchema } from '@formily/json-schema';
import FUploadImage from '@/components/Upload';
import { service } from '@/pages/device/Product';
import { action } from '@formily/reactive';
import 'antd/lib/tree-select/style/index.less';
import type { ProductItem } from '@/pages/device/Product/typings';

interface Props {
  visible: boolean;
  close: () => void;
  data?: ProductItem;
}

/**
 * 处理品类数据
 * @param tree
 */
const treeToArray = (tree: any) => {
  const arr: any[] = [];
  const expanded = (datas: any[]) => {
    if (datas && datas.length > 0) {
      datas.forEach((e) => {
        arr.push(e);
        expanded(e.children);
      });
    }
  };
  expanded(tree);
  return arr;
};

const Save = (props: Props) => {
  const { visible, close, data } = props;
  const handleData = () => {
    // 特殊处理deviceType字段
    console.log(data, '处理钱');
    if (data) {
      if (typeof data.deviceType !== 'string') {
        data.deviceType = data.deviceType?.value;
      }
    }

    console.log(data, '初始化数据');
    return data;
  };
  const form = createForm({
    initialValues: handleData(),
    effects() {
      onFieldValueChange('messageProtocol', (field, f) => {
        const protocol = (field as Field).value;
        f.setFieldState('transportProtocol', async (state) => {
          state.loading = true;
          const resp = await service.getTransport(protocol);
          state.dataSource = resp.result.map((item: { name: string; id: string }) => ({
            label: item.name,
            value: item.id,
          }));
          state.loading = false;
        });
      });
    },
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      Radio,
      FUploadImage,
      FormLayout,
      TreeSelect,
    },
  });
  const serviceMap = new Map<string, Promise<any>>();
  serviceMap.set('classifiedId', service.category());
  serviceMap.set('protocol', service.getProtocol());
  serviceMap.set('storePolicy', service.getStorage());
  serviceMap.set('org', service.getOrg());

  let classifiedList: any[] = [];
  const useAsyncDataSource = (type: string) => (field: Field) => {
    field.loading = true;
    serviceMap.get(type)!.then(
      action.bound!((resp) => {
        if (type === 'classifiedId') {
          // 处理key错误
          field.dataSource = resp.result.map((item: Record<string, unknown>) => ({
            ...item,
            key: item.id,
          }));
          // 考虑冗余分类字段
          classifiedList = resp.result;
        } else {
          field.dataSource = resp.result.map((item: { name: any; id: any }) => ({
            label: item.name,
            value: item.id,
          }));
        }
        field.loading = false;
      }),
    );
  };

  const handleSave = async () => {
    const values = (await form.submit()) as any;
    // 冗余classifiedName 字段;
    // 如果只存储string。 可考虑字段解构方式处理
    // 可能存在数据反显问题，此处考虑与后台协商处理
    const classifiedId = values.classifiedId;
    if (classifiedId) {
      const tempClassifiedList = treeToArray(classifiedList);
      const classified = tempClassifiedList.find((i) => i.id === classifiedId);
      // values.classifiedId = classifiedId[classifiedId.length - 1];
      values.classfiedName = classified.name;
    }
    const resp = (await service.update(values)) as any;
    if (resp.status === 200) {
      message.success('保存成功');
      props.close();
    }
  };
  const schema: ISchema = {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          labelCol: 4,
          wrapperCol: 18,
        },
        properties: {
          photoUrl: {
            title: '图标',
            'x-component': 'FUploadImage',
            'x-decorator': 'FormItem',
          },
          id: {
            title: 'ID',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
          },
          name: {
            title: '名称',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
          },
          classifiedId: {
            title: '所属品类',
            'x-component': 'TreeSelect',
            'x-decorator': 'FormItem',
            'x-component-props': {
              fieldNames: { label: 'name', value: 'id', children: 'children', key: 'id' },
            },
            'x-reactions': ['{{useAsyncDataSource("classifiedId")}}'],
          },
          orgId: {
            title: '所属机构',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            'x-reactions': ['{{useAsyncDataSource("org")}}'],
          },
          messageProtocol: {
            title: '消息协议',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            'x-reactions': ['{{useAsyncDataSource("protocol")}}'],
          },
          transportProtocol: {
            title: '传输协议',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
          },
          storePolicy: {
            title: '存储策略',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            'x-reactions': ['{{useAsyncDataSource("storePolicy")}}'],
          },
          deviceType: {
            title: '设备类型',
            'x-component': 'Radio.Group',
            'x-decorator': 'FormItem',
            enum: [
              { label: '直连设备', value: 'device' },
              { label: '网关子设备', value: 'childrenDevice' },
              { label: '网关设备', value: 'gateway' },
            ],
          },
          describe: {
            title: '描述',
            'x-component': 'Input.TextArea',
            'x-decorator': 'FormItem',
          },
        },
      },
    },
  };
  return (
    <Drawer
      visible={visible}
      onClose={() => close()}
      width="25vw"
      title="新增产品"
      extra={
        <Button type="primary" onClick={handleSave}>
          保存数据
        </Button>
      }
    >
      <Form form={form} size="small">
        <SchemaField schema={schema} scope={{ useAsyncDataSource }} />
      </Form>
    </Drawer>
  );
};
export default Save;
