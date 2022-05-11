import { Modal, Input } from 'antd';
import ReactJson from 'react-json-view';

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
          <div>
            {
              // @ts-ignore
              <ReactJson
                displayObjectSize={false}
                displayDataTypes={false}
                style={{ marginTop: 10 }}
                name={false}
                src={value}
              />
            }
          </div>
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
      destroyOnClose={true}
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
