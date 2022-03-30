import { Descriptions, Modal } from 'antd';
import type { AccessLogItem } from '@/pages/Log/Access/typings';
import { useEffect, useState } from 'react';
import moment from 'moment';

interface Props {
  data: Partial<AccessLogItem>;
  close: () => void;
}

const Detail = (props: Props) => {
  const [data, setDada] = useState<Partial<AccessLogItem>>(props.data);

  useEffect(() => {
    setDada(props.data);
  }, [props.data]);

  return (
    <Modal title={'详情'} visible onCancel={props.close} onOk={props.close} width={1000}>
      <Descriptions bordered>
        <Descriptions.Item label="URL">{data?.url}</Descriptions.Item>
        <Descriptions.Item label="请求方法" span={2}>
          {data?.httpMethod}
        </Descriptions.Item>
        <Descriptions.Item label="动作">{data?.action}</Descriptions.Item>
        <Descriptions.Item label="类名" span={2}>
          {data?.target}
        </Descriptions.Item>
        <Descriptions.Item label="方法名">{data?.method}</Descriptions.Item>
        <Descriptions.Item label="IP" span={2}>
          {data?.ip}
        </Descriptions.Item>
        <Descriptions.Item label="请求时间">
          {moment(data?.requestTime).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label="请求耗时" span={2}>
          {(data?.responseTime || 0) - (data?.requestTime || 0)}ms
        </Descriptions.Item>
        <Descriptions.Item label="请求头" span={3}>
          {JSON.stringify(data?.httpHeaders)}
        </Descriptions.Item>
        <Descriptions.Item label="请求参数" span={3}>
          {JSON.stringify(data?.parameters)}
        </Descriptions.Item>
        <Descriptions.Item label="异常信息" span={3}>
          {data?.exception}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};
export default Detail;
