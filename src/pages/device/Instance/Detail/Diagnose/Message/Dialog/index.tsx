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

  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div className={classNames('dialog-item', { 'dialog-active': !data.upstream })} key={data.key}>
      <div className="dialog-card">
        <div
          className="dialog-icon"
          onClick={() => {
            setVisible(!visible);
          }}
        >
          {visible ? <DownOutlined /> : <RightOutlined />}
        </div>
        <div className="dialog-box">
          <div className="dialog-header">
            <div className="dialog-title">
              <Badge color={statusColor.get(data.error ? 'error' : 'success')} />
              {operationMap.get(data.operation) || data?.operation}
            </div>
            <div className="dialog-time">{moment(data.endTime).format('YYYY-MM-DD HH:mm:ss')}</div>
          </div>
          {visible && (
            <div className="dialog-editor">
              <Input.TextArea autoSize bordered={false} value={data?.detail} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
