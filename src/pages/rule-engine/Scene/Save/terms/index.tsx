import { useEffect } from 'react';
import { TitleComponent } from '@/components';
import { observer, Observer } from '@formily/react';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import BranchItem from './branchItem';

export default observer(() => {
  const queryColumn = () => {};

  useEffect(() => {
    if (FormModel.trigger?.device) {
      queryColumn();
    }
  }, [FormModel.trigger?.device]);

  return (
    <div className="actions-terms">
      <TitleComponent style={{ fontSize: 14 }} data="触发条件" />
      <Observer>
        {() =>
          FormModel.branches?.map((item, index) => {
            const isFrist = index === 0;
            return <BranchItem data={item} isFrist={isFrist} name={index} />;
          })
        }
      </Observer>
    </div>
  );
});
