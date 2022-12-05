import LivePlayer from '@/components/Player';
import { Image, Modal } from 'antd';
import ReactJson from 'react-json-view';

interface Props {
  close: () => void;
  value: any;
  type: string;
}

const Detail = (props: Props) => {
  const { value, type } = props;

  const renderValue = () => {
    if (['.jpg', '.png'].includes(type)) {
      return <Image src={value?.formatValue} />;
    } else if (['.flv', '.m3u8', '.mp4'].includes(type)) {
      return <LivePlayer live={false} url={value?.formatValue} />;
    } else if (type === 'obj') {
      // @ts-ignore
      return (
        <ReactJson
          displayObjectSize={false}
          displayDataTypes={false}
          name={false}
          src={value?.formatValue}
        />
      );
    }
    return null;
  };

  return (
    <Modal
      title="详情"
      visible
      onOk={() => {
        props.close();
      }}
      onCancel={() => {
        props.close();
      }}
    >
      {renderValue()}
    </Modal>
  );
};

export default Detail;
