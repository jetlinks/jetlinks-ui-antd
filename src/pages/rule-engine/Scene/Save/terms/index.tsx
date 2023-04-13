import { useCallback, useEffect, useState } from 'react';
import { TitleComponent } from '@/components';
import { observer, Observer } from '@formily/react';
import { model } from '@formily/reactive';
import { FormModel, defaultBranches } from '@/pages/rule-engine/Scene/Save';
import BranchItem from './branchItem';
import { service } from '@/pages/rule-engine/Scene/index';
import { Form, FormInstance, Switch } from 'antd';
import type { TriggerType } from '@/pages/rule-engine/Scene/typings';
import Actions from '@/pages/rule-engine/Scene/Save/action';
import { cloneDeep, set } from 'lodash';
import classNames from 'classnames';
import { PlusOutlined } from '@ant-design/icons';
import { randomString } from '@/utils/util';

interface TermsModelProps {
  columnOptions: any[];
}

export const TermsModel = model<TermsModelProps>({
  columnOptions: [],
});

interface Props {
  form: FormInstance;
}

export default observer((props: Props) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (FormModel.current.branches && FormModel.current.branches.length === 1) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [FormModel.current.branches]);

  useEffect(() => {
    return () => {
      TermsModel.columnOptions = [];
    };
  }, []);

  const queryColumn = (data: TriggerType) => {
    const newData: any = cloneDeep(data);
    newData.branches = newData.branches?.filter((item: any) => !!item);
    service.getParseTerm({ trigger: newData }).then((res: any) => {
      TermsModel.columnOptions = res;
    });
  };

  const openChange = useCallback(
    (checked: boolean) => {
      setOpen(checked);
      const key = randomString();
      if (checked) {
        FormModel.current.branches = cloneDeep([...defaultBranches, null as any]);
        set(FormModel.current.options!, 'when', [
          {
            terms: [
              {
                terms: [],
              },
            ],
          },
        ]);
        props.form.setFieldValue(['branches'], [...defaultBranches]);
      } else {
        const newValue = [
          {
            when: [],
            key: 'branches_' + key,
            shakeLimit: {
              enabled: false,
              time: 1,
              threshold: 1,
              alarmFirst: false,
            },
            then: [],
          },
        ];
        FormModel.current.branches = newValue;
        set(FormModel.current.options!, 'when', []);
        props.form.setFieldValue(['branches'], newValue);
      }
    },
    [props.form],
  );

  const addBranches = () => {
    const key = randomString();
    const branchesLength = FormModel.current.branches!.length;
    FormModel.current.branches![branchesLength - 1] = {
      when: [],
      key: key,
      shakeLimit: {
        enabled: false,
        time: 1,
        threshold: 1,
        alarmFirst: false,
      },
      then: [],
    };
  };

  useEffect(() => {
    if (FormModel.current.trigger?.device) {
      queryColumn(FormModel.current.trigger);
    }
  }, [FormModel.current.trigger?.device]);

  return (
    <div className="actions-terms">
      <TitleComponent
        style={{ fontSize: 14 }}
        data={'触发条件'}
        after={
          <Switch
            checked={open}
            onChange={openChange}
            checkedChildren={'开'}
            unCheckedChildren={'关'}
            style={{ marginLeft: 4 }}
          />
        }
      />
      {open ? (
        <Observer>
          {() =>
            FormModel.current.branches?.map((item, index) => {
              const isFirst = index === 0;
              return item ? (
                <BranchItem
                  form={props.form}
                  data={item}
                  isFirst={isFirst}
                  className={isFirst ? 'first-children' : ''}
                  name={index}
                  key={item.key}
                  paramsOptions={TermsModel.columnOptions}
                  onDelete={() => {
                    if (FormModel.current.branches?.length === 2) {
                      FormModel.current.branches?.splice(index, 1, null as any);
                    } else {
                      FormModel.current.branches?.splice(index, 1);
                    }
                    FormModel.current.options?.when?.splice(index, 1);
                  }}
                  onDeleteAll={() => {
                    const newBranches: any[] = FormModel.current.branches || []
                    newBranches.splice(index, FormModel.current.branches?.length - index);
                    if (FormModel.current.branches?.every(item => item !== null)) {
                      newBranches.push(null);
                    }
                    FormModel.current.branches = newBranches;
                    if (FormModel.current.options?.when) {
                      FormModel.current.options.when = [
                        FormModel.current.options?.when[0],
                        FormModel.current.options?.when[index],
                      ];
                    }
                  }}
                />
              ) : (
                <div
                  className="actions-terms-warp"
                  style={{
                    alignItems: 'center',
                    marginTop: FormModel.current.branches?.length === 2 ? 0 : 24,
                  }}
                >
                  <div className="actions-terms-title" style={{ padding: 0 }}>
                    否则
                  </div>
                  <div className={classNames('actions-terms-options no-when')}>
                    <PlusOutlined className={'when-add-button'} onClick={addBranches} />
                  </div>
                </div>
              );
            })
          }
        </Observer>
      ) : (
        <Form.Item
          name={['branches', 0, 'then']}
          rules={[
            {
              validator(_, v) {
                if (!v || (v && !v.length)) {
                  return Promise.reject('至少配置一个执行动作');
                } else {
                  let isActions = false;
                  v.forEach((item: any) => {
                    if (item.actions && item.actions.length) {
                      isActions = true;
                    }
                  });
                  return isActions ? Promise.resolve() : Promise.reject('至少配置一个执行动作');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Actions
            openShakeLimit={true}
            name={0}
            thenOptions={FormModel.current.branches ? FormModel.current.branches[0].then : []}
            onAdd={(data) => {
              if (FormModel.current.branches && data) {
                const newThen = [...FormModel.current.branches[0].then, data];
                FormModel.current.branches[0].then = newThen;
              }
            }}
            onUpdate={(data, type) => {
              const indexOf = FormModel.current.branches![0].then.findIndex(
                (item) => item.parallel === type,
              );
              if (indexOf !== -1) {
                if (data.actions?.length) {
                  FormModel.current.branches![0].then[indexOf] = data;
                } else {
                  FormModel.current.branches![0].then = [];
                }
              }
            }}
          />
        </Form.Item>
      )}
    </div>
  );
});
