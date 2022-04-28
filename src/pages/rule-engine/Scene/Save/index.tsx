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
import { useLocation } from 'umi';
import { useEffect, useRef, useState } from 'react';
import { PermissionButton } from '@/components';
import ActionItems from './action/action';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { TimingTrigger, TriggerWay } from './components';
import { TriggerWayType } from './components/TriggerWay';
import TriggerTerm from '@/pages/rule-engine/Scene/TriggerTerm';
import TriggerDevice from './trigger';
import { service } from '../index';

type ShakeLimitType = {
  enabled: boolean;
  groupType?: string;
  time?: number;
  threshold?: number;
  alarmFirst?: boolean;
};

export default () => {
  const location = useLocation();
  const [form] = Form.useForm();
  const triggerRef = useRef<any>();

  const { getOtherPermission } = PermissionButton.usePermission('rule-engine/Scene');
  const [triggerType, setTriggerType] = useState('');
  // const [triggerValue, setTriggerValue] = useState<any>();
  const [parallel, setParallel] = useState(false); // 是否并行
  const [shakeLimit, setShakeLimit] = useState<ShakeLimitType>({
    enabled: false,
    alarmFirst: true,
  });
  const [requestParams, setRequestParams] = useState<any>(undefined);

  const getDetail = async () => {
    // TODO 回显数据
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      getDetail();
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
      const resp = formData.id ? await service.update(formData) : await service.save(formData);
      if (resp.status === 200) {
        message.success('操作成功');
      } else {
        message.error(resp.message);
      }
    }
  };

  const AntiShake = (
    <Space>
      <span>触发条件</span>
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
          onValuesChange={(changeValue, allValues) => {
            if (allValues.trigger?.device?.selectorValues) {
              setRequestParams({ trigger: allValues.trigger });
            } else {
              setRequestParams(undefined);
            }
          }}
        >
          <Form.Item name={'name'} label={'名称'}>
            <Input placeholder={'请输入名称'} />
          </Form.Item>
          <Form.Item label={'触发方式'}>
            <Form.Item name={['trigger', 'type']}>
              <TriggerWay onSelect={setTriggerType} />
            </Form.Item>
            {triggerType === TriggerWayType.timing && (
              <Form.Item name={['trigger', 'timer']}>
                <TimingTrigger />
              </Form.Item>
            )}
            {triggerType === TriggerWayType.device && <TriggerDevice form={form} />}
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
              <>
                <span>
                  执行动作<span style={{ color: 'red', margin: '0 4px' }}>*</span>
                </span>
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
              </>
            }
          >
            <Form.List name="actions">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <ActionItems
                      key={key}
                      form={form}
                      restField={restField}
                      name={name}
                      triggerType={triggerType}
                      onRemove={() => remove(name)}
                    />
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      新增
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item label={'说明'} name={'description'}>
            <Input.TextArea showCount maxLength={200} placeholder={'请输入说明'} />
          </Form.Item>
          <Form.Item hidden name={'shakeLimit'}>
            <Input />
          </Form.Item>
          <Form.Item hidden name={'id'}>
            <Input />
          </Form.Item>
        </Form>
        <PermissionButton isPermission={getOtherPermission(['add', 'update'])} onClick={saveData}>
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
