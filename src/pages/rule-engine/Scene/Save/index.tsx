import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Space,
  Switch,
  Tooltip,
} from 'antd';
import { useIntl, useLocation } from 'umi';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PermissionButton, TitleComponent } from '@/components';
import ActionItems from './action/action';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { TimingTrigger, TriggerWay } from './components';
import { TriggerWayType } from './components/TriggerWay';
import TriggerTerm from '@/pages/rule-engine/Scene/TriggerTerm';
import TriggerDevice from './trigger';
import { service } from '../index';
import './index.less';
import { model } from '@formily/reactive';
import type { FormModelType } from '@/pages/rule-engine/Scene/typings';
import moment from 'moment';

type ShakeLimitType = {
  enabled: boolean;
  groupType?: string;
  time?: number;
  threshold?: number;
  alarmFirst?: boolean;
};

const DefaultShakeLimit = {
  enabled: false,
  alarmFirst: false,
};

export let FormModel = model<FormModelType>({});

const CronRegEx = new RegExp(
  '(((^([0-9]|[0-5][0-9])(\\,|\\-|\\/){1}([0-9]|[0-5][0-9]) )|^([0-9]|[0-5][0-9]) |^(\\* ))((([0-9]|[0-5][0-9])(\\,|\\-|\\/){1}([0-9]|[0-5][0-9]) )|([0-9]|[0-5][0-9]) |(\\* ))((([0-9]|[01][0-9]|2[0-3])(\\,|\\-|\\/){1}([0-9]|[01][0-9]|2[0-3]) )|([0-9]|[01][0-9]|2[0-3]) |(\\* ))((([0-9]|[0-2][0-9]|3[01])(\\,|\\-|\\/){1}([0-9]|[0-2][0-9]|3[01]) )|(([0-9]|[0-2][0-9]|3[01]) )|(\\? )|(\\* )|(([1-9]|[0-2][0-9]|3[01])L )|([1-7]W )|(LW )|([1-7]\\#[1-4] ))((([1-9]|0[1-9]|1[0-2])(\\,|\\-|\\/){1}([1-9]|0[1-9]|1[0-2]) )|([1-9]|0[1-9]|1[0-2]) |(\\* ))(([1-7](\\,|\\-|\\/){1}[1-7])|([1-7])|(\\?)|(\\*)|(([1-7]L)|([1-7]\\#[1-4]))))|(((^([0-9]|[0-5][0-9])(\\,|\\-|\\/){1}([0-9]|[0-5][0-9]) )|^([0-9]|[0-5][0-9]) |^(\\* ))((([0-9]|[0-5][0-9])(\\,|\\-|\\/){1}([0-9]|[0-5][0-9]) )|([0-9]|[0-5][0-9]) |(\\* ))((([0-9]|[01][0-9]|2[0-3])(\\,|\\-|\\/){1}([0-9]|[01][0-9]|2[0-3]) )|([0-9]|[01][0-9]|2[0-3]) |(\\* ))((([0-9]|[0-2][0-9]|3[01])(\\,|\\-|\\/){1}([0-9]|[0-2][0-9]|3[01]) )|(([0-9]|[0-2][0-9]|3[01]) )|(\\? )|(\\* )|(([1-9]|[0-2][0-9]|3[01])L )|([1-7]W )|(LW )|([1-7]\\#[1-4] ))((([1-9]|0[1-9]|1[0-2])(\\,|\\-|\\/){1}([1-9]|0[1-9]|1[0-2]) )|([1-9]|0[1-9]|1[0-2]) |(\\* ))(([1-7](\\,|\\-|\\/){1}[1-7] )|([1-7] )|(\\? )|(\\* )|(([1-7]L )|([1-7]\\#[1-4]) ))((19[789][0-9]|20[0-9][0-9])\\-(19[789][0-9]|20[0-9][0-9])))',
);

export default () => {
  const location = useLocation();
  const [form] = Form.useForm();
  const intl = useIntl();
  const triggerRef = useRef<any>();

  const { getOtherPermission } = PermissionButton.usePermission('rule-engine/Scene');
  const [triggerType, setTriggerType] = useState('');

  const [loading, setLoading] = useState(false);
  const [parallel, setParallel] = useState(true); // 是否并行
  const [shakeLimit, setShakeLimit] = useState<ShakeLimitType>(DefaultShakeLimit);

  const [requestParams, setRequestParams] = useState<any>(undefined);
  const [triggerValue, setTriggerValue] = useState<any>([]);
  const [triggerDatas, setTriggerDatas] = useState<any>({});
  const [actionParams, setActionParams] = useState<any>(undefined);

  const [actionsData, setActionsData] = useState<any[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  const getDetail = useCallback(
    async (id: string) => {
      const resp = await service.detail(id);
      if (resp.status === 200 && resp.result) {
        setIsEdit(true);
        const _data: any = resp.result;
        FormModel = _data;
        form.setFieldsValue(_data);
        setParallel(_data.parallel);

        setTriggerValue({ trigger: _data.terms || [] });
        setTriggerDatas(_data.terms);
        if (_data.trigger?.shakeLimit) {
          setShakeLimit(_data.trigger?.shakeLimit || DefaultShakeLimit);
        }
        if (_data.trigger?.device) {
          setRequestParams({ trigger: _data.trigger });
        }
        if (_data.actions) {
          setActionsData(_data.actions);
        }
      }
    },
    [triggerRef],
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      getDetail(id);
    }
  }, [location]);

  const saveData = useCallback(async () => {
    const formData = await form.validateFields();
    let triggerData = undefined;
    // 获取触发条件数据
    if (triggerRef.current && formData.trigger) {
      triggerData = await triggerRef.current.getTriggerForm();
      if (triggerData) {
        formData.terms = triggerData.trigger;
      }
    }
    console.log('save', formData);
    if (formData) {
      if (shakeLimit.enabled) {
        formData.trigger = {
          ...formData.trigger,
          shakeLimit: shakeLimit,
        };
      }
      setLoading(true);
      const resp = formData.id ? await service.updateScene(formData) : await service.save(formData);

      // 处理跳转新增
      if ((window as any).onTabSaveSuccess) {
        if (resp.result) {
          (window as any).onTabSaveSuccess(resp);
          setTimeout(() => window.close(), 300);
        }
      }

      setLoading(false);
      if (resp.status === 200) {
        message.success('操作成功');
        history.back();
      } else {
        message.error(resp.message);
      }
    }
  }, [shakeLimit]);

  const AntiShake = (
    <Space>
      <TitleComponent data={'触发条件'} style={{ margin: 0 }} />
      <Switch
        checked={shakeLimit.enabled}
        checkedChildren="开启防抖"
        unCheckedChildren="关闭防抖"
        onChange={(e) => {
          const newShake = {
            ...shakeLimit,
            enabled: e,
          };
          setShakeLimit(newShake);
        }}
      />
      {shakeLimit.enabled && (
        <>
          <InputNumber
            value={shakeLimit.time}
            min={0}
            onChange={(e: number) => {
              const newShake = {
                ...shakeLimit,
                time: e,
              };
              setShakeLimit(newShake);
            }}
          />
          <span> 秒内发生 </span>
          <InputNumber
            value={shakeLimit.threshold}
            min={0}
            onChange={(e: number) => {
              const newShake = {
                ...shakeLimit,
                threshold: e,
              };
              setShakeLimit(newShake);
            }}
          />
          <span>次及以上时，处理</span>
          <Radio.Group
            value={shakeLimit.alarmFirst}
            options={[
              { label: '第一次', value: true },
              { label: '最后一次', value: false },
            ]}
            optionType="button"
            onChange={(e) => {
              const newShake = {
                ...shakeLimit,
                alarmFirst: e.target.value,
              };
              setShakeLimit(newShake);
            }}
          ></Radio.Group>
        </>
      )}
    </Space>
  );

  return (
    <PageContainer>
      <Card>
        <Form
          form={form}
          colon={false}
          name="basicForm"
          layout={'vertical'}
          preserve={false}
          className={'scene-save'}
          onValuesChange={(changeValue, allValues) => {
            if (changeValue.trigger) {
              if (changeValue.trigger.device) {
                if (changeValue.trigger.device.productId) {
                  setTriggerValue([]);
                  setRequestParams({ trigger: allValues.trigger });
                } else if (
                  changeValue.trigger.device.selectorValues ||
                  (changeValue.trigger.device.operation &&
                    changeValue.trigger.device.operation.operator)
                ) {
                  setTriggerDatas(allValues.trigger);
                }
              } else if (['timer', 'manual'].includes(changeValue.trigger.type)) {
                setActionParams({ trigger: allValues.trigger });
              }
            }

            if (allValues.actions) {
              setActionsData(allValues.actions);
            }
            FormModel = { ...allValues };
          }}
        >
          <Form.Item
            name={'name'}
            label={<TitleComponent data={'名称'} style={{ margin: 0 }} />}
            rules={[
              { required: true, message: '请输入名称' },
              {
                max: 64,
                message: intl.formatMessage({
                  id: 'pages.form.tip.max64',
                  defaultMessage: '最多输入64个字符',
                }),
              },
            ]}
            required
          >
            <Input placeholder={'请输入名称'} />
          </Form.Item>
          <Form.Item label={<TitleComponent data={'触发方式'} style={{ margin: 0 }} />} required>
            <Form.Item
              name={['trigger', 'type']}
              rules={[{ required: true, message: '请选择触发方式' }]}
            >
              <TriggerWay onSelect={setTriggerType} disabled={isEdit} />
            </Form.Item>
            {triggerType === TriggerWayType.timing && (
              <Form.Item
                name={['trigger', 'timer']}
                rules={[
                  {
                    validator: async (_: any, value: any) => {
                      if (value) {
                        if (value.trigger === 'cron') {
                          if (!value.cron) {
                            return Promise.reject(new Error('请输入cron表达式'));
                          } else if (value.cron.length > 64) {
                            return Promise.reject(new Error('最多可输入64个字符'));
                          } else if (!CronRegEx.test(value.cron)) {
                            return Promise.reject(new Error('请输入正确的cron表达式'));
                          }
                        } else {
                          if (!value.when.length) {
                            return Promise.reject(new Error('请选择时间'));
                          }
                          if (value.period) {
                            if (!value.period.from || !value.period.to) {
                              return Promise.reject(new Error('请选择时间周期'));
                            }
                            if (!value.period.every) {
                              return Promise.reject(new Error('请输入周期频率'));
                            }
                          } else if (value.once) {
                            if (!value.once.time) {
                              return Promise.reject(new Error('请选择时间周期'));
                            }
                          }
                        }
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                initialValue={{
                  trigger: 'week',
                  mod: 'period',
                  when: [],
                  period: {
                    unit: 'seconds',
                    from: moment(new Date()).format('HH:mm:ss'),
                    to: moment(new Date()).format('HH:mm:ss'),
                  },
                }}
              >
                <TimingTrigger className={'trigger-type-content'} />
              </Form.Item>
            )}
            {triggerType === TriggerWayType.device && (
              // <Form.Item
              //   name={['trigger', 'device']}
              //   rules={[
              //     {
              //       validator: async (_: any, value: any) => {
              //         if (!value) {
              //           return Promise.reject(new Error('请选择产品'));
              //         }
              //         return Promise.resolve();
              //       },
              //     },
              //   ]}
              // >
              //   <TriggerDevice className={'trigger-type-content'} />
              // </Form.Item>
              <TriggerDevice value={triggerDatas} className={'trigger-type-content'} form={form} />
            )}
          </Form.Item>
          {triggerType === TriggerWayType.device &&
          requestParams &&
          requestParams.trigger?.device?.productId ? (
            <Form.Item label={AntiShake}>
              <TriggerTerm ref={triggerRef} params={requestParams} value={triggerValue} />
            </Form.Item>
          ) : null}
          <Form.Item hidden name={'parallel'} initialValue={true}>
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <Space>
                <TitleComponent
                  data={
                    <>
                      <span>执行动作</span>
                      <span style={{ color: 'red', margin: '0 4px' }}>*</span>
                    </>
                  }
                  style={{ margin: 0 }}
                />
                <Tooltip
                  title={
                    <div>
                      <div>串行：按顺序依次执行动作</div>
                      <div>并行：同时执行所有动作</div>
                    </div>
                  }
                >
                  <QuestionCircleOutlined style={{ margin: '0 8px', fontSize: 14 }} />
                </Tooltip>
                <Radio.Group
                  value={parallel}
                  options={[
                    { label: '串行', value: false },
                    { label: '并行', value: true },
                  ]}
                  optionType="button"
                  onChange={(e) => {
                    setParallel(e.target.value);
                    form.setFieldsValue({ parallel: e.target.value });
                  }}
                ></Radio.Group>
              </Space>
            }
          >
            <Form.List
              name="actions"
              rules={[
                {
                  validator: async (_: any, value: any) => {
                    if (!value) {
                      return Promise.reject(new Error('请添加执行动作'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  <div className={'scene-actions'}>
                    {fields.map(({ key, name, ...restField }) => (
                      <ActionItems
                        key={key}
                        form={form}
                        restField={restField}
                        name={name}
                        trigger={actionParams}
                        triggerType={triggerType}
                        onRemove={() => remove(name)}
                        actionItemData={actionsData.length && actionsData[name]}
                      />
                    ))}
                    <Form.Item noStyle>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        新增
                      </Button>
                    </Form.Item>
                  </div>
                  <Form.ErrorList errors={errors} />
                </>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item
            label={<TitleComponent data={'说明'} style={{ margin: 0 }} />}
            name={'description'}
          >
            <Input.TextArea showCount maxLength={200} placeholder={'请输入说明'} rows={4} />
          </Form.Item>
          {/*{triggerType === TriggerWayType.device &&*/}
          {/*requestParams &&*/}
          {/*requestParams.trigger?.device?.productId ? (*/}
          {/*  <Form.Item hidden name={['trigger','shakeLimit']}>*/}
          {/*    <Input />*/}
          {/*  </Form.Item>*/}
          {/*) : null}*/}
          <Form.Item hidden name={'id'}>
            <Input />
          </Form.Item>
        </Form>
        <PermissionButton
          isPermission={getOtherPermission(['add', 'update'])}
          onClick={saveData}
          type={'primary'}
          loading={loading}
        >
          保存
        </PermissionButton>
      </Card>
    </PageContainer>
  );
};
