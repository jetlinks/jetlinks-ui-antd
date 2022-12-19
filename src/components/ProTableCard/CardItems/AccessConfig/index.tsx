import React from 'react';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { Ellipsis, TableCard } from '@/components';
import '@/style/common.less';
import { Badge, Tooltip } from 'antd';
import type { AccessItem } from '@/pages/link/AccessConfig/typings';
import './index.less';
import classNames from 'classnames';
import { Store } from 'jetlinks-store';
import { CheckOutlined } from '@ant-design/icons';

export interface AccessConfigCardProps extends AccessItem {
  detail?: React.ReactNode;
  actions?: React.ReactNode[];
  avatarSize?: number;
  showTool?: boolean;
  activeStyle?: string;
  showMask?: boolean;
}

const defaultImage = require('/public/images/device-access.png');

export default (props: AccessConfigCardProps) => {
  return (
    <TableCard
      showMask={props.showMask}
      detail={props.detail}
      actions={props.actions}
      status={props.state.value}
      statusText={props.state.text}
      statusNames={{
        enabled: StatusColorEnum.success,
        disabled: StatusColorEnum.error,
      }}
      showTool={props.showTool}
      contentClassName={props.state.value === 'disabled' ? 'tableCardDisabled' : 'tableCardEnabled'}
      className={classNames('access-config-card-item', props.activeStyle)}
    >
      <div className="context-access">
        <div>
          <img width={88} height={88} src={defaultImage} alt={''} />
        </div>
        <div className="card">
          <div className="header">
            {/*<div className="access-title ellipsis">*/}
            {/*  <Tooltip placement="topLeft" title={props.name}>*/}
            {/*    {props.name}*/}
            {/*  </Tooltip>*/}
            {/*</div>*/}
            <div style={{ width: 'calc(100% - 70px)' }} className={'access-title'}>
              <Ellipsis title={props.name} />
            </div>
          </div>
          {(props.protocolDetail?.name || props?.channelInfo?.name) && (
            <div className="container">
              {props?.channelInfo?.name && (
                <div className="server">
                  <div className="subTitle">{props?.channelInfo?.name}</div>
                  <Tooltip
                    placement="topLeft"
                    title={
                      <div>
                        {[...props.channelInfo?.addresses].map((i: any, index: number) => (
                          <div key={i.address + `_address${index}`}>
                            <Badge color={i.health === -1 ? 'red' : 'green'} />
                            {i.address}
                          </div>
                        ))}
                      </div>
                    }
                  >
                    <div className="serverItem">
                      {props.channelInfo?.addresses.slice(0, 1).map((i: any, index: number) => (
                        <div className="subItem" key={i.address + `_address${index}`}>
                          <Badge color={i.health === -1 ? 'red' : 'green'} />
                          {i.address}
                        </div>
                      ))}
                    </div>
                  </Tooltip>
                </div>
              )}
              {props.protocolDetail?.name && (
                <div className="procotol">
                  <div className="subTitle">协议</div>
                  <div className="desc">
                    <Ellipsis
                      title={props.protocolDetail?.name}
                      tooltip={{ placement: 'topLeft' }}
                    />
                    {/*<Tooltip placement="topLeft" title={props.protocolDetail?.name}>*/}
                    {/*  {props.protocolDetail?.name}*/}
                    {/*</Tooltip>*/}
                  </div>
                </div>
              )}
            </div>
          )}
          <Ellipsis
            title={
              !!props?.description
                ? props?.description
                : (Store.get('access-providers') || []).find((i: any) => i?.id === props?.provider)
                    ?.description
            }
            tooltip={{
              placement: 'topLeft',
            }}
            titleClassName={'desc'}
          />
          {/*<div className="desc ellipsis">*/}
          {/*  {!!props?.description ? (*/}
          {/*    <Tooltip placement="topLeft" title={props?.description}>*/}
          {/*      {props?.description}*/}
          {/*    </Tooltip>*/}
          {/*  ) : (*/}
          {/*    <Tooltip*/}
          {/*      placement="topLeft"*/}
          {/*      title={*/}
          {/*        (Store.get('access-providers') || []).find((i: any) => i?.id === props?.provider)*/}
          {/*          ?.description*/}
          {/*      }*/}
          {/*    >*/}
          {/*      {*/}
          {/*        (Store.get('access-providers') || []).find((i: any) => i?.id === props?.provider)*/}
          {/*          ?.description*/}
          {/*      }*/}
          {/*    </Tooltip>*/}
          {/*  )}*/}
          {/*</div>*/}
        </div>
      </div>
      <div className={'checked-icon'}>
        <div>
          <CheckOutlined />
        </div>
      </div>
    </TableCard>
  );
};
