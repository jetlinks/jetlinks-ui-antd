import LivePlayer from '@/components/Player';
import { Modal, Image } from 'antd';

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
