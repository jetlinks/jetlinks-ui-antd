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
import { useEffect, useRef, useState } from 'react';
import { PermissionButton, TitleComponent } from '@/components';
import ActionItems from './action/action';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { TimingTrigger, TriggerWay } from './components';
import { TriggerWayType } from './components/TriggerWay';
import TriggerTerm from '@/pages/rule-engine/Scene/TriggerTerm';
import TriggerDevice from './trigger/device';
import { service } from '../index';
import './index.less';
import { model } from '@formily/reactive';
import type { FormModelType } from '@/pages/rule-engine/Scene/typings';

type ShakeLimitType = {
  enabled: boolean;
  groupType?: string;
  time?: number;
  threshold?: number;
  alarmFirst?: boolean;
};

const DefaultShakeLimit = {
  enabled: false,
  alarmFirst: true,
};

export let FormModel = model<FormModelType>({});

export default () => {
  const location = useLocation();
  const [form] = Form.useForm();
  const intl = useIntl();
  const triggerRef = useRef<any>();

  const { getOtherPermission } = PermissionButton.usePermission('rule-engine/Scene');
  const [triggerType, setTriggerType] = useState('');
  // const [triggerValue, setTriggerValue] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [parallel, setParallel] = useState(false); // 是否并行
  const [shakeLimit, setShakeLimit] = useState<ShakeLimitType>(DefaultShakeLimit);
  const [requestParams, setRequestParams] = useState<any>(undefined);
  const [actionsData, setActionsData] = useState<any[]>([]);

  const getDetail = async (id: string) => {
    const resp = await service.detail(id);
    if (resp.status === 200 && resp.result) {
      const _data: any = resp.result;
      FormModel = _data;
      form.setFieldsValue(_data);
      setParallel(_data.parallel);
      setShakeLimit(_data.shakeLimit || DefaultShakeLimit);
      if (_data.trigger?.device?.selectorValues) {
        setRequestParams({ trigger: _data.trigger });
      }
      if (_data.actions) {
        setActionsData(_data.actions);
      }
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      getDetail(id);
    }
  }, [location]);

  const saveData = async () => {
    const formData = await form.validateFields();
    let triggerData = undefined;
    // 获取触发条件数据
    if (triggerRef.current) {
      triggerData = await triggerRef.current.getTriggerForm();
      console.log(JSON.stringify(triggerData), 'trigger');
      if (!triggerData) {
        return;
      }
      formData.terms = triggerData.trigger;
    }
    console.log(formData);
    if (formData) {
      setLoading(true);
      const resp = formData.id ? await service.updateScene(formData) : await service.save(formData);
      setLoading(false);
      if (resp.status === 200) {
        message.success('操作成功');
        history.back();
      } else {
        message.error(resp.message);
      }
    }
  };

  const AntiShake = (
    <Space>
      <TitleComponent data={'触发条件'} style={{ margin: 0 }} />
      <Switch
        checked={shakeLimit.enabled}
        checkedChildren="开启防抖"
        unCheckedChildren="关闭防抖"
        onChange={(e) => {
          setShakeLimit({
            ...shakeLimit,
            enabled: e,
          });
          form.setFieldsValue({ shakeLimit });
        }}
      />
      {shakeLimit.enabled && (
        <>
          <InputNumber
            value={shakeLimit.time}
            onChange={(e: number) => {
              setShakeLimit({
                ...shakeLimit,
                time: e,
              });
              form.setFieldsValue({ shakeLimit });
            }}
          />
          <span> 秒内发生 </span>
          <InputNumber
            value={shakeLimit.threshold}
            onChange={(e: number) => {
              setShakeLimit({
                ...shakeLimit,
                threshold: e,
              });
              form.setFieldsValue({ shakeLimit });
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
              console.log(e);
              setShakeLimit({
                ...shakeLimit,
                alarmFirst: e.target.value,
              });
              form.setFieldsValue({ shakeLimit });
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
          layout={'vertical'}
          preserve={false}
          className={'scene-save'}
          onValuesChange={(changeValue, allValues) => {
            if (allValues.trigger?.device?.selectorValues) {
              setRequestParams({ trigger: allValues.trigger });
            } else {
              setRequestParams(undefined);
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
              <TriggerWay onSelect={setTriggerType} />
            </Form.Item>
            {triggerType === TriggerWayType.timing && (
              <Form.Item name={['trigger', 'timer']}>
                <TimingTrigger className={'trigger-type-content'} />
              </Form.Item>
            )}
            {triggerType === TriggerWayType.device && (
              <Form.Item name={['trigger', 'device']}>
                <TriggerDevice className={'trigger-type-content'} />
              </Form.Item>
            )}
          </Form.Item>
          {triggerType === TriggerWayType.device &&
          requestParams &&
          requestParams.trigger?.device?.productId ? (
            <Form.Item label={AntiShake}>
              <TriggerTerm
                ref={triggerRef}
                params={requestParams}
                // value={triggerValue}
              />
            </Form.Item>
          ) : null}
          <Form.Item hidden name={'parallel'} initialValue={false}>
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
                      <div>串行：满足所有执行条件才会触发执行动作</div>
                      <div>并行：满足任意条件时会触发执行动作</div>
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
          {triggerType === TriggerWayType.device &&
          requestParams &&
          requestParams.trigger?.device?.productId ? (
            <Form.Item hidden name={'shakeLimit'} initialValue={DefaultShakeLimit}>
              <Input />
            </Form.Item>
          ) : null}
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
        {/*<Button*/}
        {/*  onClick={() => {*/}
        {/*    setTriggerValue({*/}
        {/*      trigger: [*/}
        {/*        {*/}
        {/*          terms: [*/}
        {/*            {*/}
        {/*              column: '_now',*/}
        {/*              termType: 'eq',*/}
        {/*              source: 'manual',*/}
        {/*              value: '2022-04-21 14:26:04',*/}
        {/*            },*/}
        {/*          ],*/}
        {/*        },*/}
        {/*        {*/}
        {/*          terms: [*/}
        {/*            {*/}
        {/*              column: 'properties.test-zhibioa.recent',*/}
        {/*              termType: 'lte',*/}
        {/*              source: 'metrics',*/}
        {/*              value: '123',*/}
        {/*            },*/}
        {/*          ],*/}
        {/*        },*/}
        {/*      ],*/}
        {/*    });*/}
        {/*  }}*/}
        {/*>*/}
        {/*  设置*/}
        {/*</Button>*/}
      </Card>
    </PageContainer>
  );
};
