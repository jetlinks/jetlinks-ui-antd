import { FormItem, Select, FormLayout } from '@formily/antd';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { Modal, Radio, Checkbox, Space, Upload, Button, Badge, message } from 'antd';
import 'antd/lib/tree-select/style/index.less';
import { useEffect, useState } from 'react';
import { service } from '@/pages/device/Instance';
import type { DeviceInstance } from '../typings';
import FUpload from '@/components/Upload';
import { UploadOutlined } from '@ant-design/icons';
import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import { EventSourcePolyfill } from 'event-source-polyfill';

interface Props {
  visible: boolean;
  close: () => void;
  data?: DeviceInstance;
}

const FileFormat = (props: any) => {
  const [data, setData] = useState<{ autoDeploy: boolean; fileType: 'xlsx' | 'csv' }>({
    autoDeploy: false,
    fileType: 'xlsx',
  });
  return (
    <Space>
      <Radio.Group
        defaultValue="xlsx"
        buttonStyle="solid"
        onChange={(e) => {
          setData({
            ...data,
            fileType: e.target.value,
          });
          props.onChange({
            ...data,
            fileType: e.target.value,
          });
        }}
      >
        <Radio.Button value="xlsx">xlsx</Radio.Button>
        <Radio.Button value="csv">csv</Radio.Button>
      </Radio.Group>
      <Checkbox
        onChange={(e) => {
          setData({
            ...data,
            autoDeploy: e.target.checked,
          });
          props.onChange({
            ...data,
            autoDeploy: e.target.checked,
          });
        }}
      >
        自动启用
      </Checkbox>
    </Space>
  );
};

const downloadTemplate = (type: string, product: string) => {
  const formElement = document.createElement('form');
  formElement.style.display = 'display:none;';
  formElement.method = 'GET';
  formElement.action = `/${SystemConst.API_BASE}/device-instance/${product}/template.${type}`;
  const inputElement = document.createElement('input');
  inputElement.type = 'hidden';
  inputElement.name = ':X_Access_Token';
  inputElement.value = Token.get();
  formElement.appendChild(inputElement);
  document.body.appendChild(formElement);
  formElement.submit();
  document.body.removeChild(formElement);
};

const NormalUpload = (props: any) => {
  return (
    <div>
      <Space>
        <Upload
          action={`/${SystemConst.API_BASE}/file/static`}
          headers={{
            'X-Access-Token': Token.get(),
          }}
          onChange={(info) => {
            if (info.file.status === 'done') {
              message.success('上传成功');
              const resp: any = info.file.response || { result: '' };
              props.onChange(resp?.result || '');
            }
          }}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>上传文件</Button>
        </Upload>
        <div style={{ marginLeft: 20 }}>
          下载模板
          <a
            style={{ marginLeft: 10 }}
            onClick={() => {
              downloadTemplate('xlsx', props.product);
            }}
          >
            .xlsx
          </a>
          <a
            style={{ marginLeft: 10 }}
            onClick={() => {
              downloadTemplate('csv', props.product);
            }}
          >
            .csv
          </a>
        </div>
      </Space>
    </div>
  );
};

const Import = (props: Props) => {
  const { visible, close } = props;
  const [productList, setProductList] = useState<any[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [flag, setFlag] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0);
  const [errMessage, setErrMessage] = useState<string>('');

  const SchemaField = createSchemaField({
    components: {
      Radio,
      Select,
      FormItem,
      FormLayout,
      FUpload,
      FileFormat,
      NormalUpload,
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

  const form = createForm({
    effects() {
      onFieldValueChange('product', (field) => {
        form.setFieldState('*(fileType, upload)', (state) => {
          state.visible = !!field.value;
        });
        form.setFieldState('*(fileType)', (state) => {
          state.componentProps = {
            product: field.value,
          };
        });
      });
    },
  });

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
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: [...productList],
          },
          fileType: {
            title: '文件格式',
            'x-visible': false,
            'x-decorator': 'FormItem',
            'x-component': 'FileFormat',
          },
          upload: {
            type: 'string',
            title: '文件上传',
            'x-visible': false,
            'x-decorator': 'FormItem',
            'x-component': 'NormalUpload',
          },
        },
      },
    },
  };

  const submitData = () => {
    const values = form.getFormState().values;
    if (!!values?.upload) {
      setCount(0);
      setErrMessage('');
      setFlag(true);
      const autoDeploy = !!values?.fileType?.autoDeploy || false;
      setImportLoading(true);
      let dt = 0;
      const source = new EventSourcePolyfill(
        `/${SystemConst.API_BASE}/device/instance/${values.product}/import?fileUrl=${
          values?.upload
        }&autoDeploy=${autoDeploy}&:X_Access_Token=${Token.get()}`,
      );
      source.onmessage = (e: any) => {
        const res = JSON.parse(e.data);
        if (res.success) {
          close();
          const temp = res.result.total;
          dt += temp;
          setCount(dt);
        } else {
          setErrMessage(res.message);
        }
      };
      source.onerror = () => {
        setFlag(false);
        source.close();
      };
      source.onopen = () => {};
    } else {
      message.error('请先上传文件');
    }
  };
  return (
    <Modal
      visible={visible}
      onCancel={() => close()}
      width="35vw"
      title="导出"
      onOk={() => submitData()}
      footer={[
        <Button key="cancel" onClick={() => close()}>
          取消
        </Button>,
        <Button key="ok" type="primary" onClick={() => submitData()}>
          确认
        </Button>,
      ]}
    >
      <div style={{ marginTop: '20px' }}>
        <FormProvider form={form}>
          <SchemaField schema={schema} />
        </FormProvider>
      </div>
      {importLoading && (
        <div style={{ marginLeft: 20 }}>
          {flag ? (
            <Badge status="processing" text="进行中" />
          ) : (
            <Badge status="success" text="已完成" />
          )}
          <span style={{ marginLeft: 15 }}>总数量:{count}</span>
          <p style={{ color: 'red' }}>{errMessage}</p>
        </div>
      )}
    </Modal>
  );
};
export default Import;
