import React from 'react';
import { Ellipsis, PermissionButton, TableCard } from '@/components';
import '@/style/common.less';
import '../index.less';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { Store } from 'jetlinks-store';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import { useHistory } from 'umi';

export interface AlarmConfigProps extends ConfigurationItem {
  detail?: React.ReactNode;
  actions?: React.ReactNode[];
  avatarSize?: number;
}

export const aliyunSms = require('/public/images/alarm/alarm-config.png');

export default (props: AlarmConfigProps) => {
  const history = useHistory();
  return (
    <TableCard
      actions={props.actions}
      detail={props.detail}
      status={props.state?.value}
      statusText={props.state?.text}
      statusNames={{
        enabled: StatusColorEnum.success,
        disabled: StatusColorEnum.error,
      }}
      showMask={false}
    >
      <div className={'pro-table-card-item'}>
        <div className={'card-item-avatar'}>
          <img width={88} height={88} src={aliyunSms} alt={''} />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            {/*<span className={'card-item-header-name ellipsis'}>*/}
            {/*  <Tooltip title={props?.name}>{props?.name}</Tooltip>*/}
            {/*</span>*/}
            <Ellipsis title={props?.name} titleClassName={'card-item-header-name'} />
          </div>
          <div className={'card-item-content'}>
            <div>
              <label>关联场景联动</label>
              <div className={'ellipsis'}>
                <PermissionButton
                  type={'link'}
                  isPermission={!!getMenuPathByCode(MENUS_CODE['rule-engine/Scene'])}
                  style={{ padding: 0, height: 'auto' }}
                  tooltip={{
                    title: !!getMenuPathByCode(MENUS_CODE['rule-engine/Scene'])
                      ? props?.sceneName
                      : '没有权限，请联系管理员',
                  }}
                  onClick={() => {
                    const url = getMenuPathByCode('rule-engine/Scene/Save');
                    history.push(`${url}?id=${props.sceneId}`);
                  }}
                >
                  {props?.sceneName || ''}
                </PermissionButton>
              </div>
            </div>
            <div>
              <label>告警级别</label>
              <Ellipsis
                title={
                  (Store.get('default-level') || []).find(
                    (item: any) => item?.level === props?.level,
                  )?.title || props?.level
                }
              />
              {/*<div className={'ellipsis'}>*/}
              {/*  <Tooltip*/}
              {/*    title={*/}
              {/*      (Store.get('default-level') || []).find(*/}
              {/*        (item: any) => item?.level === props?.level,*/}
              {/*      )?.title || props?.level*/}
              {/*    }*/}
              {/*  >*/}
              {/*    {(Store.get('default-level') || []).find(*/}
              {/*      (item: any) => item?.level === props?.level,*/}
              {/*    )?.title || props?.level}*/}
              {/*  </Tooltip>*/}
              {/*</div>*/}
            </div>
          </div>
        </div>
      </div>
    </TableCard>
  );
};
