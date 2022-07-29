import { Ellipsis } from '@/components';
import { Badge } from 'antd';
import classNames from 'classnames';
import { useState } from 'react';
import './index.less';
interface Props {
  actions: any;
  onClick: Function;
  active: boolean;
  data: any;
  defaultActiveKey?: any;
}

const ChannelCard = (props: Props) => {
  const [actions, setActions] = useState<boolean>(false);
  const connectImg = require('/public/images/channel/connect.png');
  const disconnectImg = require('/public/images/channel/disconnect.png');

  return (
    <div
      className={classNames('channel-card', {
        active: props.active,
        connect: props.data.state.value === 'enabled',
        disconnect: props.data.state.value === 'disabled',
      })}
      onMouseEnter={() => {
        setActions(true);
      }}
      onMouseLeave={() => {
        setActions(false);
      }}
    >
      <div
        className="channel-card-top"
        onClick={() => {
          props.onClick();
        }}
      >
        <div className="card-top-img">
          <img src={props.data.state.value === 'enabled' ? connectImg : disconnectImg} />
        </div>

        <div className="card-top-name">
          <Ellipsis title={props.data.name} />
        </div>
        <div className="card-top-status">
          {props.data.state.value === 'enabled' ? (
            <Badge status="processing" color={'green'} text={'正常'} />
          ) : (
            <Badge status="error" color={'red'} text={'禁用'} />
          )}
        </div>
      </div>
      {actions && <div className="channel-card-actions">{props.actions}</div>}
    </div>
  );
};
export default ChannelCard;
