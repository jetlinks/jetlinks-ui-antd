import { FormItem, FormLayout, Select } from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { Badge, Button, Modal, Radio, Space, Upload } from 'antd';
import { useEffect, useState } from 'react';
import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import { downloadFile, onlyMessage } from '@/utils/util';
import { UploadOutlined } from '@ant-design/icons';
import { EventSourcePolyfill } from 'event-source-polyfill';

interface Props {
  close: () => void;
  masterId: any;
}
const FileFormat = (props: any) => {
  const [data, setData] = useState<{ fileType: 'xlsx' | 'csv' }>({
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
  const [errorUrl, setErrorUrl] = useState<string>('');
  const [fileName, setFileName] = useState<any>('');

  const submitData = async (fileUrl: string) => {
    setErrorUrl(fileUrl);
    if (!!fileUrl) {
      setCount(0);
      setErrMessage('');
      setFlag(true);
      setImportLoading(true);
      let dt = 0;
      const source = new EventSourcePolyfill(
        `/${SystemConst.API_BASE}/modbus/point/${
          props.masterId
        }/import?fileUrl=${fileUrl}&:X_Access_Token=${Token.get()}`,
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
              console.log(info.file);
              const name = info.file.name.split('.')?.[0];
              setFileName(name);
              console.log(name);
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
              const url = `/${SystemConst.API_BASE}/modbus/point/template.xlsx`;
              downloadFile(url);
            }}
          >
            .xlsx
          </a>
          <a
            style={{ marginLeft: 10 }}
            onClick={() => {
              const url = `/${SystemConst.API_BASE}/modbus/point/template.csv`;
              downloadFile(url);
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
          <div>
            {errMessage && (
              <>
                <Badge status="error" text="失败" />
                <span style={{ marginLeft: 15 }}>{errMessage}</span>
                <a
                  style={{ marginLeft: 15 }}
                  onClick={() => {
                    const parms = new XMLHttpRequest();
                    parms.open('GET', errorUrl, true);
                    parms.responseType = 'blob';
                    parms.onload = () => {
                      const url = window.URL.createObjectURL(parms.response);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${fileName}-${errMessage}`;
                      a.click();
                    };
                    parms.send();
                  }}
                >
                  下载
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
const Import = (props: Props) => {
  const { close, masterId } = props;

  useEffect(() => {
    console.log(masterId);
  }, []);

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
            'x-component-props': {
              masterId: masterId,
            },
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
  const form = createForm({});
  return (
    <Modal
      maskClosable={false}
      visible
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
