import React from 'react';
import { TableCard } from '@/components';
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
      const publicHost = record.configuration.publicHost;
      const publicPort = record.configuration.publicPort;
      return publicHost ? (
        <>
          {networkMap[record.type]}
          {publicHost}:{publicPort}
        </>
      ) : null;
    } else {
      const log = record.cluster?.map(
        (item) => `${item.configuration.publicHost}:${item.configuration.publicPort}`,
      );
      return (
        <>
          {log.map((item) => (
            <div key={item}>
              `${networkMap[record.type]}${item}`
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
        enabled: StatusColorEnum.processing,
      }}
      // showMask={false}
    >
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <img width={88} height={88} src={image} alt={props.type} />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            <span className={'card-item-header-name ellipsis'}>{props.name}</span>
          </div>
          <div className={'card-item-content'}>
            <div>
              <label>类型</label>
              <div className={'ellipsis'}>{props.type}</div>
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
