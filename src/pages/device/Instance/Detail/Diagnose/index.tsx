import { Badge, Card, Col, Row, Tooltip } from 'antd';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Message from './Message';
import Status from './Status';
import './index.less';
import classNames from 'classnames';
import { Store } from 'jetlinks-store';
import { DiagnoseStatusModel } from './Status/model';

interface ListProps {
  key: string;
  tab: string;
  component: ReactNode;
}

const bImageMap = new Map();
bImageMap.set('m-error', require('/public/images/diagnose/message-error.png'));
bImageMap.set('s-error', require('/public/images/diagnose/status-error.png'));
bImageMap.set('s-success-active', require('/public/images/diagnose/status-success-active.png'));
bImageMap.set('s-success', require('/public/images/diagnose/status-success.png'));
bImageMap.set('waiting', require('/public/images/diagnose/waiting.png'));

const statusColor = new Map();
statusColor.set('m-error', '#E50012');
statusColor.set('s-error', '#E50012');
statusColor.set('error', '#E50012');
statusColor.set('s-success-active', '#24B276');
statusColor.set('s-success', '#24B276');
statusColor.set('success', '#24B276');
statusColor.set('waiting', '#FF9000');
statusColor.set('disabled', 'rgba(0, 0, 0, .8)');

const statusText = new Map();
statusText.set('s-error', '连接失败');
statusText.set('s-success-active', '连接成功');
statusText.set('s-success', '连接成功');
statusText.set('waiting', '诊断中');
statusText.set('disabled', '诊断中');

const Diagnose = () => {
  const [current, setCurrent] = useState<string>('status');
  const [status, setStatus] = useState<string>('waiting');
  const [message, setMessage] = useState<string>('waiting');
  const [active, setActive] = useState<boolean>(false);

  const [up, setUp] = useState<'success' | 'error' | 'waiting'>('waiting');
  const [down, setDown] = useState<'success' | 'error' | 'waiting'>('waiting');

  const list = [
    {
      key: 'status',
      tab: '连接状态',
      component: (
        <div
          style={{ backgroundImage: `url(${bImageMap.get(status)}`, backgroundSize: '100% 100%' }}
          className="item-box"
        >
          <div className="item-title">连接状态</div>
          <div style={{ color: statusColor.get(status) }} className="item-context">
            <Badge color={statusColor.get(status)} /> {statusText.get(status)}
          </div>
        </div>
      ),
    },
    {
      key: 'message',
      tab: '消息通信',
      component: (
        <div
          style={
            message !== 'disabled'
              ? {
                  backgroundImage: `url(${bImageMap.get(message)})`,
                  backgroundSize: '100% 100%',
                }
              : {
                  backgroundColor: 'rgba(0, 0, 0, .08)',
                  borderLeft: '2px solid rgba(0, 0, 0, .8)',
                  cursor: 'not-allowed',
                }
          }
          className="item-box"
        >
          <div className="item-title">消息通信</div>
          <div
            className={classNames('item-context', message !== 'disabled' ? 'item-message' : '')}
            style={{ fontWeight: 400 }}
          >
            {message === 'disabled' ? (
              <Tooltip title={'设备未上线时消息通信功不能使用'}>
                <span style={{ color: statusColor.get(message) }}>
                  <Badge color={statusColor.get(message)} />
                  {status === 's-error' || status === 'waiting' ? '等待设备连接' : '连接中'}
                </span>
              </Tooltip>
            ) : (
              <>
                <div>
                  <Badge
                    color={statusColor.get(up)}
                    text={
                      up === 'waiting'
                        ? `上行消息通信诊断中`
                        : `上行消息通信${up === 'error' ? '异常' : '正常'}`
                    }
                  />
                </div>
                <div>
                  <Badge
                    color={statusColor.get(down)}
                    text={
                      down === 'waiting'
                        ? `下行消息通信诊断中`
                        : `下行消息通信${down === 'error' ? '异常' : '正常'}`
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>
      ),
    },
  ];
  useEffect(() => {
    return () => {
      Store.set('diagnose', []);
      Store.set('diagnose-status', []);
      DiagnoseStatusModel.model = true;
    };
  }, []);
  return (
    <Card>
      <div className={current === 'message' ? 'header-message' : 'header'}>
        <Row gutter={24} style={{ padding: 10 }}>
          {list.map((item: ListProps) => (
            <Col
              span={8}
              key={item.key}
              onClick={() => {
                if (current === item.key) {
                  return;
                }
                if (item.key === 'message' && status === 's-success-active') {
                  setCurrent(item.key);
                  setMessage('waiting');
                }
                if (item.key === 'status') {
                  setActive(true);
                  setCurrent(item.key);
                }
              }}
            >
              {item.component}
            </Col>
          ))}
        </Row>
      </div>
      <div className="container">
        {current === 'status' ? (
          <Status
            flag={active}
            onChange={(type: string) => {
              if (type === 'success') {
                setStatus('s-success-active');
                setMessage('waiting');
              } else if (type === 'error') {
                setStatus('s-error');
                setMessage('disabled');
              } else if (type === 'loading') {
                setStatus('waiting');
                setMessage('disabled');
              }
            }}
          />
        ) : (
          <Message
            onChange={(data: string) => {
              if (data === 'waiting') {
                setMessage('waiting');
                setDown('waiting');
                setUp('waiting');
              } else if (data === 'down-error') {
                setMessage('m-error');
                setDown('error');
              } else if (data === 'down-success') {
                setMessage('s-success-active');
                setDown('success');
              } else if (data === 'up-success') {
                setMessage('s-success-active');
                setUp('success');
              } else if (data === 'up-error') {
                setMessage('m-error');
                setUp('error');
              }
            }}
          />
        )}
      </div>
    </Card>
  );
};

export default Diagnose;
