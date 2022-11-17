import { SceneItem } from '@/pages/rule-engine/Scene/typings';
import { Modal } from 'antd';

interface Props {
  close: () => void;
  data: Partial<SceneItem>;
  save: (data: any) => void;
}

export default (props: Props) => {
  return (
    <Modal
      title={'定时触发'}
      maskClosable={false}
      visible
      onCancel={() => {
        props.close();
      }}
      onOk={async () => {
        // const values = await form.validateFields();
        // props.close();
      }}
      width={700}
    >
      123
    </Modal>
  );
};
