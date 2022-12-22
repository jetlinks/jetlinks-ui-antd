import { Card, Progress } from 'antd';
import { useEffect, useState } from 'react';
import Message, { DiagnoseMessageModel } from './Message';
import Status from './Status';
import './index.less';
import { useDomFullHeight } from '@/hooks';
import { InstanceModel } from '@/pages/device/Instance';
import { observer } from '@formily/reactive-react';
import {
  DiagnoseStatusModel,
  headerColorMap,
  headerDescMap,
  headerImgMap,
  headerTextMap,
  list,
  progressMap,
} from './Status/model';
import classNames from 'classnames';

const Diagnose = observer(() => {
  const { minHeight } = useDomFullHeight(`.diagnose`, 12);
  const [current, setCurrent] = useState<string>('status');
  const [providerType, setProviderType] = useState<
    undefined | 'network' | 'child-device' | 'media' | 'cloud' | 'channel'
  >(undefined);

  const ViewMap = {
    status: <Status providerType={providerType} />,
    message: <Message />,
  };

  useEffect(() => {
    DiagnoseStatusModel.list = [];
    DiagnoseStatusModel.count = 0;
    DiagnoseStatusModel.percent = 0;
    DiagnoseStatusModel.status = 'loading';
    DiagnoseStatusModel.state = 'loading';
    DiagnoseStatusModel.flag = false;
    DiagnoseStatusModel.logList = [];
    DiagnoseStatusModel.dialogList = [];
    DiagnoseStatusModel.allDialogList = [];
    DiagnoseStatusModel.message = {
      up: {
        text: '上行消息诊断中',
        status: 'loading',
      },
      down: {
        text: '下行消息诊断中',
        status: 'loading',
      },
    };
    DiagnoseMessageModel.inputs = [];
    DiagnoseMessageModel.data = { type: 'function' };
    DiagnoseMessageModel.input = {};
    DiagnoseMessageModel._inputs = {};
    setCurrent('status');
    const provider = InstanceModel.detail?.accessProvider;
    if (provider === 'fixed-media' || provider === 'gb28181-2016') {
      setProviderType('media');
    } else if (provider === 'OneNet' || provider === 'Ctwing') {
      setProviderType('cloud');
    } else if (provider === 'modbus-tcp' || provider === 'opc-ua') {
      setProviderType('channel');
    } else if (provider === 'child-device') {
      setProviderType('child-device');
    } else {
      setProviderType('network');
    }
    DiagnoseStatusModel.state = 'loading';
    return () => {};
  }, [InstanceModel.active]);

  const activeStyle = {
    background: '#FFFFFF',
    border: '1px solid rgba(0, 0, 0, 0.09)',
    borderRadius: '2px 2px 0px 0px',
    color: '#000000BF',
  };

  return (
    <Card className="diagnose" style={{ minHeight }}>
      <div
        className="diagnose-header"
        style={{
          background: headerColorMap.get(DiagnoseStatusModel.state),
        }}
      >
        <div className="diagnose-top">
          <div className="diagnose-img">
            {DiagnoseStatusModel.state === 'loading' ? (
              <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                <img
                  style={{ height: '100%', position: 'absolute', zIndex: 2 }}
                  src={headerImgMap.get(DiagnoseStatusModel.state)}
                />
                <img
                  src={require('/public/images/diagnose/loading-1.png')}
                  className={'diagnose-loading'}
                  style={{ height: '100%' }}
                />
              </div>
            ) : (
              <img style={{ height: '100%' }} src={headerImgMap.get(DiagnoseStatusModel.state)} />
            )}
          </div>
          <div className="diagnose-text">
            <div className="diagnose-title">{headerTextMap.get(DiagnoseStatusModel.state)}</div>
            <div className="diagnose-desc">
              {DiagnoseStatusModel.state !== 'loading'
                ? headerDescMap.get(DiagnoseStatusModel.state)
                : `已诊断${DiagnoseStatusModel.count}个`}
            </div>
          </div>
        </div>
        <div className="diagnose-progress">
          <Progress
            strokeColor={progressMap.get(DiagnoseStatusModel.state)}
            showInfo={false}
            style={{ width: '100%' }}
            size="small"
            percent={DiagnoseStatusModel.percent}
          />
        </div>
        <div className="diagnose-radio">
          {list.map((i) => (
            <div
              key={i.key}
              className={classNames(
                'diagnose-radio-item',
                i.key === 'message' && DiagnoseStatusModel.state !== 'success' ? 'disabled' : '',
              )}
              style={current === i.key ? { ...activeStyle } : {}}
              onClick={() => {
                if (DiagnoseStatusModel.state === 'success') {
                  setCurrent(i.key);
                }
              }}
            >
              {i.text}
              {/*{current === i.key ? '(诊断中)' : ''}*/}
            </div>
          ))}
        </div>
      </div>
      <div>{ViewMap[current]}</div>
    </Card>
  );
});

export default Diagnose;
