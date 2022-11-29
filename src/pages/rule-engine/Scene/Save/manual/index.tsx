import Action from '../action';
import { Observer, observer } from '@formily/react';
import { FormModel } from '@/pages/rule-engine/Scene/Save';

export default observer(() => {
  return (
    <div>
      <Observer>
        {() => (
          <Action
            thenOptions={FormModel.current.branches ? FormModel.current.branches[0].then : []}
            name={0}
          />
        )}
      </Observer>
    </div>
  );
});
