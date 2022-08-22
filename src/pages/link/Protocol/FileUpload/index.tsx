import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import { useState } from 'react';
import { connect } from '@formily/react';
import { Button, Input, Spin, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/lib/upload/interface';
import { onlyMessage } from '@/utils/util';
import { service } from '@/pages/link/Protocol';
interface Props {
  value: string;
  onChange: (value: string) => void;
  accept?: string;
  disabled?: boolean;
}

const FileUpload = connect((props: Props) => {
  const [url, setUrl] = useState<string>(props?.value);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = async (info: UploadChangeParam) => {
    setLoading(true);
    if (info.file.status === 'done') {
      onlyMessage('上传成功！');
      const result = info.file.response?.result;
      const api = await service.querySystemApi(['paths']);
      const f = `${api?.result[0]?.properties['base-path']}/file/${result?.id}?accessKey=${result?.others?.accessKey}`;
      setUrl(f);
      setLoading(false);
      props.onChange(f);
    }
  };

  return (
    <Spin spinning={loading}>
      <Upload
        accept={props?.accept || '*'}
        listType={'text'}
        disabled={props?.disabled}
        action={`/${SystemConst.API_BASE}/file/upload`}
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
            onBlur={(e) => {
              props.onChange(e.target.value);
            }}
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
