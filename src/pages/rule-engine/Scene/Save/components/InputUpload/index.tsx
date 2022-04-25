import { useEffect, useState } from 'react';
import { Upload, Input, Button } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload/interface';
import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

interface InputUploadProps {
  value?: string;
  onChange?: (value?: string) => void;
}

export default (props: InputUploadProps) => {
  const { onChange } = props;

  const [url, setUrl] = useState('');
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
      setUrl(info.file.response?.result);
    }
  };

  // const beforeUpload = (file: RcFile) => {
  //   const isType = imageTypes.includes(file.type);
  //   if (!isType) {
  //     message.error(`图片格式错误，必须是${imageTypes.toString()}格式`);
  //     return false;
  //   }
  //   const isSize = file.size / 1024 / 1024 < (extraProps.size || 4);
  //   if (!isSize) {
  //     message.error(`图片大小必须小于${extraProps.size || 4}M`);
  //   }
  //   return isType && isSize;
  // };

  const UploadNode = (
    <Upload
      action={`/${SystemConst.API_BASE}/file/static`}
      headers={{
        'X-Access-Token': Token.get(),
      }}
      showUploadList={false}
      onChange={handleChange}
      disabled={loading}
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
