import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import { useState } from 'react';
import { connect } from '@formily/react';
import { Button, Input, message, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/lib/upload/interface';

interface Props {
  value: string;
  onChange: (value: string) => void;
  accept?: string;
}

const FileUpload = connect((props: Props) => {
  const [url, setUrl] = useState<string>(props?.value);

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'done') {
      message.success('上传成功！');
      info.file.url = info.file.response?.result;
      setUrl(info.file.response?.result);
      props.onChange(info.file.response?.result);
    }
  };

  return (
    <Upload
      accept={props?.accept || '*'}
      listType={'text'}
      action={`/${SystemConst.API_BASE}/file/static`}
      headers={{
        'X-Access-Token': Token.get(),
      }}
      onChange={handleChange}
      showUploadList={false}
    >
      <Input.Group compact>
        <Input
          style={{ width: 'calc(100% - 100px)' }}
          value={url}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />
        <Button shape="round" style={{ width: '100px', textAlign: 'center' }} type="primary">
          上传jar包
        </Button>
      </Input.Group>
    </Upload>
  );
});
export default FileUpload;
