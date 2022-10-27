import { Modal, Descriptions } from 'antd';
import moment from 'moment';

interface Props {
  data: any;
  close: any;
}

const Detail = (props: Props) => {
  const { data } = props;
  return (
    <Modal
      title={'详情'}
      maskClosable={false}
      visible
      onCancel={props.close}
      onOk={props.close}
      width="35vw"
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="充值金额">{data.chargeMoney}</Descriptions.Item>
        <Descriptions.Item label="账户id">{data?.rechargeId}</Descriptions.Item>
        <Descriptions.Item label="平台对接">{data.configName}</Descriptions.Item>
        <Descriptions.Item label="订单号">{data.orderNumber}</Descriptions.Item>
        <Descriptions.Item label="支付方式">{data.paymentType}</Descriptions.Item>
        <Descriptions.Item label="支付URL">{data.url ? data.url : ''}</Descriptions.Item>
        <Descriptions.Item label="订单时间">
          {data.createTime ? moment(data.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default Detail;
