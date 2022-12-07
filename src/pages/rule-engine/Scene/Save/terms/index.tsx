import { useEffect, useState } from 'react';
import { TitleComponent } from '@/components';
import { observer, Observer } from '@formily/react';
import { model } from '@formily/reactive';
import { FormModel, defaultBranches } from '@/pages/rule-engine/Scene/Save';
import BranchItem from './branchItem';
import { service } from '@/pages/rule-engine/Scene/index';
import { Switch } from 'antd';
import type { TriggerType } from '@/pages/rule-engine/Scene/typings';
import Actions from '@/pages/rule-engine/Scene/Save/action';
import { cloneDeep } from 'lodash';

interface TermsModelProps {
  columnOptions: any[];
}

export const TermsModel = model<TermsModelProps>({
  columnOptions: [],
});

export default observer(() => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    console.log('terms-effect', FormModel.current.branches);
    if (FormModel.current.branches && FormModel.current.branches.length === 1) {
      setOpen(false);
    }
  }, [FormModel.current.branches]);

  const queryColumn = (data: TriggerType) => {
    service.getParseTerm({ trigger: data }).then((res: any) => {
      TermsModel.columnOptions = res;
    });
  };

  const openChange = (checked: boolean) => {
    console.log('terms-effect-change');
    setOpen(checked);
    if (checked) {
      FormModel.current.branches = cloneDeep([
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
      ]);
    } else {
      FormModel.current.branches = [
        {
          when: [],
          key: 'branches_' + new Date().getTime(),
          shakeLimit: {
            enabled: false,
            time: 0,
            threshold: 0,
            alarmFirst: false,
          },
          then: [],
        },
      ];
    }
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
              const isFrist = index === 0;
              return (
                <BranchItem
                  data={item}
                  isFrist={isFrist}
                  name={index}
                  paramsOptions={TermsModel.columnOptions}
                  onDelete={() => {
                    FormModel.current.branches?.splice(index, 1);
                    FormModel.current.options?.when?.splice(index, 1);
                  }}
                />
              );
            })
          }
        </Observer>
      ) : (
        <Actions
          openShakeLimit={true}
          name={0}
          thenOptions={FormModel.current.branches ? FormModel.current.branches[0].then : []}
        />
      )}
    </div>
  );
});
