import { useEffect, useState } from 'react';
import { TitleComponent } from '@/components';
import { observer, Observer } from '@formily/react';
import { model } from '@formily/reactive';
import { FormModel, defaultBranches } from '@/pages/rule-engine/Scene/Save';
import BranchItem from './branchItem';
import { service } from '@/pages/rule-engine/Scene/index';
import { Form, Switch } from 'antd';
import type { TriggerType } from '@/pages/rule-engine/Scene/typings';
import Actions from '@/pages/rule-engine/Scene/Save/action';
import { cloneDeep, set } from 'lodash';
import classNames from 'classnames';
import { PlusCircleOutlined } from '@ant-design/icons';
import { randomString } from '@/utils/util';

interface TermsModelProps {
  columnOptions: any[];
}

export const TermsModel = model<TermsModelProps>({
  columnOptions: [],
});

export default observer(() => {
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

  const openChange = (checked: boolean) => {
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
    } else {
      FormModel.current.branches = [
        {
          when: [],
          key: 'branches_' + key,
          shakeLimit: {
            enabled: false,
            time: 0,
            threshold: 0,
            alarmFirst: false,
          },
          then: [],
        },
      ];
      set(FormModel.current.options!, 'when', []);
    }
  };

  const addBranches = () => {
    const key = randomString();
    const branchesLength = FormModel.current.branches!.length;
    FormModel.current.branches![branchesLength - 1] = {
      when: [],
      key: key,
      shakeLimit: {
        enabled: false,
        time: 0,
        threshold: 0,
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
        data={
          <span>
            触发条件{' '}
            <Switch
              checked={open}
              onChange={openChange}
              checkedChildren={'开'}
              unCheckedChildren={'关'}
            />
          </span>
        }
      />
      {open ? (
        <Observer>
          {() =>
            FormModel.current.branches?.map((item, index) => {
              const isFirst = index === 0;
              return item ? (
                <BranchItem
                  data={item}
                  isFirst={isFirst}
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
                    FormModel.current.branches?.splice(
                      index,
                      FormModel.current.branches!.length - 1,
                      null as any,
                    );
                  }}
                />
              ) : (
                <div className="actions-terms-warp" style={{ alignItems: 'center' }}>
                  <div className="actions-terms-title" style={{ padding: 0 }}>
                    否则
                  </div>
                  <div className={classNames('actions-terms-options no-when')}>
                    <PlusCircleOutlined
                      className={'add-button-color'}
                      style={{ fontSize: 32 }}
                      onClick={addBranches}
                    />
                  </div>
                </div>
              );
            })
          }
        </Observer>
      ) : (
        <Form.Item>
          <Actions
            openShakeLimit={true}
            name={0}
            thenOptions={FormModel.current.branches ? FormModel.current.branches[0].then : []}
            onAdd={(data) => {
              if (FormModel.current.branches && data) {
                FormModel.current.branches[0].then = [...FormModel.current.branches[0].then, data];
              }
            }}
            onUpdate={(data, type) => {
              const indexOf = FormModel.current.branches![0].then.findIndex(
                (item) => item.parallel === type,
              );
              if (indexOf !== -1) {
                FormModel.current.branches![0].then[indexOf] = data;
              }
            }}
          />
        </Form.Item>
      )}
    </div>
  );
});
