import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import { downloadObject } from '@/utils/util';
import { Col, Input, Modal, Row } from 'antd';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useEffect, useState } from 'react';

interface Props {
  data: any;
  close: () => void;
}

const Publish = (props: Props) => {
  const activeAPI = `/${SystemConst.API_BASE}/media/gb28181-cascade/${
    props.data.id
  }/bindings/publish?:X_Access_Token=${Token.get()}`;
  const [count, setCount] = useState<number>(0);
  const [countErr, setCountErr] = useState<number>(0);
  const [flag, setFlag] = useState<boolean>(true);
  const [errMessage, setErrMessage] = useState<string>('');

  const getData = () => {
    let dt = 0;
    const source = new EventSourcePolyfill(activeAPI);
    source.onmessage = (e: any) => {
      const res = JSON.parse(e.data);
      if (res.success) {
        const temp = res.result.total;
        dt += temp;
        setCount(dt);
        // setCountErr(0);
      } else {
        setCountErr(0);
        setErrMessage(res.message);
      }
    };
    source.onerror = () => {
      setFlag(false);
      source.close();
    };
    source.onopen = () => {};
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Modal
      title={'推送'}
      maskClosable={false}
      visible
      onCancel={props.close}
      onOk={props.close}
      width={900}
    >
      <Row gutter={24} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <div>成功: {count}</div>
          <div>
            失败: {countErr}
            <a
              style={{ marginLeft: 20 }}
              onClick={() => {
                downloadObject(JSON.parse(errMessage || '{}'), props.data.name + '-推送失败');
              }}
            >
              下载
            </a>
          </div>
        </Col>
        <Col span={8}>推送通道数量: {props.data?.count || 0}</Col>
        <Col span={8}>已推送通道数量: {countErr + count}</Col>
      </Row>
      {flag && (
        <div>
          <Input.TextArea rows={10} value={errMessage} />
        </div>
      )}
    </Modal>
  );
};

export default Publish;
