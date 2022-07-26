import { FormItem, FormLayout, Select } from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { Badge, Button, Modal, Radio, Space, Upload } from 'antd';
import { useState } from 'react';
import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import { downloadFile, onlyMessage } from '@/utils/util';
import { UploadOutlined } from '@ant-design/icons';
import { EventSourcePolyfill } from 'event-source-polyfill';

interface Props {
  visible: boolean;
  close: () => void;
  data?: any;
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
          fileType: {
            title: '文件格式',
            // 'x-visible': false,
            'x-decorator': 'FormItem',
            'x-component': 'FileFormat',
          },
          upload: {
            type: 'string',
            title: '文件上传',
            // 'x-visible': false,
            'x-decorator': 'FormItem',
            'x-component': 'NormalUpload',
          },
        },
      },
    },
  };
  const SchemaField = createSchemaField({
    components: {
      Radio,
      Select,
      FormItem,
      FormLayout,
      FileFormat,
      NormalUpload,
    },
  });
  const form = createForm({
    // effects() {
    //     onFieldValueChange('product', (field) => {
    //         form.setFieldState('*(fileType, upload)', (state) => {
    //             state.visible = !!field.value;
    //         });
    //         form.setFieldState('*(upload)', (state) => {
    //             state.componentProps = {
    //                 product: field.value,
    //             };
    //         });
    //     });
    //     onFieldValueChange('fileType', (field) => {
    //         const product = form.getValuesIn('product') || '';
    //         form.setFieldState('*(upload)', (state) => {
    //             state.componentProps = {
    //                 fileType: field.value,
    //                 product,
    //             };
    //         });
    //     });
    //     onFieldValueChange('upload', (field) => {
    //         if (!field.value) {
    //             close();
    //         }
    //     });
    // },
  });
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
