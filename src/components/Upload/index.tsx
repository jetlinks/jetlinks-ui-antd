import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import Upload from '@/components/Upload/Upload';

const FUpload = (props: any) => {
  return (
    <Upload
      {...props}
      action={`/${SystemConst.API_BASE}/file/static`}
      headers={{
        'X-Access-Token': Token.get(),
      }}
    >
      <Button icon={<UploadOutlined />}>{props.title}</Button>
    </Upload>
  );
};
export default FUpload;
