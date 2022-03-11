import { FormItem, Select, FormLayout } from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { Alert, Modal, Radio } from 'antd';
import 'antd/lib/tree-select/style/index.less';
import { useEffect, useState } from 'react';
import { service } from '@/pages/device/Instance';
import type { DeviceInstance } from '../typings';
import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import encodeQuery from '@/utils/encodeQuery';

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
        console.log(list);
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
          labelCol: 4,
          wrapperCol: 18,
          labelAlign: 'right',
        },
        properties: {
          product: {
            type: 'string',
            title: '产品',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: [...productList],
          },
          fileType: {
            type: 'number',
            title: '文件格式',
            default: 'xlsx',
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
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            'x-component-props': {
              optionType: 'button',
              buttonStyle: 'solid',
            },
          },
        },
      },
    },
  };
  const downloadTemplate = async () => {
    const values = (await form.submit()) as any;
    const formElement = document.createElement('form');
    formElement.style.display = 'display:none;';
    formElement.method = 'GET';
    if (values.product) {
      formElement.action = `/${SystemConst.API_BASE}/device/instance/${values.product}/export.${values.fileType}`;
    } else {
      formElement.action = `/${SystemConst.API_BASE}/device/instance/export.${values.fileType}`;
    }
    const params = encodeQuery(props.data);
    Object.keys(params).forEach((key: string) => {
      const inputElement = document.createElement('input');
      inputElement.type = 'hidden';
      inputElement.name = key;
      inputElement.value = params[key];
      formElement.appendChild(inputElement);
    });
    const inputElement = document.createElement('input');
    inputElement.type = 'hidden';
    inputElement.name = ':X_Access_Token';
    inputElement.value = Token.get();
    formElement.appendChild(inputElement);

    document.body.appendChild(formElement);
    formElement.submit();
    document.body.removeChild(formElement);
  };
  return (
    <Modal
      visible={visible}
      onCancel={() => close()}
      width="35vw"
      title="导出"
      onOk={() => {
        downloadTemplate();
      }}
    >
      <Alert
        message="不勾选产品，默认导出所有设备的基础数据，勾选单个产品可导出下属的详细数据"
        type="warning"
        showIcon
        closable
      />
      <div style={{ marginTop: '20px' }}>
        <FormProvider form={form}>
          <SchemaField schema={schema} />
        </FormProvider>
      </div>
    </Modal>
  );
};
export default Export;
