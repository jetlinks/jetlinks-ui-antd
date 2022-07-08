import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Space,
  Switch,
  Tooltip,
} from 'antd';
import { useHistory, useIntl, useLocation } from 'umi';
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
import { onlyMessage } from '@/utils/util';
import Explanation from './Explanation';
import { getMenuPathByCode } from '@/utils/menu';

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

export default () => {
  const location = useLocation();
  const [form] = Form.useForm();
  const intl = useIntl();
  const triggerRef = useRef<any>();
  const history = useHistory();

  const { getOtherPermission } = PermissionButton.usePermission('rule-engine/Scene');
  const [triggerType, setTriggerType] = useState('device');

  const [loading, setLoading] = useState(false);
  const [parallel, setParallel] = useState(true); // 是否并行
  const [shakeLimit, setShakeLimit] = useState<ShakeLimitType>(DefaultShakeLimit);

  const [requestParams, setRequestParams] = useState<any>(undefined);
  const [triggerValue, setTriggerValue] = useState<any>([]);
  const [triggerDatas, setTriggerDatas] = useState<any>({});
  const [actionParams, setActionParams] = useState<any>(undefined);
  const [actionDataCount, setActionDataCount] = useState(0);

  const [actionsData, setActionsData] = useState<any[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    FormModel = {};
  }, []);

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
        setTriggerDatas(_data.trigger);
        setActionParams({ trigger: _data.trigger });
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
        onlyMessage('操作成功');
        history.push(getMenuPathByCode('rule-engine/Scene'));
      } else {
        onlyMessage(resp.message);
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
            min={1}
            max={100}
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
            min={1}
            max={100}
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

  const hasKeyInObject = (keys: string[], obj: any) => {
    return keys.some((key) => key in obj);
  };

  return (
    <PageContainer>
      <Card>
        <Row>
          <Col span={16}>
            <Form
              scrollToFirstError={{
                behavior: 'smooth',
                block: 'end',
              }}
              form={form}
              colon={false}
              name="basicForm"
              layout={'vertical'}
              preserve={false}
              className={'scene-save'}
              onValuesChange={(changeValue, allValues) => {
                if (changeValue.trigger) {
                  if (changeValue.trigger.device) {
                    if (
                      changeValue.trigger.device.productId ||
                      changeValue.trigger.device.selectorValues ||
                      (changeValue.trigger.device.operation &&
                        hasKeyInObject(
                          ['operator', 'eventId', 'functionId'],
                          changeValue.trigger.device.operation,
                        ))
                    ) {
                      setTriggerValue([]);
                      setRequestParams({ trigger: allValues.trigger });
                      setTriggerDatas(allValues.trigger);
                    }

                    if (
                      hasKeyInObject(['productId'], changeValue.trigger.device) ||
                      (changeValue.trigger.device.operation &&
                        hasKeyInObject(
                          ['operator', 'eventId', 'functionId'],
                          changeValue.trigger.device.operation,
                        ))
                    ) {
                      setActionParams({ trigger: allValues.trigger }); // 用于内置参数请求
                    }
                  } else if (['timer', 'manual'].includes(changeValue.trigger.type)) {
                    setActionParams({ trigger: allValues.trigger }); // 用于内置参数请求
                  }
                }
                console.log('scene save', allValues);
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
              >
                <Input placeholder={'请输入名称'} />
              </Form.Item>
              <Form.Item
                label={<TitleComponent data={'触发方式'} style={{ margin: 0 }} />}
                required
              >
                <Form.Item
                  name={['trigger', 'type']}
                  rules={[{ required: true, message: '请选择触发方式' }]}
                  initialValue={'device'}
                >
                  <TriggerWay onSelect={setTriggerType} disabled={isEdit} />
                </Form.Item>
                {triggerType === TriggerWayType.timing && (
                  <TimingTrigger
                    name={['trigger']}
                    form={form}
                    className={'trigger-type-content'}
                  />
                )}
                {triggerType === TriggerWayType.device && (
                  <TriggerDevice
                    value={triggerDatas}
                    className={'trigger-type-content'}
                    form={form}
                  />
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
                    <TitleComponent data={<span>执行动作</span>} style={{ margin: 0 }} />
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
                <Form.List name="actions">
                  {(fields, { add, remove, move }, { errors }) => (
                    <>
                      <div className={'scene-actions'} style={{ paddingBottom: 24 }}>
                        {fields.map(({ key, name, ...restField }) => (
                          <ActionItems
                            key={key}
                            form={form}
                            restField={restField}
                            name={name}
                            trigger={actionParams}
                            triggerType={triggerType}
                            onRemove={() => {
                              remove(name);
                              setActionDataCount(actionDataCount - 1);
                            }}
                            onMove={(type) => {
                              if (type === 'up') {
                                move(name, name - 1);
                              } else {
                                move(name, name + 1);
                              }
                            }}
                            actionItemData={actionsData[name]}
                            isLast={!actionDataCount || actionDataCount - 1 === name}
                            parallel={parallel}
                          />
                        ))}
                        <Form.Item noStyle>
                          <Button
                            type="dashed"
                            onClick={() => {
                              add();
                              setActionDataCount(actionDataCount + 1);
                            }}
                            block
                            icon={<PlusOutlined />}
                          >
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
              <PermissionButton
                isPermission={getOtherPermission(['add', 'update'])}
                onClick={saveData}
                type={'primary'}
                loading={loading}
                htmlType="submit"
              >
                保存
              </PermissionButton>
            </Form>
          </Col>
          <Col span={8}>
            <Explanation type={triggerType} />
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};
