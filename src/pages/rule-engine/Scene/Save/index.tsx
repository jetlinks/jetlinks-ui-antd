import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Form, Input } from 'antd';
import { useLocation } from 'umi';
import { useEffect, useRef, useState } from 'react';
import { PermissionButton } from '@/components';
import ActionItems from './action/action';
import { PlusOutlined } from '@ant-design/icons';
import { TriggerWay } from './components';
import TriggerTerm from '@/pages/rule-engine/Scene/TriggerTerm';

export default () => {
  const location = useLocation();
  const [form] = Form.useForm();
  const triggerRef = useRef<any>();

  const { getOtherPermission } = PermissionButton.usePermission('rule-engine/Scene');

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
    // 获取触发条件数据
    const triggerData = await triggerRef.current.getTriggerForm();
    console.log(JSON.stringify(triggerData), 'trigger');
    console.log(formData);
  };

  const [triggerValue, setTriggerValue] = useState<any>();
  const requestParams = {
    trigger: {
      type: 'device',
      device: {
        productId: '0412-zj',
        selector: 'device',
        selectorValue: [
          {
            id: '0412-zj',
            name: '0412-zj',
          },
        ],
        operation: {
          operator: 'reportProperty',
          timer: {
            trigger: 'week',
            cron: '',
            when: [1, 3, 5],
            mod: 'period',
            period: {
              from: '09:30',
              to: '14:30',
              every: 1,
              unit: 'hours',
            },
            once: {
              time: '',
            },
          },
          eventId: '',
          readProperties: ['temparature', 'temperature-k', 'test-zhibioa'],
          writeProperties: {},
          functionId: '',
          functionParameters: [
            {
              name: '',
              value: {},
            },
          ],
        },
        defaultVariable: [],
      },
      timer: {},
      defaultVariable: [],
    },
  };

  return (
    <PageContainer>
      <Card>
        <Form form={form} colon={false} layout={'vertical'} preserve={false}>
          <Form.Item name={'name'} label={'名称'}>
            <Input placeholder={'请输入名称'} />
          </Form.Item>
          <Form.Item label={'触发方式'}>
            <Form.Item name={['trigger', 'type']}>
              <TriggerWay />
            </Form.Item>
          </Form.Item>
          <Form.Item label={'执行动作'}>
            <Form.List name="actions">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <ActionItems
                      key={key}
                      form={form}
                      restField={restField}
                      onRemove={() => remove(name)}
                      name={name}
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
        </Form>
        <PermissionButton isPermission={getOtherPermission(['add', 'update'])} onClick={saveData}>
          保存
        </PermissionButton>
        <Button
          onClick={() => {
            setTriggerValue({
              trigger: [
                {
                  terms: [
                    {
                      column: '_now',
                      termType: 'eq',
                      source: 'manual',
                      value: '2022-04-21 14:26:04',
                    },
                  ],
                },
                {
                  terms: [
                    {
                      column: 'properties.test-zhibioa.recent',
                      termType: 'lte',
                      source: 'metrics',
                      value: '123',
                    },
                  ],
                },
              ],
            });
          }}
        >
          设置
        </Button>
      </Card>
      <Card>
        <TriggerTerm
          ref={triggerRef}
          params={requestParams}
          value={triggerValue}
          onChange={console.log}
        />
      </Card>
    </PageContainer>
  );
};
