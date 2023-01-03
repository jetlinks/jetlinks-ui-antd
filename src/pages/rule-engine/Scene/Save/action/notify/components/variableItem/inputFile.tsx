import { useEffect, useState } from 'react';
import { Button, Input, message, Upload } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload/interface';
import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

interface InputUploadProps {
  value?: string;
  onChange?: (value?: string) => void;
  id?: string;
}

export default (props: InputUploadProps) => {
  const { onChange } = props;

  const [url, setUrl] = useState(props.value || undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setUrl(url);
  }, [props.value]);

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
    }
    if (info.file.status === 'done') {
      info.file.url = info.file.response?.result;
      setLoading(false);
      if (onChange) {
        const result = info.file.response?.result;
        setUrl(result);
        onChange(result);
      }
    }
  };

  const UploadNode = (
    <Upload
      action={`/${SystemConst.API_BASE}/file/static`}
      headers={{
        'X-Access-Token': Token.get(),
      }}
      accept={'image/jpeg,image/png'}
      showUploadList={false}
      onChange={handleChange}
      disabled={loading}
      beforeUpload={(file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('请上传正确格式图片');
        }
        const isSize = file.size / 1024 / 1024 < 4;
        if (!isSize) {
          message.error(`图片大小必须小于4M`);
        }
        return isJpgOrPng && isSize;
      }}
    >
      <Button type={'link'} style={{ height: 30 }}>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        上传附件
      </Button>
    </Upload>
  );

  return (
    <Input
      value={url}
      id={props.id}
      onChange={(e) => {
        if (onChange) {
          onChange(e.target.value);
        }
      }}
      addonAfter={UploadNode}
      placeholder={'请上传文件'}
    />
  );
};
