import React from 'react';
import { Ellipsis, TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';
import { NetworkItem } from '@/pages/link/Type/typings';
import { networkMap } from '@/pages/link/Type';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { Tooltip } from 'antd';

export interface NoticeCardProps extends NetworkItem {
  detail?: React.ReactNode;
  actions?: React.ReactNode[];
  avatarSize?: number;
}

const image = require('/public/images/network.png');

export default (props: NoticeCardProps) => {
  const createDetail = () => {
    const record = props;
    if (record.shareCluster) {
      const host = record.configuration?.publicHost || record.configuration?.remoteHost;
      const port = record.configuration?.publicPort || record.configuration?.remotePort;
      return host ? (
        <>
          {networkMap[record.type]}
          {host}:{port}
        </>
      ) : null;
    } else {
      const log = record.cluster?.map(
        (item) =>
          `${item.configuration?.publicHost || item.configuration?.remoteHost}:${
            item.configuration?.publicPort || item.configuration?.remotePort
          }`,
      );
      return (
        <>
          {log.map((item) => (
            <div key={item}>
              {networkMap[record.type]}
              {item}
            </div>
          ))}
        </>
      );
    }
  };
  return (
    <TableCard
      detail={props.detail}
      actions={props.actions}
      status={props.state.value}
      statusText={props.state.text}
      statusNames={{
        disabled: StatusColorEnum.error,
        enabled: StatusColorEnum.success,
      }}
      showMask={false}
    >
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <img width={88} height={88} src={image} alt={props.type} />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            {/*<span className={'card-item-header-name ellipsis'}>*/}
            {/*  <Tooltip title={props.name}>{props.name}</Tooltip>*/}
            {/*</span>*/}
            <Ellipsis title={props.name} titleClassName={'card-item-header-name'} />
          </div>
          <div className={'card-item-content'}>
            <div>
              <label>类型</label>
              <Ellipsis title={props?.type} />
              {/*<div className={'ellipsis'}>*/}
              {/*  <Tooltip title={props?.type}>{props.type}</Tooltip>*/}
              {/*</div>*/}
            </div>
            <div>
              <label>详情</label>
              <Tooltip title={createDetail()}>
                <div className={'ellipsis'}>{createDetail()}</div>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
