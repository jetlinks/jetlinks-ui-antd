import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import { downloadObject } from '@/utils/util';
import { Col, Input, Modal, Row } from 'antd';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useEffect, useState } from 'react';
import { DeviceInstance } from '@/pages/device/Instance/typings';

interface Props {
  list: Partial<DeviceInstance>[];
  data: Partial<ResourceItem>;
  close: () => void;
}

const Publish = (props: Props) => {
  const [count, setCount] = useState<number>(0);
  const [countErr, setCountErr] = useState<number>(0);
  const [flag, setFlag] = useState<boolean>(true);
  const [errMessage, setErrMessage] = useState<any[]>([]);

  const getData = () => {
    let dt = 0;
    let et = 0;
    const errMessages: any[] = [];
    const _terms = {
      deviceId: (props.list || []).map((item) => item.id),
      name: props.data.name,
      targetId: props.data.targetId,
      targetType: props.data.targetType,
      category: props.data.category,
      metadata: encodeURIComponent(props.data?.metadata || ''),
    };
    const url = new URLSearchParams();
    Object.keys(_terms).forEach((key) => {
      if (Array.isArray(_terms[key]) && _terms[key].length) {
        _terms[key].map((item: string) => {
          url.append(key, item);
        });
      } else {
        url.append(key, _terms[key]);
      }
    });
    const source = new EventSourcePolyfill(
      `/${
        SystemConst.API_BASE
      }/edge/operations/entity-template-save/invoke/_batch?:X_Access_Token=${Token.get()}&${url.toString()}`,
    );
    source.onmessage = (e: any) => {
      const res = JSON.parse(e.data);
      if (res.successful) {
        dt += 1;
        setCount(dt);
      } else {
        et += 1;
        setCountErr(et);
        setFlag(false);
        if (errMessages.length <= 5) {
          errMessages.push({ ...res });
          setErrMessage([...errMessages]);
        }
      }
    };
    source.onerror = () => {
      source.close();
    };
    source.onopen = () => {};
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Modal
      title={'下发结果'}
      maskClosable={false}
      open
      onCancel={props.close}
      onOk={props.close}
      width={900}
    >
      <Row gutter={24} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <div>成功: {count}</div>
          <div>
            失败: {countErr}
            {errMessage.length > 0 && (
              <a
                style={{ marginLeft: 20 }}
                onClick={() => {
                  downloadObject(errMessage || '', '下发失败原因');
                }}
              >
                下载
              </a>
            )}
          </div>
        </Col>
        <Col span={8}>下发设备数量: {props.list?.length || 0}</Col>
        <Col span={8}>已下发数量: {countErr + count}</Col>
      </Row>
      {!flag && (
        <div>
          <Input.TextArea rows={10} value={JSON.stringify(errMessage)} />
        </div>
      )}
    </Modal>
  );
};

export default Publish;
