import { Input, Modal, Space, Tag } from 'antd';
import type { SystemLogItem } from '@/pages/Log/System/typings';
import { useEffect, useState } from 'react';
import moment from 'moment';

interface Props {
  data: Partial<SystemLogItem>;
  close: () => void;
}

const Detail = (props: Props) => {
  const [data, setDada] = useState<Partial<SystemLogItem>>(props.data);

  useEffect(() => {
    setDada(props.data);
  }, [props.data]);

  return (
    <Modal title={'详情'} visible onCancel={props.close} onOk={props.close} width={1000}>
      <Space>
        <span>[{data?.threadName}]</span>
        <span>{moment(data?.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
        <span>{data?.className}</span>
      </Space>
      <p>
        <Tag color={data?.level === 'ERROR' ? 'red' : 'orange'}>{data?.level}</Tag>
        {data?.message}
      </p>
      <div>
        <Input.TextArea rows={20} value={data?.exceptionStack} />
      </div>
    </Modal>
  );
};
export default Detail;
