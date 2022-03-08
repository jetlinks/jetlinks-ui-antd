import Advance from '@/components/FRuleEditor/Advance';
import Editor from '@/components/FRuleEditor/Editor';
import { model } from '@formily/reactive';
import { observer } from '@formily/react';
import { useEffect } from 'react';
import { Store } from 'jetlinks-store';

export const State = model<{
  model: 'simple' | 'advance';
  code: string;
}>({
  model: 'simple',
  code: '',
});

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const FRuleEditor = observer((props: Props) => {
  const { value, onChange } = props;

  useEffect(() => {
    const subscription = Store.subscribe('rule-editor-value', onChange);
    State.code = value;
    return () => subscription.unsubscribe();
  });
  return (
    <>
      <Editor
        onChange={(v) => {
          State.model = v;
        }}
      />
      <Advance
        model={State.model}
        onChange={(v) => {
          State.model = v;
        }}
      />
    </>
  );
});
export default FRuleEditor;
