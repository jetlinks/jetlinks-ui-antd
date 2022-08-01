import React, { useEffect, useState } from 'react';
import { FormComponentProps } from 'antd/lib/form';
import Form from 'antd/es/form';
import { Badge, Button, message, Modal, Radio, Select, Spin, Upload } from 'antd';
import { UploadProps } from 'antd/lib/upload';
import { getAccessToken } from '@/utils/authority';
import apis from '@/services';

interface Props extends FormComponentProps {
  configure: any;
  close: Function;
  reload: Function;
}

interface State {
  fileType: string;
  fileInfo: any;
  configId: string;
}

const Import: React.FC<Props> = props => {
  const initState: State = {
    fileType: '.xlsx',
    fileInfo: {},
    configId: '',
  };
  const [uploading, setUploading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [fileType, setFileType] = useState(initState.fileType);
  const [flag, setFlag] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0);
  const [errMessage, setErrMessage] = useState<string>('');
  const [configId, setConfigId] = useState(initState.configId);

  useEffect(() => {}, []);

  const submitData = (fileUrl: string) => {
    if (fileUrl) {
      setImportLoading(true);
      let dt = 0;
      apis.flowCard._import(configId, { fileUrl })
        .then((res: any) => {
          if (res.status === 200) {
            const temp = res.result.total;
            dt += temp;
            setCount(dt);
            setFlag(false);
          } else {
            setErrMessage(res.message);
          }
        })
        .catch(() => {});
    } else {
      message.error("请先上传文件");
    }
  };

  const uploadProps: UploadProps = {
    accept: fileType === ".xlsx" ? ".xlsx, .xls" : fileType,
    action: '/jetlinks/file/static',
    headers: {
      'X-Access-Token': getAccessToken(),
    },
    showUploadList: false,
    onChange(info) {
      setCount(0);
      setErrMessage('');
      setFlag(true);
      setImportLoading(false);
      setUploading(true);
      if (info.file.status === 'done') {
        setUploading(false);
        // message.success('文件上传成功');
        submitData(info.file.response.result);
      }
    },
  };

  const downloadTemplate = (type: string) => {
    const formElement = document.createElement('form');
    formElement.style.display = 'display:none;';
    formElement.method = 'GET';
    formElement.action = `/jetlinks/network/card/template.${type}`;
    const inputElement = document.createElement('input');
    inputElement.type = 'hidden';
    inputElement.name = ':X_Access_Token';
    inputElement.value = getAccessToken();
    formElement.appendChild(inputElement);
    document.body.appendChild(formElement);
    formElement.submit();
    document.body.removeChild(formElement);
  };

  return (
    <Modal
      title='批量导入物联卡'
      visible
      okText=""
      cancelText="取消"
      onOk={() => {
        props.close();
        props.reload();
      }}
      onCancel={() => {
        props.close();
      }}
    >
      <Spin spinning={uploading} tip="上传中...">
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Form.Item key="platformConfigId" label="平台配置">
            <Select placeholder="请选择平台配置"
              onChange={(value: string) => {
                setConfigId(value);
              }}>
              {props.configure?.map(i => (
                <Select.Option key={i.id} value={i.id}>{i.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          {(configId) && (
            <div>
              <Form.Item label="文件格式">
                <Radio.Group onChange={e => {
                  setFileType(e.target.value);
                }} defaultValue=".xlsx">
                  <Radio.Button value=".xlsx">xlsx</Radio.Button>
                  <Radio.Button value=".csv">csv</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="文件上传">
                <Upload {...uploadProps}>
                  <Button icon="upload">上传文件</Button>
                </Upload>
                <span style={{ marginLeft: 10 }}>
                  下载模版
                  <a style={{ marginLeft: 10 }} onClick={() => downloadTemplate('xlsx')}>.xlsx</a>
                  <a style={{ marginLeft: 10 }} onClick={() => downloadTemplate('csv')}>.csv</a>
                </span>
                <br />
                {importLoading && (
                  <div>
                    {flag ? (
                      <Badge status="processing" text="进行中" />
                    ) : (
                      <Badge status="success" text="已完成" />
                    )}
                    <span style={{ marginLeft: 15 }}>总数量:{count}</span>
                    <p style={{ color: 'red' }}>{errMessage}</p>
                  </div>
                )}
              </Form.Item>
            </div>
          )}
        </Form>
      </Spin>
    </Modal>
  );
};

export default Form.create<Props>()(Import);
