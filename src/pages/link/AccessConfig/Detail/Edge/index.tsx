import { Button, Card, Steps } from 'antd';
import styles from './index.less';
import { useEffect, useState } from 'react';
import Network from '../components/Network';
import Finish from '../components/Finish';

interface Props {
  change: () => void;
  data: any;
  provider: any;
  view?: boolean;
}

const Edge = (props: Props) => {
  const { provider } = props;
  const [current, setCurrent] = useState<number>(provider?.id === 'edge-child-device' ? 1 : 0);
  const [steps] = useState<string[]>(['网络组件', '完成']);
  const [network, setNetwork] = useState<string>(props.data?.channelId);

  useEffect(() => {
    setCurrent(provider?.id === 'edge-child-device' ? 1 : 0);
  }, [provider]);

  useEffect(() => {
    console.log(props.data);
    setNetwork(props.data?.channelId);
  }, [props.data]);

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
            provider={props.provider}
            data={network}
            view={props.view}
            next={(param) => {
              setNetwork(param);
              next();
            }}
          />
        );
      case 1:
        return (
          <Finish
            provider={props.provider}
            data={props.data}
            config={{ network, protocol: 'official-edge-protocol' }}
            prev={prev}
            type={'edge'}
            view={props.view}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card>
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
          {provider?.id !== 'edge-child-device' && (
            <Steps size="small" current={current}>
              {steps.map((item) => (
                <Steps.Step key={item} title={item} />
              ))}
            </Steps>
          )}
        </div>
        <div className={styles.content}>{renderSteps(current)}</div>
      </div>
    </Card>
  );
};

export default Edge;
