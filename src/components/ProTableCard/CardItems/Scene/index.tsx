import React, { useState } from 'react';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { Ellipsis, TableCard } from '@/components';
import '@/style/common.less';
import '../../index.less';
import styles from './index.less';
import type { SceneItem } from '@/pages/rule-engine/Scene/typings';
import { CheckOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { ActionsType, BranchesThen } from '@/pages/rule-engine/Scene/typings';
import MyTooltip from './MyTooltip';
import { handleOptionsLabel } from '@/pages/rule-engine/Scene/Save/terms/paramsItem';
import { isArray } from 'lodash';

const imageMap = new Map();
imageMap.set('timer', require('/public/images/scene/scene-timer.png'));
imageMap.set('manual', require('/public/images/scene/scene-hand.png'));
imageMap.set('device', require('/public/images/scene/scene-device.png'));

export const iconMap = new Map();
iconMap.set('timer', require('/public/images/scene/trigger-type-icon/timing.png'));
iconMap.set('manual', require('/public/images/scene/trigger-type-icon/manual.png'));
iconMap.set('device', require('/public/images/scene/trigger-type-icon/device.png'));

// @ts-ignore
export interface SceneCardProps extends SceneItem {
  detail?: React.ReactNode;
  tools?: React.ReactNode[];
  avatarSize?: number;
  className?: string;
  onUnBind?: (e: any) => void;
  showBindBtn?: boolean;
  cardType?: 'bind' | 'unbind';
  showTool?: boolean;
  onClick?: () => void;
}

export enum TriggerWayType {
  manual = '手动触发',
  timer = '定时触发',
  device = '设备触发',
}

enum UnitEnum {
  seconds = '秒',
  minutes = '分',
  hours = '小时',
}

const notifyRender = (data: ActionsType | undefined) => {
  switch (data?.notify?.notifyType) {
    case 'dingTalk':
      if (data?.options?.provider === 'dingTalkRobotWebHook') {
        return `通过群机器人消息发送${data?.options?.templateName || data?.notify?.templateId}`;
      }
      return `通过钉钉向${data?.options?.notifierName || data?.notify?.notifierId}发送${
        data?.options?.templateName || data?.notify?.templateId
      }`;
    case 'weixin':
      return `通过微信向${data?.options?.sendTo || ''}${data?.options?.orgName || ''}${
        data?.options?.tagName || ''
      }发送${data?.options?.templateName || data?.notify?.templateId}`;
    case 'email':
      return `通过邮件向${data?.options?.sendTo || ''}发送${
        data?.options?.templateName || data?.notify?.templateId
      }`;
    case 'voice':
      return `通过语音向${data?.options?.sendTo || ''}发送 ${
        data?.options?.templateName || data?.notify?.templateId
      }`;
    case 'sms':
      return `通过短信向${data?.options?.sendTo || ''}发送${
        data?.options?.templateName || data?.notify?.templateId
      }`;
    case 'webhook':
      return `通过webhook发送${data?.options?.templateName || data?.notify?.templateId}`;
    default:
      return null;
  }
};

const deviceRender = (data: ActionsType | undefined) => {
  switch (data?.device?.selector) {
    case 'fixed':
      return `${data?.options?.type}${data?.options?.name}${data?.options?.properties}`;
    case 'tag':
      let tags: string = '';
      data.options?.taglist.map((item: any) => {
        tags += item.type || '' + item.name || '' + item.value || '';
      });
      return `${
        data?.options?.type + tags + data?.options?.productName + data?.options?.properties
      }`;
    case 'relation':
      return `${data?.options?.type}与${data?.options?.triggerName}具有相同${data?.options?.relationName}的${data?.options?.productName}设备的${data?.options?.properties}`;
    default:
      return null;
  }
};

const actionRender = (action: ActionsType) => {
  switch (action?.executor) {
    case 'notify':
      return notifyRender(action);
    case 'delay':
      return `${action?.delay?.time}${UnitEnum[action?.delay?.unit || '']}后执行后续动作`;
    case 'device':
      return deviceRender(action);
    case 'alarm':
      if (action?.alarm?.mode === 'relieve') {
        return '满足条件后将解除关联此场景的告警';
      }
      return '满足条件后将触发关联此场景的告警';
    default:
      return null;
  }
};
// 过滤器
const actionFilter = (terms: any, isLast: boolean, index: number) => {
  if (!Array.isArray(terms)) return '';
  let str = `动作${index + 1} `;
  terms?.forEach((item: any, iindex: number) => {
    if (isArray(item.terms)) {
      item.terms.map((iItem: number, iIndex: number) => {
        const _isLast = iIndex < item.terms.length - 1;
        str += `${handleOptionsLabel(iItem, _isLast ? item.terms[iIndex + 1]?.[3] : undefined)}`;
      });
    }
    str += iindex < terms.length - 1 ? terms[iindex + 1].termType : '';
  });

  return str;
};

const conditionsRender = (when: any[], index: number) => {
  let whenStr: string = '';
  if (
    when.length &&
    when[index] &&
    (when[index]?.terms).length &&
    when[index]?.terms[0]?.terms?.length
  ) {
    const terms = when[index]?.terms || [];
    const termsLength = terms.length;
    terms.map((termsItem: any, tIndex: number) => {
      const tLast = tIndex < termsLength - 1;
      let tSer = '';
      if (termsItem.terms) {
        tSer = isArray(termsItem.terms)
          ? termsItem.terms
              .map((bTermItem: any, bIndex: number) => {
                const bLast = bIndex < termsItem.terms.length - 1;
                return handleOptionsLabel(bTermItem, bLast ? termsItem.terms[bIndex + 1]?.[3] : '');
              })
              .join('')
          : '';
        whenStr += !tLast ? tSer : tSer + terms[tIndex + 1].termType;
      }
    });
    return whenStr;
  }
  return whenStr;
};

const branchesActionRender = (actions: any[]) => {
  if (actions && actions?.length) {
    const list = actions.slice(0, 3);
    return list.map((item, index) => {
      const isLast = index < actions.length - 1;
      return (
        <div
          className={styles['right-item-right-item-contents-item']}
          style={{ maxWidth: `(${100 / list.length})%` }}
        >
          <MyTooltip placement={'topLeft'} title={actionRender(item)}>
            <div
              className={classNames(
                styles['right-item-right-item-contents-item-action'],
                styles['item-ellipsis'],
              )}
            >
              {actionRender(item)}
            </div>
          </MyTooltip>
          <MyTooltip
            placement={'topLeft'}
            title={actionFilter(actions[index]?.options?.terms, isLast, index)}
          >
            <div
              className={classNames(
                styles['right-item-right-item-contents-item-filter'],
                styles['item-ellipsis'],
              )}
            >
              {actionFilter(actions[index]?.options?.terms, isLast, index)}
            </div>
          </MyTooltip>
        </div>
      );
    });
  }
  return '';
};

const ContentRender = (data: SceneCardProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const type = data.triggerType;

  if (!!type && (data.branches || [])?.length) {
    const trigger = data?.options?.trigger;
    return (
      <div className={styles['card-item-content-box']}>
        <div className={classNames(styles['card-item-content-trigger'])}>
          {trigger?.name && (
            <MyTooltip placement="topLeft" title={trigger?.name || ''}>
              <div
                className={classNames(styles['card-item-content-trigger-item'], 'ellipsis')}
                style={{ maxWidth: '15%', color: 'rgba(47, 84, 235)' }}
              >
                {trigger?.name || ''}
              </div>
            </MyTooltip>
          )}
          {trigger?.productName && (
            <MyTooltip placement="topLeft" title={trigger?.productName || ''}>
              <div
                className={classNames(styles['card-item-content-trigger-item'], 'ellipsis')}
                style={{ maxWidth: '15%', color: 'rgba(47, 84, 235)' }}
              >
                {trigger?.productName || ''}
              </div>
            </MyTooltip>
          )}
          {trigger?.when && (
            <MyTooltip placement="topLeft" title={trigger?.when || ''}>
              <div
                className={classNames(styles['card-item-content-trigger-item'], 'ellipsis')}
                style={{ maxWidth: '15%' }}
              >
                {trigger?.when || ''}
              </div>
            </MyTooltip>
          )}
          {trigger?.time && (
            <div className={classNames(styles['card-item-content-trigger-item'])}>
              {trigger?.time || ''}
            </div>
          )}
          {trigger?.extraTime && (
            <div className={classNames(styles['card-item-content-trigger-item'])}>
              {trigger?.extraTime || ''}
            </div>
          )}
          {trigger?.action && (
            <MyTooltip placement="topLeft" title={trigger?.action || ''}>
              <div
                className={classNames(styles['card-item-content-trigger-item'], 'ellipsis')}
                style={{ maxWidth: '15%' }}
              >
                {trigger?.action || ''}
              </div>
            </MyTooltip>
          )}
          {trigger?.type && (
            <div className={classNames(styles['card-item-content-trigger-item'])}>
              {trigger?.type || ''}
            </div>
          )}
        </div>
        <div className={styles['card-item-content-action']}>
          {(visible ? data.branches || [] : (data?.branches || []).slice(0, 2)).map(
            (item: any, index) => {
              return (
                <div className={styles['card-item-content-action-item']} key={item?.key || index}>
                  {type === 'device' && (
                    <div className={styles['card-item-content-action-item-left']}>
                      {index === 0 ? '当' : '否则'}
                    </div>
                  )}
                  <div
                    style={{ width: type === 'device' ? 'calc(100% - 48px)' : '100%' }}
                    className={styles['card-item-content-action-item-right']}
                  >
                    <div className={styles['card-item-content-action-item-right-item']}>
                      {type === 'device' &&
                        (item.shakeLimit?.enabled || data.options?.when?.[index]) && (
                          <div
                            className={styles['right-item-left']}
                            style={{
                              width: Array.isArray(item.then) && item?.then.length ? '15%' : '100%',
                            }}
                          >
                            <MyTooltip
                              placement={'topLeft'}
                              title={conditionsRender(data.options?.when || [], index)}
                            >
                              <div className={classNames(styles['trigger-conditions'], 'ellipsis')}>
                                {conditionsRender(data.options?.when || [], index)}
                              </div>
                            </MyTooltip>
                            {item.shakeLimit?.enabled && (
                              <MyTooltip
                                title={`(${item.shakeLimit?.time}秒内发生${item.shakeLimit?.threshold}
                            次以上时执行一次)`}
                              >
                                <div className={classNames(styles['trigger-shake'], 'ellipsis')}>
                                  ({item.shakeLimit?.time}秒内发生{item.shakeLimit?.threshold}
                                  次以上时执行一次)
                                </div>
                              </MyTooltip>
                            )}
                          </div>
                        )}
                      {Array.isArray(item.then) && item?.then.length ? (
                        <div
                          className={styles['right-item-right']}
                          style={{ width: type === 'device' ? '85%' : '100%' }}
                        >
                          {(item?.then || []).map((i: BranchesThen, _index: number) => {
                            if (Array.isArray(i?.actions) && i?.actions.length) {
                              return (
                                <div
                                  key={i?.key || _index}
                                  className={styles['right-item-right-item']}
                                >
                                  {item?.then?.length > 1 && (
                                    <div className={styles['trigger-ways']}>
                                      {i ? (i.parallel ? '并行执行' : '串行执行') : ''}
                                    </div>
                                  )}
                                  {Array.isArray(i?.actions) && (
                                    <div
                                      className={classNames(
                                        styles['right-item-right-item-contents'],
                                      )}
                                    >
                                      <div
                                        className={classNames(
                                          styles['right-item-right-item-contents-text'],
                                        )}
                                      >
                                        {branchesActionRender(i?.actions)}
                                      </div>
                                      {i?.actions.length > 3 && (
                                        <div
                                          className={classNames(
                                            styles['right-item-right-item-contents-extra'],
                                          )}
                                        >
                                          等{i?.actions.length}个执行动作
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>
              );
            },
          )}
          {(data?.branches || []).length > 2 && (
            <div
              className={styles['trigger-actions-more']}
              onClick={(e) => {
                e.stopPropagation();
                setVisible(!visible);
              }}
            >
              展开更多{!visible ? <DownOutlined /> : <UpOutlined />}
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return <div className={styles['card-item-content-box-empty']}>未配置规则</div>;
  }
};

export const ExtraSceneCard = (props: SceneCardProps) => {
  return (
    <TableCard
      status={props.state.value}
      statusText={props.state.text}
      statusNames={{
        started: StatusColorEnum.success,
        disable: StatusColorEnum.error,
        notActive: StatusColorEnum.warning,
      }}
      showTool={props.showTool}
      showMask={false}
      actions={props.tools}
      onClick={props.onClick}
      className={props.className}
      contentClassName={styles['content-class']}
    >
      <div className={'pro-table-card-item context-access'}>
        <div className={'card-item-avatar'}>
          <img width={88} height={88} src={imageMap.get(props.triggerType)} alt={''} />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            <div className={'card-item-header-item'} style={{ maxWidth: '50%' }}>
              <Ellipsis
                title={props.name}
                style={{ fontSize: 18, opacity: 0.85, color: '#000', fontWeight: 'bold' }}
              />
            </div>
            <div className={'card-item-header-item'} style={{ maxWidth: '50%' }}>
              <Ellipsis
                title={props.description}
                style={{ color: 'rgba(0, 0, 0, 0.65)', margin: '3px 0 0 10px' }}
              />
            </div>
          </div>
          <ContentRender {...props} />
        </div>
      </div>
      <div className={styles['card-item-trigger-type']}>
        <div className={styles['card-item-trigger-type-text']}>
          <img height={16} src={iconMap.get(props.triggerType)} style={{ marginRight: 8 }} />
          {TriggerWayType[props.triggerType]}
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

export default (props: SceneCardProps) => {
  return (
    <TableCard
      showMask={false}
      detail={props.detail}
      showTool={props.showTool}
      actions={props.tools}
      status={props.state.value}
      statusText={props.state.text}
      statusNames={{
        started: StatusColorEnum.success,
        disable: StatusColorEnum.error,
        notActive: StatusColorEnum.warning,
      }}
      contentClassName={styles['content-class']}
    >
      <div className={'pro-table-card-item'} onClick={props.onClick}>
        <div className={'card-item-avatar'}>
          <img width={88} height={88} src={imageMap.get(props.triggerType)} alt={''} />
        </div>
        <div className={'card-item-body'}>
          <div className={'card-item-header'}>
            <div className={'card-item-header-item'} style={{ maxWidth: '50%' }}>
              <Ellipsis
                title={props.name}
                style={{ fontSize: 18, opacity: 0.85, color: '#000', fontWeight: 'bold' }}
              />
            </div>
            <div className={'card-item-header-item'} style={{ maxWidth: '50%' }}>
              <Ellipsis
                title={props.description}
                style={{ color: 'rgba(0, 0, 0, 0.65)', margin: '3px 0 0 10px' }}
              />
            </div>
          </div>
          <ContentRender {...props} />
        </div>
      </div>
      <div className={styles['card-item-trigger-type']}>
        <div className={styles['card-item-trigger-type-text']}>
          <img height={16} src={iconMap.get(props.triggerType)} style={{ marginRight: 8 }} />
          {TriggerWayType[props.triggerType]}
        </div>
      </div>
    </TableCard>
  );
};
