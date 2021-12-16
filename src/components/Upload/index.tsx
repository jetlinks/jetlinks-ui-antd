import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import { useState } from 'react';
import { connect } from '@formily/react';
import { Upload } from 'antd';
import type { UploadChangeParam } from 'antd/lib/upload/interface';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const FUploadImage = connect((props: Props) => {
  const [url, setUrl] = useState<string>(props?.value);
  const [loading, setLoading] = useState<boolean>(false);
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>选择图片</div>
    </div>
  );
  const handleChange = (info: UploadChangeParam) => {
    console.log(info);
    if (info.file.status === 'uploading') {
      setLoading(false);
    }
    if (info.file.status === 'done') {
      info.file.url = info.file.response?.result;
      setLoading(false);
      setUrl(info.file.response?.result);
      props.onChange(info.file.response?.result);
    }
  };
  return (
    <Upload
      listType="picture-card"
      action={`/${SystemConst.API_BASE}/file/static`}
      headers={{
        'X-Access-Token': Token.get(),
      }}
      onChange={handleChange}
      showUploadList={false}
    >
      {url ? <img src={url} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  );
});
export default FUploadImage;
