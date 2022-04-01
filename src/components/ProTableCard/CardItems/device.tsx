import { Avatar, Card } from 'antd';
import React from 'react';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import { BadgeStatus } from '@/components';
import { StatusColorEnum } from '@/components/BadgeStatus';
// import classNames from 'classnames';
import '../index.less';

export interface DeviceCardProps extends DeviceInstance {
  actions?: React.ReactNode[];
  avatarSize?: number;
  children: React.ReactNode;
}

export default (props: DeviceCardProps) => {
  // const [maskShow, setMaskShow] = useState(false)
  //
  // const maskClassName = classNames('card-mask', { show: maskShow })
  return (
    // <div className={'iot-card'}>
    //   <div className={'card-warp'}>
    //     <div
    //       className={'card-content'}
    //       onMouseEnter={() => {setMaskShow(true)}}
    //       onMouseLeave={() => {setMaskShow(false)}}
    //     >
    //       {
    //         props.children
    //       }
    //       <div
    //         className={
    //           classNames(
    //             'card-state',
    //             {
    //
    //             }
    //           )
    //         }
    //       >
    //         <div className={'card-state-content'}></div>
    //       </div>
    //     </div>
    //     <div className={maskClassName}></div>
    //   </div>
    //   <div className={'card-tools'}>
    //
    //   </div>
    // </div>
    <Card style={{ width: '100%' }} cover={null} actions={props.actions}>
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <Avatar size={props.avatarSize || 64} src={props.photoUrl} />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            <span className={'card-item-header-name ellipsis'}>{props.name}</span>
            <BadgeStatus
              status={props.state.value}
              text={props.state.text}
              statusNames={{
                online: StatusColorEnum.success,
                offline: StatusColorEnum.error,
                notActive: StatusColorEnum.processing,
              }}
            />
          </div>
          <div className={'card-item-content'}>
            <label>设备类型：</label>
            <span className={'ellipsis'}>{props.deviceType ? props.deviceType.text : '--'}</span>
          </div>
          <div className={'card-item-content'}>
            <label>产品名称：</label>
            <span className={'ellipsis'}>{props.productName || '--'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
