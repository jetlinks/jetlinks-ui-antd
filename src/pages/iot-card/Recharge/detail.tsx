import { Modal, Descriptions } from 'antd';

interface Props {
  data: any;
  close: any;
}

const Detail = (props: Props) => {
  return (
    <Modal
      title={'充值'}
      maskClosable={false}
      visible
      onCancel={props.close}
      onOk={props.close}
      width="35vw"
    >
      <Descriptions title="User Info">
        <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
        <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
        <Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
        <Descriptions.Item label="Remark">empty</Descriptions.Item>
        <Descriptions.Item label="Address">
          No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default Detail;
