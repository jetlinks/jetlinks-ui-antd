import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Form, Input } from 'antd';
import useLocation from '@/hooks/route/useLocation';
import Device from '../Save/device/index';
import Manual from '../Save/manual/index';
import Timer from '../Save/timer/index';
import { TitleComponent } from '@/components';
import { observable } from '@formily/reactive';
import { observer } from '@formily/react';
import type { FormModelType } from '@/pages/rule-engine/Scene/typings';
import { useEffect, useCallback } from 'react';
import { service } from '@/pages/rule-engine/Scene';
import './index.less';
import { onlyMessage } from '@/utils/util';
import { useHistory } from 'umi';
import { getMenuPathByCode } from '@/utils/menu';

export const FormModel = observable<FormModelType>({
  trigger: {
    type: '',
    options: {},
  },
  actions: [],
  options: {
    terms: [
      {
        terms: [],
      },
    ],
  },
  branches: [
    {
      when: [
        {
          terms: [
            {
              column: undefined,
              value: undefined,
              termType: undefined,
              key: 'params_1',
              type: 'and',
            },
          ],
          type: 'and',
          key: 'terms_1',
        },
      ],
      key: 'branckes_1',
      shakeLimit: {
        enabled: true,
        time: 1,
        threshold: 1,
        alarmFirst: false,
      },
      then: [],
    },
    {
      when: [],
      key: 'branckes_2',
      shakeLimit: {
        enabled: true,
        time: 1,
        threshold: 1,
        alarmFirst: false,
      },
      then: [],
    },
  ],
});

export default observer(() => {
  const location = useLocation();
  const triggerType = location?.query?.triggerType || '';
  const id = location?.query?.id || '';
  const history = useHistory();

  useEffect(() => {
    if (id) {
      service.detail(id).then((resp) => {
        if (resp.status === 200) {
          Object.assign(FormModel, resp.result);
          console.log(FormModel, '11111');
        }
      });
    }
  }, [id]);

  const triggerRender = (type: string) => {
    FormModel.trigger!.type = type;
    switch (type) {
      case 'device':
        return (
          <Form.Item label={<TitleComponent style={{ fontSize: 14 }} data={'设备触发'} />}>
            <Device />
          </Form.Item>
        );
      case 'manual':
        return (
          <Form.Item label={<TitleComponent style={{ fontSize: 14 }} data={'手动触发'} />}>
            <Manual />
          </Form.Item>
        );
      case 'timer':
        return (
          <Form.Item label={<TitleComponent style={{ fontSize: 14 }} data={'定时触发'} />}>
            <Timer />
          </Form.Item>
        );
      default:
        return null;
    }
  };

  const submit = useCallback(() => {
    service.updateScene(FormModel).then((res) => {
      if (res.status === 200) {
        onlyMessage('操作成功', 'success');
        const url = getMenuPathByCode('rule-engine/Scene');
        history.push(url);
      }
    });
  }, [id, FormModel]);

  return (
    <PageContainer>
      <Card>
        <Form name="timer" layout={'vertical'}>
          {triggerRender(triggerType)}
          <Form.Item
            label={<TitleComponent style={{ fontSize: 14 }} data={'说明'} />}
            name="description"
          >
            <Input.TextArea showCount maxLength={200} placeholder={'请输入说明'} rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={submit}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
});
