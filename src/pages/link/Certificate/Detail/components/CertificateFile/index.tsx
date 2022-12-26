import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import { onlyMessage } from '@/utils/util';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/lib/upload';
import { useEffect, useState } from 'react';

interface Props {
  value?: string;
  onChange?: (type: any) => void;
  placeholder?: string;
}

const CertificateFile = (props: Props) => {
  const [keystoreBase64, setKeystoreBase64] = useState<string>('');

  useEffect(() => {
    setKeystoreBase64(props?.value || '');
  }, [props.value]);

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'done') {
      const {
        file: { response },
      } = info;
      if (response.status === 200) {
        onlyMessage('上传成功');
        setKeystoreBase64(response.result);
        if (props.onChange) {
          props.onChange(response.result);
        }
      }
    } else if (info.file.status === 'error') {
      onlyMessage(`${info.file.name} file upload failed.`, 'error');
    }
  };

  return (
    <div>
      <Input.TextArea
        onChange={(e) => {
          setKeystoreBase64(e.target.value);
          if (props.onChange) {
            props.onChange(e.target.value);
          }
        }}
        value={keystoreBase64}
        rows={4}
        placeholder={props.placeholder}
      />
      <Upload
        accept=".pem"
        listType={'text'}
        action={`/${SystemConst.API_BASE}/network/certificate/upload`}
        headers={{
          'X-Access-Token': Token.get(),
        }}
        onChange={handleChange}
        showUploadList={false}
      >
        <Button style={{ marginTop: 10 }} icon={<UploadOutlined />}>
          上传文件
        </Button>
      </Upload>
    </div>
  );
};

export default CertificateFile;
