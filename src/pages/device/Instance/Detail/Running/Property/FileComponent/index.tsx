import type { PropertyMetadata } from '@/pages/device/Product/typings';
import styles from './index.less';
import Detail from './Detail';
import { useState } from 'react';
import { message, Tooltip } from 'antd';

interface Props {
  data: Partial<PropertyMetadata>;
  value: any;
  type: 'card' | 'table';
}

const imgMap = new Map<any, any>();
imgMap.set('txt', require('/public/images/running/txt.png'));
imgMap.set('doc', require('/public/images/running/doc.png'));
imgMap.set('xls', require('/public/images/running/xls.png'));
imgMap.set('ppt', require('/public/images/running/ppt.png'));
imgMap.set('docx', require('/public/images/running/docx.png'));
imgMap.set('xlsx', require('/public/images/running/xlsx.png'));
imgMap.set('pptx', require('/public/images/running/pptx.png'));
imgMap.set('pdf', require('/public/images/running/pdf.png'));
imgMap.set('img', require('/public/images/running/img.png'));
imgMap.set('error', require('/public/images/running/error.png'));
imgMap.set('video', require('/public/images/running/video.png'));
imgMap.set('other', require('/public/images/running/other.png'));

const FileComponent = (props: Props) => {
  const { data, value } = props;
  const [type, setType] = useState<string>('other');
  const [visible, setVisible] = useState<boolean>(false);
  const isHttps = document.location.protocol === 'https:';
  const [temp, setTemp] = useState<boolean>(false);

  const renderValue = () => {
    if (value?.formatValue !== 0 && !value?.formatValue) {
      return <div className={props.type === 'card' ? styles.other : {}}>--</div>;
    } else if (data?.valueType?.type === 'file') {
      if (
        data?.valueType?.fileType === 'base64' ||
        data?.valueType?.fileType === 'Binary(二进制)'
      ) {
        return (
          <div className={props.type === 'card' ? styles.other : {}}>
            <Tooltip placement="topLeft" title={String(value?.formatValue)}>
              {String(value?.formatValue)}
            </Tooltip>
          </div>
        );
      }
      if (['.jpg', '.png', '.swf', '.tiff'].some((item) => value?.formatValue.includes(item))) {
        // 图片
        return (
          <div
            className={styles.img}
            onClick={() => {
              if (isHttps && value?.formatValue.indexOf('http:') !== -1) {
                message.error('域名为https时，不支持访问http地址');
              } else if (temp) {
                message.error('该图片无法访问');
              } else {
                const flag =
                  ['.jpg', '.png'].find((item) => value?.formatValue.includes(item)) || '';
                setType(flag);
                setVisible(true);
              }
            }}
          >
            <img
              src={value?.formatValue}
              onError={(e: any) => {
                e.target.src = imgMap.get('error');
                setTemp(true);
              }}
            />
          </div>
        );
      }
      if (
        ['.m3u8', '.flv', '.mp4', '.rmvb', '.mvb'].some((item) => value?.formatValue.includes(item))
      ) {
        return (
          <div
            className={styles.img}
            onClick={() => {
              if (isHttps && value?.formatValue.indexOf('http:') !== -1) {
                message.error('域名为https时，不支持访问http地址');
              } else if (['.rmvb', '.mvb'].some((item) => value?.formatValue.includes(item))) {
                message.error('当前仅支持播放.mp4,.flv,.m3u8格式的视频');
              } else {
                const flag =
                  ['.m3u8', '.flv', '.mp4'].find((item) => value?.formatValue.includes(item)) || '';
                setType(flag);
                setVisible(true);
              }
            }}
          >
            <img src={imgMap.get('video')} />
          </div>
        );
      } else if (
        ['.txt', '.doc', '.xls', '.pdf', '.ppt', '.docx', '.xlsx', '.pptx'].some((item) =>
          value?.formatValue.includes(item),
        )
      ) {
        const flag =
          ['.txt', '.doc', '.xls', '.pdf', '.ppt', '.docx', '.xlsx', '.pptx'].find((item) =>
            value?.formatValue.includes(item),
          ) || '';
        return (
          <div className={styles.img}>
            <img src={imgMap.get(flag.slice(1))} />
          </div>
        );
      } else {
        return (
          <div className={styles.img}>
            <img src={imgMap.get('other')} />
          </div>
        );
      }
    } else if (data?.valueType?.type === 'object' || data?.valueType?.type === 'geoPoint') {
      return (
        <div className={props.type === 'card' ? styles.other : {}}>
          <Tooltip placement="topLeft" title={JSON.stringify(value?.formatValue)}>
            {JSON.stringify(value?.formatValue)}
          </Tooltip>
        </div>
      );
    } else {
      return (
        <div className={props.type === 'card' ? styles.other : {}}>
          <Tooltip placement="topLeft" title={String(value?.formatValue)}>
            {String(value?.formatValue)}
          </Tooltip>
        </div>
      );
    }
  };

  return (
    <div className={styles.value}>
      {renderValue()}
      {visible && (
        <Detail
          type={type}
          value={value}
          close={() => {
            setVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default FileComponent;
