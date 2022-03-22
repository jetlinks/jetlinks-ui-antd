import { message, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import type { UploadChangeParam } from 'antd/lib/upload/interface';
import type { RcFile } from 'antd/es/upload';
import './index.less';

interface UploadImageProps {
  onChange?: (url: string) => void;
  value?: string;
  disabled?: boolean;
  /**
   * 图片格式类型，默认 'image/jpeg', 'image/png'
   */
  types?: string[];
  /**
   * 图片大小限制， 单位 M，默认 4 M
   */
  size?: number;
  style?: React.CSSProperties;
}

export default ({ onChange, value, ...extraProps }: UploadImageProps) => {
  const [values, setValues] = useState(value || '');
  const [loading, setLoading] = useState<boolean>(false);
  const imageTypes = extraProps.types ? extraProps.types : ['image/jpeg', 'image/png'];

  useEffect(() => {
    setValues(value || '');
  }, [value]);

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
    }
    if (info.file.status === 'done') {
      info.file.url = info.file.response?.result;
      setLoading(false);
      setValues(info.file.response?.result);
      if (onChange) {
        onChange(info.file.response?.result);
      }
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isType = imageTypes.includes(file.type);
    if (!isType) {
      message.error(`图片格式错误，必须是${imageTypes.toString()}格式`);
      return false;
    }
    const isSize = file.size / 1024 / 1024 < (extraProps.size || 4);
    if (!isSize) {
      message.error(`图片大小必须小于${extraProps.size || 4}M`);
    }
    return isType && isSize;
  };

  return (
    <div className={'upload-image-warp'}>
      <div className={'upload-image-border'}>
        <Upload
          action={`/${SystemConst.API_BASE}/file/static`}
          headers={{
            'X-Access-Token': Token.get(),
          }}
          showUploadList={false}
          onChange={handleChange}
          beforeUpload={beforeUpload}
          {...extraProps}
        >
          <div className={'upload-image-content'} style={extraProps.style}>
            {values ? (
              <>
                {/*<img width={120} height={120} src={values} />*/}
                <div className={'upload-image'} style={{ backgroundImage: `url(${values})` }} />
                <div className={'upload-image-mask'}>点击修改</div>
              </>
            ) : (
              <>
                {loading ? (
                  <LoadingOutlined style={{ fontSize: 28 }} />
                ) : (
                  <PlusOutlined style={{ fontSize: 28 }} />
                )}
                <div>点击上传图片</div>
              </>
            )}
          </div>
        </Upload>
        {extraProps.disabled && <div className={'upload-loading-mask'} />}
        {values && loading ? (
          <div className={'upload-loading-mask'}>
            {loading ? <LoadingOutlined style={{ fontSize: 28 }} /> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};
