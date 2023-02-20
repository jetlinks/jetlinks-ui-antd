import { useEffect, useState, useRef, useCallback } from 'react';
import Modal, { ActionTypeComponent } from '../Modal/add';
import type { ActionsType } from '@/pages/rule-engine/Scene/typings';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import './index.less';
import TriggerAlarm from '../TriggerAlarm';
import { AddButton } from '@/pages/rule-engine/Scene/Save/components/Buttons';
import FilterGroup from './FilterGroup';
import { cloneDeep, flattenDeep, isBoolean, set } from 'lodash';
import { Popconfirm, Space } from 'antd';
import { TermsType } from '@/pages/rule-engine/Scene/typings';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import { queryBuiltInParams } from '@/pages/rule-engine/Scene/Save/action/service';
import { randomString } from '@/utils/util';
import classNames from 'classnames';
import { AIcon } from '@/components';

export enum ParallelEnum {
  'parallel' = 'parallel',
  'serial' = 'serial',
}

export type ParallelType = keyof typeof ParallelEnum;

interface ItemProps {
  branchesName: number;
  branchGroup: number;
  name: number;
  data: ActionsType;
  type: ParallelType;
  parallel: boolean;
  options: any;
  onUpdate: (data: any, options: any) => void;
  onDelete: () => void;
  isLast: boolean;
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

const handleName = (_data: any) => (
  <Space>
    {_data.name}
    <div style={{ color: 'grey', marginLeft: '5px' }}>{_data.fullName}</div>
    {_data.description && (
      <div style={{ color: 'grey', marginLeft: '5px' }}>({_data.description})</div>
    )}
  </Space>
);

export default (props: ItemProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [triggerVisible, setTriggerVisible] = useState<boolean>(false);
  // const [op, setOp] = useState<any>(props.options);
  const cacheValueRef = useRef<any>({});
  const [actionType, setActionType] = useState<string>('');
  const [thenTerms, setThenTerms] = useState<TermsType[] | undefined>([]);
  const [paramsOptions, setParamsOptions] = useState<any[]>([]);
  const [optionsColumns, setOptionsColumns] = useState<string[][]>([]);

  const optionsRef = useRef<any>({});

  useEffect(() => {
    // setOp(props.options);
    optionsRef.current = props.options;
    if (props.options?.termsColumns) {
      setOptionsColumns(props.options?.termsColumns || []);
    }
  }, [props.options]);

  const handleTreeData = (data: any): any[] => {
    if (data.length > 0) {
      return data.map((item: any) => {
        const name = handleName(item);
        if (item.children) {
          return {
            ...item,
            key: item.id,
            title: name,
            disabled: true,
            children: handleTreeData(item.children),
          };
        }
        return { ...item, key: item.id, title: name };
      });
    }
    return [];
  };

  const getParams = useCallback(() => {
    const _params = {
      branch: props.branchesName,
      branchGroup: props.branchGroup,
      action: props.name,
    };
    const newData = cloneDeep(FormModel.current);
    newData.branches = newData.branches?.filter((item) => !!item);
    queryBuiltInParams(newData, _params).then((res: any) => {
      if (res.status === 200) {
        const params = handleTreeData(res.result);
        setParamsOptions(params);
      }
    });
  }, [props.name, props.branchesName, props.branchGroup]);

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
            通过
            <span className={'notify-img-highlight'}>
              <img width={18} src={itemNotifyIconMap.get(data?.notify?.notifyType)} />
              钉钉
            </span>
            向<span className={'notify-text-highlight'}>{options?.orgName || ''}</span>
            <span className={'notify-text-highlight'}>{options?.sendTo || ''}</span>
            发送
            <span className={'notify-text-highlight'}>
              {options?.templateName || data?.notify?.templateId}
            </span>
          </div>
        );
      case 'weixin':
        return (
          <div>
            通过
            <span className={'notify-img-highlight'}>
              <img width={18} src={itemNotifyIconMap.get(data?.notify?.notifyType)} />
              微信
            </span>
            向<span className={'notify-text-highlight'}>{options?.orgName || ''}</span>
            <span className={'notify-text-highlight'}>{options?.sendTo || ''}</span>
            <span className={'notify-text-highlight'}>{options?.tagName || ''}</span>
            发送
            <span className={'notify-text-highlight'}>
              {options?.templateName || data?.notify?.templateId}
            </span>
          </div>
        );
      case 'email':
        return (
          <div>
            通过
            <span className={'notify-img-highlight'}>
              <img width={18} src={itemNotifyIconMap.get(data?.notify?.notifyType)} />
              邮件
            </span>
            向<span className={'notify-text-highlight'}>{options?.sendTo || ''}</span>
            发送
            <span className={'notify-text-highlight'}>
              {options?.templateName || data?.notify?.templateId}
            </span>
          </div>
        );
      case 'voice':
        return (
          <div>
            通过
            <span className={'notify-img-highlight'}>
              <img width={18} src={itemNotifyIconMap.get(data?.notify?.notifyType)} />
              语音
            </span>
            向<span className={'notify-text-highlight'}>{options?.sendTo || ''}</span>
            发送
            <span className={'notify-text-highlight'}>
              {options?.templateName || data?.notify?.templateId}
            </span>
          </div>
        );
      case 'sms':
        return (
          <div>
            通过
            <span className={'notify-img-highlight'}>
              <img width={18} src={itemNotifyIconMap.get(data?.notify?.notifyType)} />
              短信
            </span>
            向<span className={'notify-text-highlight'}>{options?.sendTo || ''}</span>
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
    const typeIconMap = {
      READ_PROPERTY: 'icon-zhihangdongzuodu',
      INVOKE_FUNCTION: 'icon-zhihangdongzuoxie-1',
      WRITE_PROPERTY: 'icon-zhihangdongzuoxie',
    };
    switch (data?.device?.selector) {
      case 'fixed':
        return (
          <div>
            <AIcon type={typeIconMap[data!.device!.message!.messageType]} />
            <span style={{ paddingRight: 4 }}>{data?.options?.type}</span>
            <AIcon type={'icon-mubiao'} style={{ paddingRight: 2 }} />
            {`${data?.options?.name} ${data?.options?.properties} 
            ${
              (isBoolean(data?.options?.propertiesValue) ? true : data?.options?.propertiesValue)
                ? `为 ${data?.options?.propertiesValue}`
                : ''
            }`}
          </div>
        );
      case 'tag':
        return (
          <div>
            <AIcon type={typeIconMap[data!.device!.message!.messageType]} />
            {data?.options?.type}
            {data.options?.taglist?.map((item: any) => (
              <span>
                {item.type}
                {item.name}为{item.value}
              </span>
            ))}
            的{data?.options?.productName}
            {data?.options?.properties}
          </div>
        );
      case 'relation':
        return (
          <div>
            <AIcon type={typeIconMap[data!.device!.message!.messageType]} />
            {data?.options?.type}与<span>{data?.options?.triggerName}</span>具有相同
            {data?.options?.relationName}的{data?.options?.productName}设备的
            {data?.options?.properties}
          </div>
        );
      default:
        return null;
    }
  };

  const contentRender = () => {
    if (props?.data?.executor === 'alarm') {
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
      }
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
    setThenTerms(props.data.terms);
  }, [props.data]);

  useEffect(() => {
    getParams();
    return () => {
      setParamsOptions([]);
    };
  }, []);

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
      {!props.isLast && props.type === 'serial' ? (
        <div
          className={classNames('actions-item-filter-warp', {
            'filter-border': !!thenTerms?.length,
          })}
        >
          {!!thenTerms?.length && (
            <div className={'actions-item-filter-warp-tip'}>满足此条件后执行后续动作</div>
          )}
          <div className={classNames('actions-item-filter-overflow')}>
            {props.parallel ? null : thenTerms && thenTerms.length ? (
              thenTerms.map((termsItem, index) => (
                <FilterGroup
                  action={props.name}
                  key={termsItem.key}
                  branchGroup={props.branchGroup}
                  branchesName={props.branchesName}
                  name={index}
                  data={termsItem}
                  columns={optionsColumns}
                  isLast={index === thenTerms.length - 1}
                  isFirst={index === 0}
                  paramsOptions={paramsOptions}
                  label={props.options?.terms?.[index]}
                  actionColumns={props.options?.otherColumns}
                  onColumnsChange={(columns) => {
                    // console.log('columns-----', columns);

                    const filterColumns = new Set(flattenDeep(columns)); // 平铺去重
                    // console.log('filterColumns-----',filterColumns)

                    let newColumns = [...filterColumns.values()];
                    if (optionsRef.current?.otherColumns) {
                      newColumns = [...optionsRef.current.otherColumns, ...newColumns];
                    }
                    optionsRef.current['columns'] = newColumns;
                    optionsRef.current['termsColumns'] = columns;
                    // console.log('optionsRef.current-----',optionsRef.current)
                    props.onUpdate(cacheValueRef.current, optionsRef.current);
                  }}
                  onAddGroup={() => {
                    const newThenTerms = [...thenTerms];
                    newThenTerms.push({
                      type: 'and',
                      key: randomString(),
                      terms: [
                        {
                          column: undefined,
                          value: undefined,
                          termType: undefined,
                          type: 'and',
                          key: randomString(),
                        },
                      ],
                    });
                    const _data = cacheValueRef.current;
                    set(_data, 'terms', newThenTerms);
                    props.onUpdate(_data, optionsRef.current);
                  }}
                  onValueChange={(termsData) => {
                    const _data = cacheValueRef.current;
                    set(_data, ['terms', index], termsData);
                    // cacheValueRef.current = _data;
                    props.onUpdate(_data, {
                      ...optionsRef.current,
                    });
                  }}
                  onLabelChange={(lb) => {
                    const newLabel: any[] = props.options?.terms || [];
                    newLabel.splice(index, 1, lb);
                    optionsRef.current['terms'] = newLabel;
                    props.onUpdate(cacheValueRef.current, optionsRef.current);
                  }}
                  onDelete={() => {
                    const _data = thenTerms.filter((a) => a.key !== termsItem.key);
                    if (optionsRef.current?.termsColumns) {
                      optionsRef.current.termsColumns[index] = [];
                      const filterColumns = new Set(flattenDeep(optionsRef.current.termsColumns)); // 平铺去重
                      let newColumns = [...filterColumns.values()];
                      if (optionsRef.current?.otherColumns) {
                        newColumns = [...optionsRef.current.otherColumns, ...newColumns];
                      }
                      optionsRef.current['columns'] = newColumns;
                    }
                    props.onUpdate(
                      {
                        ...cacheValueRef.current,
                        terms: _data,
                      },
                      optionsRef.current,
                    );
                  }}
                />
              ))
            ) : (
              <div
                className="filter-add-button"
                onClick={() => {
                  getParams();
                  let _data = cacheValueRef.current;
                  optionsRef.current['terms'] = [];
                  if (!_data.terms) {
                    _data = {
                      ..._data,
                      terms: [
                        {
                          type: 'and',
                          key: randomString(),
                          terms: [
                            {
                              column: undefined,
                              value: undefined,
                              termType: undefined,
                              type: 'and',
                              key: randomString(),
                            },
                          ],
                        },
                      ],
                    };
                    props.onUpdate(_data, optionsRef.current);
                  } else {
                    _data.terms = [
                      {
                        type: 'and',
                        key: randomString(),
                        terms: [
                          {
                            column: undefined,
                            value: undefined,
                            termType: undefined,
                            type: 'and',
                            key: randomString(),
                          },
                        ],
                      },
                    ];
                    props.onUpdate(_data, optionsRef.current);
                  }
                }}
              >
                <PlusOutlined style={{ paddingRight: 4 }} /> 添加过滤条件
              </div>
            )}
          </div>
        </div>
      ) : null}
      {visible && (
        <Modal
          name={props.name}
          branchGroup={props.branchGroup}
          branchesName={props.branchesName}
          data={props.data}
          close={() => {
            setVisible(false);
          }}
          save={(data: ActionsType, options) => {
            optionsRef.current = options;
            props.onUpdate(data, options);
            setVisible(false);
            setTimeout(() => {
              getParams();
            }, 10);
          }}
          parallel={props.parallel}
        />
      )}
      {triggerVisible && (
        <TriggerAlarm
          id={FormModel.current?.id || ''}
          close={() => {
            setTriggerVisible(false);
          }}
        />
      )}
      <ActionTypeComponent
        name={props.name}
        branchGroup={props.branchGroup}
        branchesName={props.branchesName}
        data={props.data}
        type={actionType}
        close={() => {
          setActionType('');
        }}
        save={(data: ActionsType, options) => {
          optionsRef.current = options;
          props.onUpdate(data, options);
          setActionType('');
          setTimeout(() => {
            getParams();
          }, 10);
        }}
        parallel={props.parallel}
      />
    </div>
  );
};
