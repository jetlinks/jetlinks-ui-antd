import { Button, Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';
import { InfoCircleOutlined } from '@ant-design/icons';
import OneNet from '../components/OneNet';
import CTWing from '../components/CTWing';
import Protocol from '../components/Protocol';
import Finish from '../components/Finish';

interface Props {
  change: () => void;
  data: any;
  provider: any;
  view?: boolean;
}

const Cloud = (props: Props) => {
  const [current, setCurrent] = useState<number>(0);
  const [steps] = useState<string[]>(['接入配置', '消息协议', '完成']);
  const [config, setConfig] = useState<any>({});
  const [protocolCurrent, setProtocolCurrent] = useState<string>('');

  const prev = () => {
    setCurrent(current - 1);
  };

  const next = (param: any) => {
    setConfig(param);
    setCurrent(current + 1);
  };

  useEffect(() => {
    setCurrent(0);
    setConfig(props.data?.configuration || {});
    setProtocolCurrent(props.data?.protocol);
  }, [props.data]);

  const renderSteps = (cur: number) => {
    switch (cur) {
      case 0:
        return (
          <div>
            <div className={styles.alert}>
              <InfoCircleOutlined style={{ marginRight: 10 }} />
              通过{props?.provider?.id === 'OneNet' ? 'OneNet' : 'CTWing'}
              平台的HTTP推送服务进行数据接入
            </div>
            <div style={{ marginTop: 10 }}>
              {props?.provider?.id === 'OneNet' ? (
                <OneNet data={config} next={(param: any) => next(param)} />
              ) : (
                <CTWing data={config} next={(param: any) => next(param)} />
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <div className={styles.alert}>
              <InfoCircleOutlined style={{ marginRight: 10 }} />
              只能选择HTTP通信方式的协议
            </div>
            <div style={{ marginTop: 10 }}>
              <Protocol
                data={protocolCurrent}
                provider={props.provider}
                view={props.view}
                next={(param: string) => {
                  setProtocolCurrent(param);
                  setCurrent(current + 1);
                }}
                prev={prev}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <Finish
            provider={props.provider}
            data={props.data}
            config={{
              config,
              protocol: protocolCurrent,
            }}
            prev={prev}
            type={'cloud'}
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

export default Cloud;
