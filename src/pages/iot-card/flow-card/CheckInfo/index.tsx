import React, { Suspense } from 'react';
import { Modal, Descriptions } from 'antd';
import SalectsCard from '../SalectsCard';
import moment from 'moment';
import style from '../style.less';

interface Props {
  close: Function;
  data: any;
}


const CheckInfo: React.FC<Props> = props => {
  return (
    <Modal
      title={"基本信息"}
      width={840}
      destroyOnClose
      visible
      onCancel={() => props.close()}
      onOk={() => props.close()}
    >
      <Descriptions>
        <Descriptions.Item label="卡号">{props.data?.id}</Descriptions.Item>
        <Descriptions.Item label="ICCID">{props.data?.iccId}</Descriptions.Item>
        <Descriptions.Item label="批次号">{props.data?.batchNumber}</Descriptions.Item>
        <Descriptions.Item label="类型">{props.data?.cardType?.text}</Descriptions.Item>
        <Descriptions.Item label="运营商">{props.data?.operatorName}</Descriptions.Item>
        <Descriptions.Item label="更新时间">{props.data?.updateTime ? moment(props.data?.updateTime).format('YYYY-MM-DD') : ''}</Descriptions.Item>
        <Descriptions.Item label="激活时间">{props.data?.activationDate ? moment(props.data?.activationDate).format('YYYY-MM-DD') : ''}</Descriptions.Item>
        <Descriptions.Item label="状态"><div className={style.checkInfoState}>{props.data?.cardState?.text}</div></Descriptions.Item>
        <Descriptions.Item label="设备ID">{props.data?.deviceId}</Descriptions.Item>
      </Descriptions>
      <Suspense fallback={null}>
        <SalectsCard loading={false} id={props.data?.id} />
      </Suspense>
    </Modal>
  )
};

export default CheckInfo;
