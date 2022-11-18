import { useEffect } from 'react';
import { TitleComponent } from '@/components';
import { observer } from '@formily/react';
import { FormModel } from '@/pages/rule-engine/Scene/Save';
import Term from './term';

export default observer(() => {
  const queryColumn = () => {};

  useEffect(() => {
    console.log('terms', FormModel.trigger?.device);
    if (FormModel.trigger?.device) {
      queryColumn();
    }
  }, [FormModel.trigger?.device]);

  return (
    <div className="actions-terms">
      <TitleComponent style={{ fontSize: 14 }} data="触发条件" />
      <Term />
    </div>
  );
});
