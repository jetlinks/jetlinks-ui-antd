import { Modal } from 'antd';
interface Props {
  data: any;
  cancel: () => void;
}

export default (props: Props) => {
  return (
    <Modal
      open
      title={'下发'}
      onOk={() => {
        props.cancel();
      }}
      onCancel={() => {
        props.cancel();
      }}
      width={700}
    >
      下发
    </Modal>
  );
};
