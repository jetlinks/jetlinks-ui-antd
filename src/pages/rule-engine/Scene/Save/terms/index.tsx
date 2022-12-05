import { useEffect } from 'react';
import { TitleComponent } from '@/components';
import { observer, Observer } from '@formily/react';
import { model } from '@formily/reactive';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import BranchItem from './branchItem';
import { service } from '@/pages/rule-engine/Scene/index';
import type { TriggerType } from '@/pages/rule-engine/Scene/typings';

interface TermsModelProps {
  columnOptions: any[];
}

export const TermsModel = model<TermsModelProps>({
  columnOptions: [],
});

export default observer(() => {
  const queryColumn = (data: TriggerType) => {
    service.getParseTerm({ trigger: data }).then((res: any) => {
      TermsModel.columnOptions = res;
    });
  };

  useEffect(() => {
    if (FormModel.current.trigger?.device) {
      queryColumn(FormModel.current.trigger);
    }
  }, [FormModel.current.trigger?.device]);

  return (
    <div className="actions-terms">
      <TitleComponent style={{ fontSize: 14 }} data="触发条件" />
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
    </div>
  );
});
