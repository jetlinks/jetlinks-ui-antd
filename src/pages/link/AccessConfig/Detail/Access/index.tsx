import { Button, Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';
import { useDomFullHeight } from '@/hooks';
import Network from '@/pages/link/AccessConfig/Detail/components/Network';
import Protocol from '@/pages/link/AccessConfig/Detail/components/Protocol';
import Finish from '@/pages/link/AccessConfig/Detail/components/Finish';

interface Props {
  change: () => void;
  data: any;
  provider: any;
  view?: boolean;
}

const Access = (props: Props) => {
  const { minHeight } = useDomFullHeight(`.access`);
  const [current, setCurrent] = useState<number>(props.provider?.id !== 'child-device' ? 0 : 1);
  const [network, setNetwork] = useState<string>(props.data?.channelId);
  const [protocol, setProtocol] = useState<string>(props.data?.protocol);
  const [steps, setSteps] = useState<string[]>(['网络组件', '消息协议', '完成']);

  useEffect(() => {
    if (props.provider?.id) {
      if (props.provider?.id !== 'child-device') {
        setSteps(['网络组件', '消息协议', '完成']);
        setCurrent(0);
      } else {
        setSteps(['消息协议', '完成']);
        setCurrent(1);
      }
    }
  }, [props.provider]);

  const prev = () => {
    setCurrent(current - 1);
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const renderSteps = (cur: number) => {
    switch (cur) {
      case 0:
        return (
          <Network
            next={(param) => {
              setNetwork(param);
              next();
            }}
            data={network}
            provider={props.provider}
            view={props.view}
          />
        );
      case 1:
        return (
          <Protocol
            dt={props.data}
            data={protocol}
            provider={props.provider}
            prev={prev}
            next={(param) => {
              setProtocol(param);
              next();
            }}
          />
        );
      case 2:
        return (
          <Finish
            prev={prev}
            data={props.data}
            type={'network'}
            provider={props.provider}
            config={{ network, protocol }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="access" style={{ minHeight }}>
      {!props.data?.id && (
        <Button
          type="link"
          onClick={() => {
            props.change();
          }}
        >
          返回
        </Button>
      )}
      <div className={styles.box}>
        <div className={styles.steps}>
          <Steps size="small" current={current}>
            {steps.map((item) => (
              <Steps.Step key={item} title={item} />
            ))}
          </Steps>
        </div>
        <div className={styles.content}>{renderSteps(current)}</div>
      </div>
    </Card>
  );
};

export default Access;
