import Advance from '@/components/FRuleEditor/Advance';
import Editor from '@/components/FRuleEditor/Editor';
import { model } from '@formily/reactive';
import { observer } from '@formily/react';
import { useEffect } from 'react';
import {EventEmitter} from "@/components/FRuleEditor/util";

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
  virtualRule?: any;
  id?: string;
}

const FRuleEditor = observer((props: Props) => {
  const { value, onChange, property, virtualRule } = props;
  console.log(virtualRule)
  useEffect(() => {
    // console.log(value, 111111111);
    State.property = property;
    const subscription = EventEmitter.subscribe('rule-editor-value', onChange);
    State.code = value;
    return () => {
      console.log('unsubscribe')
      subscription.unsubscribe('rule-editor-value', onChange);
      State.code = '';
    };
  }, []);
  return (
    <>
      <Editor
        key={'simple'}
        onChange={(v) => {
          State.model = v;
        }}
        value={value}
        id={props.id}
      />
      {State.model === 'advance' && (
        <Advance
          model={State.model}
          virtualRule={virtualRule}
          id={props.id}
          onChange={(v) => {
            State.model = v;
          }}
        />
      )}
    </>
  );
});
export default FRuleEditor;
