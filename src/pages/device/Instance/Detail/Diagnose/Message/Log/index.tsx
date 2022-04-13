import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Input, Tag } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import { useState } from 'react';
import './index.less';

interface Props {
  data: any;
}

const Log = (props: Props) => {
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

  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div className={classNames('log-item')} key={data.id}>
      <div className="log-card">
        <div
          className="log-icon"
          onClick={() => {
            setVisible(!visible);
          }}
        >
          {visible ? <DownOutlined /> : <RightOutlined />}
        </div>
        <div className="log-box">
          <div className="log-header">
            <div className="log-title">
              <Tag color="error">ERROR</Tag>
              {operationMap.get(data.operation)}
            </div>
            <div className="log-time">{moment(data.endTime).format('YYYY-MM-DD HH:mm:ss')}</div>
          </div>
          {visible && (
            <div className="log-editor">
              <Input.TextArea autoSize bordered={false} value={data?.detail} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Log;
