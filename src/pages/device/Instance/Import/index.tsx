import { FormItem, FormLayout, Select } from '@formily/antd';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { Badge, Button, Checkbox, Modal, Radio, Space, Upload } from 'antd';
import 'antd/lib/tree-select/style/index.less';
import { useEffect, useState } from 'react';
import { service } from '@/pages/device/Instance';
import type { DeviceInstance } from '../typings';
import FUpload from '@/components/Upload';
import { UploadOutlined } from '@ant-design/icons';
import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { downloadFile, onlyMessage } from '@/utils/util';
import encodeQuery from '@/utils/encodeQuery';

interface Props {
  visible: boolean;
  close: () => void;
  data: Partial<DeviceInstance>;
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

const NormalUpload = (props: any) => {
  const [importLoading, setImportLoading] = useState(false);
  const [flag, setFlag] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0);
  const [errMessage, setErrMessage] = useState<string>('');

  const submitData = async (fileUrl: string) => {
    if (!!fileUrl) {
      setCount(0);
      setErrMessage('');
      setFlag(true);
      const autoDeploy = !!props?.fileType?.autoDeploy || false;
      setImportLoading(true);
      let dt = 0;
      const source = new EventSourcePolyfill(
        `/${SystemConst.API_BASE}/device/instance/${
          props.product
        }/import?fileUrl=${fileUrl}&autoDeploy=${autoDeploy}&:X_Access_Token=${Token.get()}`,
      );
      source.onmessage = (e: any) => {
        const res = JSON.parse(e.data);
        if (res.success) {
          props.onChange(false);
          const temp = res.result.total;
          dt += temp;
          setCount(dt);
        } else {
          setErrMessage(res.message || '失败');
        }
      };
      source.onerror = () => {
        setFlag(false);
        source.close();
      };
      source.onopen = () => {};
    } else {
      onlyMessage('请先上传文件', 'error');
    }
  };
  return (
    <div>
      <Space>
        <Upload
          action={`/${SystemConst.API_BASE}/file/static`}
          accept={'.xlsx, .csv'}
          headers={{
            'X-Access-Token': Token.get(),
          }}
          onChange={async (info) => {
            if (info.file.status === 'done') {
              const resp: any = info.file.response || { result: '' };
              await submitData(resp?.result || '');
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
              const url = `/${SystemConst.API_BASE}/device-instance/${props.product}/template.xlsx`;
              downloadFile(url);
              // downloadTemplate('xlsx', props.product);
            }}
          >
            .xlsx
          </a>
          <a
            style={{ marginLeft: 10 }}
            onClick={() => {
              const url = `/${SystemConst.API_BASE}/device-instance/${props.product}/template.csv`;
              downloadFile(url);
              // downloadTemplate('csv', props.product);
            }}
          >
            .csv
          </a>
        </div>
      </Space>
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
    </div>
  );
};

const Import = (props: Props) => {
  const { visible, close } = props;
  const [productList, setProductList] = useState<any[]>([]);

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
    service.getProductList(encodeQuery({ paging: false, terms: { state: 1 } })).then((resp) => {
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
        form.setFieldState('*(upload)', (state) => {
          state.componentProps = {
            product: field.value,
          };
        });
      });
      onFieldValueChange('fileType', (field) => {
        const product = form.getValuesIn('product') || '';
        form.setFieldState('*(upload)', (state) => {
          state.componentProps = {
            fileType: field.value,
            product,
          };
        });
      });
      onFieldValueChange('upload', (field) => {
        if (!field.value) {
          close();
        }
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
          // labelCol: 6,
          // wrapperCol: 18,
          // labelAlign: 'right',
          layout: 'vertical',
        },
        properties: {
          product: {
            type: 'string',
            title: '产品',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: [...productList],
            'x-component-props': {
              showSearch: true,
              allowClear: true,
              showArrow: true,
              filterOption: (input: string, option: any) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
            },
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

  return (
    <Modal
      maskClosable={false}
      visible={visible}
      onCancel={() => close()}
      width="35vw"
      title="导入"
      onOk={() => close()}
      footer={[
        <Button key="cancel" onClick={() => close()}>
          取消
        </Button>,
        <Button key="ok" type="primary" onClick={() => close()}>
          确认
        </Button>,
      ]}
    >
      <div style={{ marginTop: '10px' }}>
        <FormProvider form={form}>
          <SchemaField schema={schema} />
        </FormProvider>
      </div>
    </Modal>
  );
};
export default Import;
