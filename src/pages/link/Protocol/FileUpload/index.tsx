import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import { useState } from 'react';
import { connect } from '@formily/react';
import { Button, Input, Spin, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/lib/upload/interface';
import { onlyMessage } from '@/utils/util';

interface Props {
  value: string;
  onChange: (value: string) => void;
  accept?: string;
  disabled?: boolean;
}

const FileUpload = connect((props: Props) => {
  const [url, setUrl] = useState<string>(props?.value);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (info: UploadChangeParam) => {
    setLoading(true);
    if (info.file.status === 'done') {
      onlyMessage('上传成功！');
      info.file.url = info.file.response?.result;
      setUrl(info.file.response?.result);
      setLoading(false);
      props.onChange(info.file.response?.result);
    }
  };

  return (
    <Spin spinning={loading}>
      <Upload
        accept={props?.accept || '*'}
        listType={'text'}
        disabled={props?.disabled}
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
            disabled={props?.disabled}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            placeholder="请上传文件"
          />
          <Button
            disabled={props?.disabled}
            shape="round"
            style={{ width: '100px', textAlign: 'center' }}
            type="primary"
          >
            上传jar包
          </Button>
        </Input.Group>
      </Upload>
    </Spin>
  );
});
export default FileUpload;
