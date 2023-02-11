import React, { useState } from 'react';
import { StatusColorEnum } from '@/components/BadgeStatus';
import { Ellipsis, TableCard } from '@/components';
import '@/style/common.less';
import '../../index.less';
import styles from './index.less';
import type { SceneItem } from '@/pages/rule-engine/Scene/typings';
import { CheckOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { ActionsType, BranchesThen, Executor } from '@/pages/rule-engine/Scene/typings';
import MyTooltip from './MyTooltip';
import { handleOptionsLabel } from '@/pages/rule-engine/Scene/Save/terms/paramsItem';
import { isArray } from 'lodash';
import TriggerAlarm from '@/pages/rule-engine/Scene/Save/action/TriggerAlarm';
import { getMenuPathByCode, getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { history } from 'umi';

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
        return (
          <span>通过群机器人消息发送{data?.options?.templateName || data?.notify?.templateId}</span>
        );
      }
      return (
        <span>
          通过钉钉 向 {data?.options?.orgName || ''}
          {data?.options?.tagName || ''}
          {data?.options?.sendTo || ''}
          发送
          {data?.options?.templateName || data?.notify?.templateId}
        </span>
      );
    case 'weixin':
      return (
        <span>
          通过微信向{data?.options?.sendTo || ''}
          {data?.options?.orgName || ''}
          {data?.options?.tagName || ''}发送
          {data?.options?.templateName || data?.notify?.templateId}
        </span>
      );
    case 'email':
      return (
        <span>
          通过邮件向{data?.options?.sendTo || ''}发送
          {data?.options?.templateName || data?.notify?.templateId}
        </span>
      );
    case 'voice':
      return (
        <span>
          通过语音向{data?.options?.sendTo || ''}发送
          {data?.options?.templateName || data?.notify?.templateId}
        </span>
      );
    case 'sms':
      return (
        <span>
          通过短信向{data?.options?.sendTo || ''}发送
          {data?.options?.templateName || data?.notify?.templateId}
        </span>
      );
    case 'webhook':
      return <span>通过webhook发送{data?.options?.templateName || data?.notify?.templateId}</span>;
    default:
      return null;
  }
};

const notifyTextRender = (data: ActionsType | undefined) => {
  switch (data?.notify?.notifyType) {
    case 'dingTalk':
      if (data?.options?.provider === 'dingTalkRobotWebHook') {
        return (
          <span>通过群机器人消息发送{data?.options?.templateName || data?.notify?.templateId}</span>
        );
      }
      return (
        <span>
          通过钉钉向{data?.options?.notifierName || data?.notify?.notifierId}发送
          {data?.options?.templateName || data?.notify?.templateId}
        </span>
      );
    case 'weixin':
      return (
        <span>
          通过微信向{data?.options?.sendTo || ''}
          {data?.options?.orgName || ''}
          {data?.options?.tagName || ''}发送
          {data?.options?.templateName || data?.notify?.templateId}
        </span>
      );
    case 'email':
      return (
        <span>
          通过邮件向{data?.options?.sendTo || ''}发送
          {data?.options?.templateName || data?.notify?.templateId}
        </span>
      );
    case 'voice':
      return (
        <span>
          通过语音向{data?.options?.sendTo || ''}发送
          {data?.options?.templateName || data?.notify?.templateId}
        </span>
      );
    case 'sms':
      return (
        <span>
          通过短信向{data?.options?.sendTo || ''}发送
          {data?.options?.templateName || data?.notify?.templateId}
        </span>
      );
    case 'webhook':
      return <span>通过webhook发送{data?.options?.templateName || data?.notify?.templateId}</span>;
    default:
      return null;
  }
};

const deviceRender = (data: ActionsType | undefined) => {
  switch (data?.device?.selector) {
    case 'fixed':
      return (
        <span>
          {data?.options?.type}
          <a
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {data?.options?.name}
          </a>
          {data?.options?.properties}
        </span>
      );
    case 'tag':
      let tags: string = '';
      data.options?.taglist?.map((item: any) => {
        tags += item.type || '' + item.name || '' + item.value || '';
      });
      return (
        <span>
          {data?.options?.type}
          {tags}
          <a
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {data?.options?.productName}
          </a>
          {data?.options?.properties}
        </span>
      );
    case 'relation':
      return (
        <span>
          {data?.options?.type}与
          <a
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {data?.options?.triggerName}
          </a>
          具有相同{data?.options?.relationName}的
          <a
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {data?.options?.productName}
          </a>
          设备的{data?.options?.properties}
        </span>
      );
    default:
      return null;
  }
};
const deviceTextRender = (data: ActionsType | undefined) => {
  switch (data?.device?.selector) {
    case 'fixed':
      return (
        <span>
          {data?.options?.type}
          {data?.options?.name}
          {data?.options?.properties}
        </span>
      );
    case 'tag':
      let tags: string = '';
      data.options?.taglist?.map((item: any) => {
        tags += item.type || '' + item.name || '' + item.value || '';
      });
      return (
        <span>
          {data?.options?.type}
          {tags}
          {data?.options?.productName}
          {data?.options?.properties}
        </span>
      );
    case 'relation':
      return (
        <span>
          {data?.options?.type}与{data?.options?.triggerName}具有相同{data?.options?.relationName}的
          {data?.options?.productName}设备的{data?.options?.properties}
        </span>
      );
    default:
      return null;
  }
};

const actionTextRender = (action: ActionsType) => {
  switch (action?.executor) {
    case 'notify':
      return notifyTextRender(action);
    case 'delay':
      return `${action?.delay?.time}${UnitEnum[action?.delay?.unit || '']}后执行后续动作`;
    case 'device':
      return deviceTextRender(action);
    case 'alarm':
      if (action?.alarm?.mode === 'relieve') {
        return '满足条件后将解除关联此场景的告警';
      }
      return '满足条件后将触发关联此场景的告警';
    default:
      return null;
  }
};

interface ActionComponentProps {
  action: ActionsType;
  triggerChange: (type: keyof typeof Executor) => void;
}

const ActionComponentRender = (props: ActionComponentProps) => {
  const { action, triggerChange } = props;
  // TODO 执行动作跳转
  switch (action?.executor) {
    case 'notify':
      return notifyRender(action);
    case 'delay':
      return (
        <span>{`${action?.delay?.time}${UnitEnum[action?.delay?.unit || '']}后执行后续动作`}</span>
      );
    case 'device':
      return deviceRender(action);
    case 'alarm':
      return (
        <span>
          {action?.alarm?.mode === 'relieve' ? (
            <>
              满足条件后将解除
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  triggerChange(action?.executor);
                }}
              >
                关联此场景的告警
              </a>
            </>
          ) : (
            <>
              满足条件后将触发
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  triggerChange(action?.executor);
                }}
              >
                关联此场景的告警
              </a>
            </>
          )}
        </span>
      );
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

interface BranchesActionProps {
  actions: any[];
  triggerChange: (type: keyof typeof Executor) => void;
}
const BranchesActionRender = (props: BranchesActionProps) => {
  const { actions, triggerChange } = props;
  if (actions && actions?.length) {
    const list = actions.slice(0, 3);
    return (
      <div className={classNames(styles['right-item-right-item-contents-text'])}>
        {list.map((item, index) => {
          const isLast = index < actions.length - 1;
          return (
            <div className={styles['right-item-right-item-contents-item']}>
              <MyTooltip placement={'topLeft'} title={actionTextRender(item)}>
                <div
                  className={classNames(
                    styles['right-item-right-item-contents-item-action'],
                    styles['item-ellipsis'],
                  )}
                >
                  <ActionComponentRender action={item} triggerChange={triggerChange} />
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
        })}
      </div>
    );
  } else {
    return null;
  }
};

const TriggerRender = (data: SceneCardProps) => {
  const trigger = data?.options?.trigger;
  return (
    <div className={classNames(styles['card-item-content-trigger'])}>
      {trigger?.name && (
        <MyTooltip placement="topLeft" title={trigger?.name || ''}>
          <div
            className={classNames(styles['card-item-content-trigger-item'], 'ellipsis')}
            style={{ maxWidth: '15%', color: 'rgba(47, 84, 235)', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              // TODO 触发条件跳转
              if (data.triggerType === 'device') {
                if (data.trigger?.device?.selector === 'fixed') {
                  // 自定义
                  //selectorValues
                  if (!!getMenuPathByCode(MENUS_CODE['device/Instance'])) {
                    const url = getMenuPathByParams(
                      MENUS_CODE['device/Instance/Detail'],
                      data.trigger?.device?.selectorValues[0]?.value,
                    );
                    if (url) {
                      history.replace(url);
                    }
                  }
                } else if (data.trigger?.device?.selector === 'org') {
                  // 组织
                } else if (data.trigger?.device?.selector === 'all') {
                  // 产品
                  if (!!getMenuPathByCode(MENUS_CODE['device/Product'])) {
                    const url = getMenuPathByParams(
                      MENUS_CODE['device/Product/Detail'],
                      data.trigger?.device?.productId,
                    );
                    if (url) {
                      history.replace(url);
                    }
                  }
                }
              }
            }}
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
            style={{ maxWidth: '30%' }}
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
            style={{ maxWidth: '20%' }}
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
  );
};

export interface ActionRenderProps extends SceneCardProps {
  triggerChange: (type: keyof typeof Executor) => void;
}
const ActionRender = (data: ActionRenderProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const type = data.triggerType;

  return (
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
                  {/*触发条件*/}
                  {type === 'device' && (item.shakeLimit?.enabled || data.options?.when?.[index]) && (
                    <div
                      className={styles['right-item-left']}
                      style={{
                        maxWidth: Array.isArray(item.then) && item?.then.length ? '15%' : '100%',
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
                  {/*执行动作*/}
                  {Array.isArray(item.then) && item?.then.length ? (
                    <div
                      className={styles['right-item-right']}
                      style={{ maxWidth: type === 'device' ? '85%' : '100%' }}
                    >
                      {(item?.then || []).map((i: BranchesThen, _index: number) => {
                        if (Array.isArray(i?.actions) && i?.actions.length) {
                          return (
                            <div key={i?.key || _index} className={styles['right-item-right-item']}>
                              {item?.then?.length > 1 && (
                                <div className={styles['trigger-ways']}>
                                  {i ? (i.parallel ? '并行执行' : '串行执行') : ''}
                                </div>
                              )}
                              {Array.isArray(i?.actions) && (
                                <div
                                  className={classNames(styles['right-item-right-item-contents'])}
                                >
                                  <div
                                    className={classNames(
                                      styles['right-item-right-item-contents-text'],
                                    )}
                                  >
                                    <BranchesActionRender
                                      actions={i?.actions}
                                      triggerChange={data.triggerChange}
                                    />
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
  );
};

const ContentRender = (data: ActionRenderProps) => {
  const type = data.triggerType;
  if (!!type && (data.branches || [])?.length) {
    return (
      <div className={styles['card-item-content-box']}>
        <TriggerRender {...data} />
        <ActionRender {...data} triggerChange={data.triggerChange} />
      </div>
    );
  } else {
    return <div className={styles['card-item-content-box-empty']}>未配置规则</div>;
  }
};

export const ExtraSceneCard = (props: SceneCardProps) => {
  const [triggerVisible, setTriggerVisible] = useState<boolean>(false);
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
          <ContentRender
            {...props}
            triggerChange={() => {
              setTriggerVisible(true);
            }}
          />
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
      {triggerVisible && (
        <TriggerAlarm
          id={props.id}
          close={() => {
            setTriggerVisible(false);
          }}
        />
      )}
    </TableCard>
  );
};

export default (props: SceneCardProps) => {
  const [triggerVisible, setTriggerVisible] = useState<boolean>(false);
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
          <ContentRender
            {...props}
            triggerChange={() => {
              setTriggerVisible(true);
            }}
          />
        </div>
      </div>
      <div className={styles['card-item-trigger-type']}>
        <div className={styles['card-item-trigger-type-text']}>
          <img height={16} src={iconMap.get(props.triggerType)} style={{ marginRight: 8 }} />
          {TriggerWayType[props.triggerType]}
        </div>
      </div>
      {triggerVisible && (
        <TriggerAlarm
          id={props.id}
          close={() => {
            setTriggerVisible(false);
          }}
        />
      )}
    </TableCard>
  );
};
