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
    if (['jpg', 'png', 'tiff'].includes(type)) {
      return <Image src={value?.formatValue} />;
    } else if (value?.formatValue.indexOf('https') !== -1) {
      return <p>域名为https时，不支持访问http地址</p>;
    } else if (['flv', 'm3u8', 'mp4'].includes(type)) {
      return <LivePlayer live={false} url={value?.formatValue} />;
    }
    return <p>当前仅支持播放.mp4,.flv,.m3u8格式的视频</p>;
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
