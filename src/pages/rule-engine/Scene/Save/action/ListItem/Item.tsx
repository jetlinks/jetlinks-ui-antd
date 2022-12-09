import { useEffect, useState, useRef } from 'react';
import Modal, { ActionTypeComponent } from '../Modal/add';
import type { ActionsType } from '@/pages/rule-engine/Scene/typings';
import { DeleteOutlined } from '@ant-design/icons';
import './index.less';
import TriggerAlarm from '../TriggerAlarm';
import { AddButton } from '@/pages/rule-engine/Scene/Save/components/Buttons';
import FilterCondition from './FilterCondition';
import { set } from 'lodash';
import { Popconfirm } from 'antd';

export enum ParallelEnum {
  'parallel' = 'parallel',
  'serial' = 'serial',
}

export type ParallelType = keyof typeof ParallelEnum;

interface ItemProps {
  thenName: number;
  branchGroup?: number;
  name: number;
  data: ActionsType;
  type: ParallelType;
  parallel: boolean;
  options: any;
  onUpdate: (data: any, options: any) => void;
  onDelete: () => void;
}

const iconMap = new Map();
iconMap.set('trigger', require('/public/images/scene/action-bind-icon.png'));
iconMap.set('notify', require('/public/images/scene/action-notify-icon.png'));
iconMap.set('device', require('/public/images/scene/action-device-icon.png'));
iconMap.set('relieve', require('/public/images/scene/action-unbind-icon.png'));
iconMap.set('delay', require('/public/images/scene/action-delay-icon.png'));

export const itemNotifyIconMap = new Map();
itemNotifyIconMap.set('dingTalk', require('/public/images/scene/notify-item-img/dingtalk.png'));
itemNotifyIconMap.set('weixin', require('/public/images/scene/notify-item-img/weixin.png'));
itemNotifyIconMap.set('email', require('/public/images/scene/notify-item-img/email.png'));
itemNotifyIconMap.set('voice', require('/public/images/scene/notify-item-img/voice.png'));
itemNotifyIconMap.set('sms', require('/public/images/scene/notify-item-img/sms.png'));
itemNotifyIconMap.set('webhook', require('/public/images/scene/notify-item-img/webhook.png'));

export default (props: ItemProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [triggerVisible, setTriggerVisible] = useState<boolean>(false);
  const [op, setOp] = useState<any>(props.options);
  const cacheValueRef = useRef<any>({});
  const [actionType, setActionType] = useState<string>('');

  useEffect(() => {
    setOp(props.options);
  }, [props.options]);

  const notifyRender = (data: ActionsType | undefined, options: any) => {
    switch (data?.notify?.notifyType) {
      case 'dingTalk':
        if (options.provider === 'dingTalkRobotWebHook') {
          return (
            <div>
              通过<span className={'notify-text-highlight'}>群机器人消息</span>
              发送
              <span className={'notify-text-highlight'}>
                {options?.templateName || data?.notify?.templateId}
              </span>
            </div>
          );
        }
        return (
          <div>
            向<span className={'notify-text-highlight'}>{options?.orgName || ''}</span>
            <span className={'notify-text-highlight'}>{options?.sendTo || ''}</span>
            通过
            <span className={'notify-img-highlight'}>
              <img width={18} src={itemNotifyIconMap.get(data?.notify?.notifyType)} />
              钉钉
            </span>
            发送
            <span className={'notify-text-highlight'}>
              {options?.templateName || data?.notify?.templateId}
            </span>
          </div>
        );
      case 'weixin':
        return (
          <div>
            向<span className={'notify-text-highlight'}>{options?.sendTo || ''}</span>
            <span className={'notify-text-highlight'}>{options?.orgName || ''}</span>
            <span className={'notify-text-highlight'}>{options?.tagName || ''}</span>
            通过
            <span className={'notify-img-highlight'}>
              <img width={18} src={itemNotifyIconMap.get(data?.notify?.notifyType)} />
              微信
            </span>
            发送
            <span className={'notify-text-highlight'}>
              {options?.templateName || data?.notify?.templateId}
            </span>
          </div>
        );
      case 'email':
        return (
          <div>
            向<span className={'notify-text-highlight'}>{options?.sendTo || ''}</span>
            通过
            <span className={'notify-img-highlight'}>
              <img width={18} src={itemNotifyIconMap.get(data?.notify?.notifyType)} />
              邮件
            </span>
            发送
            <span className={'notify-text-highlight'}>
              {options?.templateName || data?.notify?.templateId}
            </span>
          </div>
        );
      case 'voice':
        return (
          <div>
            向<span className={'notify-text-highlight'}>{options?.calledNumber || ''}</span>
            通过
            <span className={'notify-img-highlight'}>
              <img width={18} src={itemNotifyIconMap.get(data?.notify?.notifyType)} />
              语音
            </span>
            发送
            <span className={'notify-text-highlight'}>
              {options?.templateName || data?.notify?.templateId}
            </span>
          </div>
        );
      case 'sms':
        return (
          <div>
            向<span className={'notify-text-highlight'}>{options?.sendTo || ''}</span>
            通过
            <span className={'notify-img-highlight'}>
              <img width={18} src={itemNotifyIconMap.get(data?.notify?.notifyType)} />
              短信
            </span>
            发送
            <span className={'notify-text-highlight'}>
              {options?.templateName || data?.notify?.templateId}
            </span>
          </div>
        );
      case 'webhook':
        return (
          <div>
            通过
            <span className={'notify-img-highlight'}>
              <img width={18} src={itemNotifyIconMap.get(data?.notify?.notifyType)} />
              webhook
            </span>
            发送
            <span>{options?.templateName || data?.notify?.templateId}</span>
          </div>
        );
      default:
        return null;
    }
  };

  const deviceRender = (data: ActionsType | undefined) => {
    switch (data?.device?.selector) {
      case 'fixed':
        return (
          <div>
            {`${data?.options?.type} ${data?.options?.name} ${data?.options?.properties} ${
              data?.options?.propertiesValue ? `为 ${data?.options?.propertiesValue}` : ''
            }`}
          </div>
        );
      case 'tag':
        return (
          <div>
            {data?.options?.type}
            {data.options?.taglist.map((item: any) => (
              <span>
                {item.type}
                {item.name}
                {item.value}
              </span>
            ))}
            {data?.options?.productName}
            {data?.options?.properties}
          </div>
        );
      case 'relation':
        return (
          <div>
            {data?.options?.type}与<span>{data?.options?.name}</span>具有相同
            {data?.options?.relationName}的{data?.options?.productName}设备的
            {data?.options?.properties}
          </div>
        );
      default:
        return null;
    }
  };

  const contentRender = () => {
    if (props?.data?.alarm?.mode === 'trigger') {
      return (
        <div className={'item-options-content'}>
          满足条件后将触发
          <a
            onClick={(e) => {
              e.stopPropagation();
              setTriggerVisible(true);
            }}
          >
            关联此场景的告警
          </a>
        </div>
      );
    } else if (props?.data?.alarm?.mode === 'relieve') {
      return (
        <div className={'item-options-content'}>
          满足条件后将解除
          <a
            onClick={() => {
              setTriggerVisible(true);
            }}
          >
            关联此场景的告警
          </a>
        </div>
      );
    } else if (props?.data?.executor === 'notify') {
      return (
        <div
          className={'item-options-content'}
          onClick={() => {
            setActionType(props?.data?.executor);
          }}
        >
          {notifyRender(props?.data, props?.options)}
        </div>
      );
    } else if (props?.data?.executor === 'delay') {
      return (
        <div
          className={'item-options-content'}
          onClick={() => {
            setActionType(props?.data?.executor);
          }}
        >
          {props.options.name}
        </div>
      );
    } else if (props.data?.executor === 'device') {
      return (
        <div
          className={'item-options-content'}
          onClick={() => {
            setActionType(props?.data?.executor);
          }}
        >
          {deviceRender(props?.data)}
        </div>
      );
    }
    return (
      <AddButton
        onClick={() => {
          setVisible(true);
        }}
      >
        点击配置执行动作
      </AddButton>
    );
  };

  useEffect(() => {
    cacheValueRef.current = props.data;
  }, [props.data]);

  return (
    <div className="actions-item-warp">
      <div className="actions-item">
        <div className="item-options-warp">
          <div
            className="item-options-type"
            onClick={() => {
              setVisible(true);
            }}
          >
            <img
              style={{ width: 18 }}
              src={iconMap.get(
                props?.data.executor === 'alarm' ? props?.data?.alarm?.mode : props?.data.executor,
              )}
            />
          </div>
          {contentRender()}
        </div>
        <div className="item-number">{props.name + 1}</div>
        <Popconfirm title={'确认删除？'} onConfirm={props.onDelete}>
          <div className="item-delete">
            <DeleteOutlined />
          </div>
        </Popconfirm>
      </div>
      {props.parallel ? null : (
        <FilterCondition
          action={props.name}
          branchGroup={props.branchGroup}
          thenName={props.thenName}
          data={props.data.terms?.[0]}
          label={props.data.options?.terms}
          onAdd={() => {
            let _data = props.data;
            if (!_data.terms) {
              _data = {
                ..._data,
                terms: [{}],
              };
              cacheValueRef.current = _data;
              props.onUpdate(_data, op);
            }
          }}
          onChange={(termsData) => {
            const _data = props.data;
            set(_data, 'terms', [termsData]);
            cacheValueRef.current = _data;
            props.onUpdate(_data, {
              ...op,
            });
          }}
          onLabelChange={(lb) => {
            props.onUpdate(cacheValueRef.current, {
              ...op,
              terms: lb,
            });
          }}
          onDelete={() => {
            const _data = props.data;
            if (_data.terms) {
              delete _data.terms;
              props.onUpdate(_data, op);
            }
          }}
        />
      )}
      {visible && (
        <Modal
          name={props.name}
          data={props.data}
          close={() => {
            setVisible(false);
          }}
          save={(data: ActionsType, options) => {
            setOp(options);
            props.onUpdate(data, options);
            setVisible(false);
          }}
          parallel={props.parallel}
        />
      )}
      {triggerVisible && (
        <TriggerAlarm
          close={() => {
            setTriggerVisible(false);
          }}
        />
      )}
      <ActionTypeComponent
        name={props.name}
        data={props.data}
        type={actionType}
        close={() => {
          setActionType('');
        }}
        save={(data: ActionsType, options) => {
          setOp(options);
          props.onUpdate(data, options);
          setActionType('');
        }}
        parallel={props.parallel}
      />
    </div>
  );
};
