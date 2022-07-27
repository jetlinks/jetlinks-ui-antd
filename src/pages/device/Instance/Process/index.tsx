import { Badge, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';

interface Props {
  api: string;
  closeVisible: () => void;
  action: string;
}

interface State {
  source: any;
}

const Process = (props: Props) => {
  const initState: State = {
    source: {},
  };
  const [eventSource, setSource] = useState<any>(initState.source);
  const [count, setCount] = useState<number>(0);
  const [flag, setFlag] = useState<boolean>(true);
  const [errMessage, setErrMessage] = useState<string>('');
  const { action } = props;

  const getData = () => {
    let dt = 0;

    const source = new EventSourcePolyfill(props.api);
    setSource(source);
    source.onmessage = (e: any) => {
      const res = JSON.parse(e.data);
      switch (action) {
        case 'active':
          if (res.success) {
            dt += res.total;
            setCount(dt);
          } else {
            setErrMessage(res.message);
          }
          break;
        case 'sync':
          dt += res;
          setCount(dt);
          break;
        case 'import':
          if (res.success) {
            const temp = res.result.total;
            dt += temp;
            setCount(dt);
          } else {
            setErrMessage(res.message);
          }
          break;
        default:
          break;
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
      maskClosable={false}
      title="当前进度"
      visible
      confirmLoading={flag}
      okText="确认"
      onOk={() => {
        props.closeVisible();
        setCount(0);
        eventSource.close();
      }}
      cancelText="关闭"
      onCancel={() => {
        props.closeVisible();
        setCount(0);
        eventSource.close();
      }}
    >
      {flag ? (
        <Badge status="processing" text="进行中" />
      ) : (
        <Badge status="success" text="已完成" />
      )}
      <p>总数量:{count}</p>
      <p style={{ color: 'red' }}>{errMessage}</p>
    </Modal>
  );
};
export default Process;
