import type { PropertyMetadata } from '@/pages/device/Product/typings';
import styles from './index.less';
import Detail from './Detail';
import { useState } from 'react';

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
imgMap.set('jpg', require('/public/images/running/jpg.png'));
imgMap.set('png', require('/public/images/running/png.png'));
imgMap.set('pdf', require('/public/images/running/pdf.png'));
imgMap.set('tiff', require('/public/images/running/tiff.png'));
imgMap.set('swf', require('/public/images/running/swf.png'));
imgMap.set('flv', require('/public/images/running/flv.png'));
imgMap.set('rmvb', require('/public/images/running/rmvb.png'));
imgMap.set('mp4', require('/public/images/running/mp4.png'));
imgMap.set('mvb', require('/public/images/running/mvb.png'));
imgMap.set('wma', require('/public/images/running/wma.png'));
imgMap.set('mp3', require('/public/images/running/mp3.png'));
imgMap.set('other', require('/public/images/running/other.png'));

const FileComponent = (props: Props) => {
  const { data, value } = props;
  const [type, setType] = useState<string>('other');
  const [visible, setVisible] = useState<boolean>(false);

  const renderValue = () => {
    if (!value?.formatValue) {
      return <div className={props.type === 'card' ? styles.other : {}}>--</div>;
    } else if (data?.valueType?.type === 'file') {
      const flag: string = value?.formatValue.split('.').pop() || 'other';
      if (['jpg', 'png'].includes(flag)) {
        return (
          <div
            className={styles.img}
            onClick={() => {
              setType(flag);
              setVisible(true);
            }}
          >
            {value?.formatValue ? (
              <img style={{ width: '100%' }} src={value?.formatValue} />
            ) : (
              <img src={imgMap.get(flag) || imgMap.get('other')} />
            )}
          </div>
        );
      }
      return (
        <div
          className={styles.img}
          onClick={() => {
            if (['tiff', 'flv', 'm3u8', 'mp4', 'rmvb', 'mvb'].includes(flag)) {
              setType(flag);
              setVisible(true);
            }
          }}
        >
          <img src={imgMap.get(flag) || imgMap.get('other')} />
        </div>
      );
    } else if (data?.valueType?.type === 'object' || data?.valueType?.type === 'geoPoint') {
      return (
        <div className={props.type === 'card' ? styles.other : {}}>
          {JSON.stringify(value?.formatValue)}
        </div>
      );
    } else {
      return (
        <div className={props.type === 'card' ? styles.other : {}}>
          {String(value?.formatValue)}
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
