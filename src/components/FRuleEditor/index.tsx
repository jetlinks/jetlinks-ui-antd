import Advance from '@/components/FRuleEditor/Advance';
import Editor from '@/components/FRuleEditor/Editor';
import { model } from '@formily/reactive';
import { observer } from '@formily/react';
import { useEffect } from 'react';
import { Store } from 'jetlinks-store';

export const State = model<{
  model: 'simple' | 'advance';
  code: string;
  property?: string;
  log: {
    content: string;
    time: number;
  }[];
}>({
  model: 'simple',
  code: '',
  log: [],
});

interface Props {
  value: string;
  onChange: (value: string) => void;
  property?: string;
}

const FRuleEditor = observer((props: Props) => {
  const { value, onChange, property } = props;
  useEffect(() => {
    State.property = property;
    const subscription = Store.subscribe('rule-editor-value', onChange);
    State.code = value;
    return () => {
      subscription.unsubscribe();
      State.code = '';
    };
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
