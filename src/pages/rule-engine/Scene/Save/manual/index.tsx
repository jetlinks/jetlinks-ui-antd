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
            onAdd={(data) => {
              if (FormModel.current.branches) {
                FormModel.current.branches[0].then.push(data);
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
        )}
      </Observer>
    </div>
  );
});
