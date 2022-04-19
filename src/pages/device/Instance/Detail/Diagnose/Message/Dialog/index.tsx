import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Badge, Input } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import { useState } from 'react';
// import ReactJson from 'react-json-view';
import './index.less';

interface Props {
  data: any;
}

const Dialog = (props: Props) => {
  const { data } = props;
  const operationMap = new Map();
  operationMap.set('connection', '连接');
  operationMap.set('auth', '权限验证');
  operationMap.set('decode', '解码');
  operationMap.set('encode', '编码');
  operationMap.set('request', '请求');
  operationMap.set('response', '响应');
  operationMap.set('downstream', '下行消息');
  operationMap.set('upstream', '上行消息');

  const statusColor = new Map();
  statusColor.set('error', '#E50012');
  statusColor.set('success', '#24B276');

  const [visible, setVisible] = useState<string[]>([]);

  return (
    <div className={classNames('dialog-item', { 'dialog-active': !data?.upstream })} key={data.key}>
      <div className="dialog-card">
        {data.list.map((item: any) => (
          <div key={item.key} className="dialog-list">
            <div
              className="dialog-icon"
              onClick={() => {
                const index = visible.indexOf(item.key);
                if (index === -1) {
                  visible.push(item.key);
                } else {
                  visible.splice(index, 1);
                }
                setVisible([...visible]);
              }}
            >
              {visible.includes(item.key) ? <DownOutlined /> : <RightOutlined />}
            </div>
            <div className="dialog-box">
              <div className="dialog-header">
                <div className="dialog-title">
                  <Badge color={statusColor.get(item.error ? 'error' : 'success')} />
                  {operationMap.get(item.operation) || item?.operation}
                </div>
                <div className="dialog-time">
                  {moment(item.endTime).format('YYYY-MM-DD HH:mm:ss')}
                </div>
              </div>
              {visible.includes(item.key) && (
                <div className="dialog-editor">
                  <Input.TextArea autoSize bordered={false} value={item?.detail} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dialog;
