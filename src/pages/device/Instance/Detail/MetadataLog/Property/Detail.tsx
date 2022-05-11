import { Modal, Input } from 'antd';
// import ReactMarkdown from "react-markdown";

interface Props {
  close: () => void;
  value: any;
  type: string;
}

const Detail = (props: Props) => {
  const { value, type } = props;

  const renderValue = () => {
    if (type === 'object') {
      return (
        <div>
          <div>自定义属性</div>
          {JSON.stringify(value)}
        </div>
      );
    } else {
      return (
        <div>
          <div>自定义属性</div>
          <Input value={value} disabled />
        </div>
      );
    }
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
