import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Form, Input } from 'antd';
import useLocation from '@/hooks/route/useLocation';
import Device from '../Save/device/index';
import Manual from '../Save/manual/index';
import Timer from '../Save/timer/index';
import { TitleComponent } from '@/components';
import { observable } from '@formily/reactive';
import { observer } from '@formily/react';
import type { FormModelType, ActionBranchesProps } from '@/pages/rule-engine/Scene/typings';
import { useEffect, useCallback } from 'react';
import { service } from '@/pages/rule-engine/Scene';
import './index.less';
import { onlyMessage } from '@/utils/util';
import { useHistory } from 'umi';
import { getMenuPathByCode } from '@/utils/menu';
import { cloneDeep } from 'lodash';

export const defaultBranches = [
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
      enabled: false,
      time: 0,
      threshold: 0,
      alarmFirst: false,
    },
    then: [],
  },
];

const defaultOptions = {
  trigger: {},
  when: [
    {
      terms: [
        {
          terms: [],
        },
      ],
    },
  ],
};

export const FormModel = observable<{ current: FormModelType }>({
  current: {
    trigger: {
      type: '',
    },
    options: defaultOptions,
    branches: defaultBranches,
  },
});

export default observer(() => {
  const location = useLocation();
  const triggerType = location?.query?.triggerType || '';
  const id = location?.query?.id || '';
  const history = useHistory();
  const [form] = Form.useForm();

  const FormModelInit = () => {
    FormModel.current = {
      trigger: {
        type: '',
      },
      options: defaultOptions,
      branches: [
        ...defaultBranches,
        {
          when: [],
          key: 'branches_2',
          shakeLimit: {
            enabled: false,
            time: 0,
            threshold: 0,
            alarmFirst: false,
          },
          then: [],
        },
      ],
    };
  };

  useEffect(() => {
    return () => {
      // 销毁
      console.log('销毁');
      FormModelInit();
    };
  }, []);

  useEffect(() => {
    FormModelInit();
    if (id) {
      service.detail(id).then((resp) => {
        if (resp.status === 200) {
          console.log('defaultBranches', defaultBranches);
          let branches = resp.result.branches || cloneDeep(defaultBranches);
          // 处理 branches 的 key
          if (branches) {
            branches = branches.map((bItem: ActionBranchesProps, bIndex: number) => {
              if (!bItem.key) {
                bItem.key = `branches_${new Date().getTime() + bIndex}`;
                if (bItem.then && bItem.then.length) {
                  bItem.then = bItem.then.map((tItem, tIndex) => {
                    tItem.key = `then_${new Date().getTime() + tIndex}`;
                    if (tItem.actions) {
                      tItem.actions = tItem.actions.map((aItem, index) => {
                        aItem.key = `${aItem.executor}_${new Date().getTime() + index}`;
                        return aItem;
                      });
                    }
                    return tItem;
                  });
                }
                if (bItem.when && bItem.when.length) {
                  bItem.when = bItem.when.map((wItem, index) => {
                    wItem.key = `when_${new Date().getTime() + index}`;
                    if (wItem.terms) {
                      wItem.terms = wItem.terms.map((wtItem, wtIndex) => {
                        wtItem.key = `terms_${new Date().getTime() + wtIndex}`;
                        return wtItem;
                      });
                    }
                    return wItem;
                  });
                }
              }
              return bItem;
            });
          }
          if (branches[0]?.when?.length) {
            branches.push({
              when: [],
              key: 'branckes_2',
              shakeLimit: {
                enabled: false,
                time: 0,
                threshold: 0,
                alarmFirst: false,
              },
              then: [],
            });
          }
          FormModel.current = {
            ...resp.result,
          };
          FormModel.current.options = { ...defaultOptions, ...resp.result.options };
          FormModel.current.trigger = resp.result.trigger || {};
          FormModel.current.branches = branches;

          form.setFieldValue('description', resp.result.description);
        }
      });
    }
  }, [id, form]);

  const triggerRender = (type: string) => {
    FormModel.current.trigger!.type = type;
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
    const baseData = form.getFieldsValue();
    const FormData = cloneDeep(FormModel.current);
    const { options, branches } = FormData;
    if (options?.terms) {
      options.when = options.when.filter((item: any) => {
        const terms = item.terms.filter((tItem: any) => !!tItem.length);
        return !!terms.length;
      });
      if (!options.terms.length) {
        delete options.terms;
      }
    }

    if (branches) {
      FormData.branches = branches.filter((item) => !!item.then.length || !!item.when.length);
    }

    if (baseData) {
      FormData.description = baseData.description;
    }

    service.updateScene(FormData).then((res) => {
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
        <Form name="timer" layout={'vertical'} form={form}>
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
