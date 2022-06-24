import { FormItem, FormLayout, Radio, Select } from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { Modal } from 'antd';
import 'antd/lib/tree-select/style/index.less';
import { useEffect, useState } from 'react';
import { service } from '@/pages/device/Instance';
import type { DeviceInstance } from '../typings';
import SystemConst from '@/utils/const';
import encodeQuery from '@/utils/encodeQuery';
import { downloadFile } from '@/utils/util';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface Props {
  visible: boolean;
  close: () => void;
  data?: DeviceInstance;
}

const Export = (props: Props) => {
  const { visible, close } = props;
  const [productList, setProductList] = useState<any[]>([]);
  const SchemaField = createSchemaField({
    components: {
      Radio,
      Select,
      FormItem,
      FormLayout,
    },
  });

  useEffect(() => {
    service.getProductList({ paging: false }).then((resp) => {
      if (resp.status === 200) {
        const list = resp.result.map((item: { name: any; id: any }) => ({
          label: item.name,
          value: item.id,
        }));
        setProductList(list);
      }
    });
  }, []);

  const form = createForm();

  const schema = {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          // labelCol: 4,
          // wrapperCol: 18,
          // labelAlign: 'right',
          layout: 'vertical',
        },
        properties: {
          product: {
            type: 'string',
            title: '产品',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: [...productList],
            'x-component-props': {
              allowClear: true,
              showSearch: true,
              showArrow: true,
              filterOption: (input: string, option: any) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
            },
          },
          fileType: {
            title: '文件格式',
            default: 'xlsx',
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            'x-component-props': {
              optionType: 'button',
              buttonStyle: 'solid',
            },
            enum: [
              {
                label: 'xlsx',
                value: 'xlsx',
              },
              {
                label: 'csv',
                value: 'csv',
              },
            ],
          },
        },
      },
    },
  };
  const downloadTemplate = async () => {
    const values = (await form.submit()) as any;
    const params = encodeQuery(props.data);
    if (values.product) {
      downloadFile(
        `/${SystemConst.API_BASE}/device/instance/${values.product}/export.${values.fileType}`,
        params,
      );
    } else {
      downloadFile(`/${SystemConst.API_BASE}/device/instance/export.${values.fileType}`, params);
    }
    close();
  };
  return (
    <Modal
      maskClosable={false}
      visible={visible}
      onCancel={() => close()}
      width="35vw"
      title="导出"
      onOk={downloadTemplate}
    >
      <div style={{ background: 'rgb(236, 237, 238)' }}>
        <p style={{ padding: 10 }}>
          <ExclamationCircleOutlined style={{ marginRight: 5 }} />
          选择单个产品时可导出其下属设备的详细数据,不选择产品时导出所有设备的基础数量。
        </p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <FormProvider form={form}>
          <SchemaField schema={schema} />
        </FormProvider>
      </div>
    </Modal>
  );
};
export default Export;
