import Action from '../action';
import { Observer } from '@formily/react';
import { FormModel } from '@/pages/rule-engine/Scene/Save';

export default () => {
  return (
    <div>
      <Observer>
        {() => (
          <Action
            thenOptions={FormModel.current.branches ? FormModel.current.branches[0].then : []}
            name={0}
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
        )}
      </Observer>
    </div>
  );
};
