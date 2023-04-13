import { Modal } from 'antd';
import Debug from '../Debug';
import Operator from '../Operator';
import styles from './index.less';
import Editor from '@/components/FRuleEditor/Editor';
import { useRef, useState } from 'react';
import {EventEmitter} from "@/components/FRuleEditor/util";

interface Props {
  model: 'advance' | 'simple';
  onChange: (value: 'advance' | 'simple') => void;
  virtualRule?: any;
  id?: string;
}

const Advance = (props: Props) => {
  const { onChange, virtualRule } = props;
  const [, setSuccess] = useState(false);
  const [editorValue, setEditorValue] = useState(virtualRule.script);
  const cacheRef = useRef(virtualRule.script);
  return (
    <Modal
      maskClosable={false}
      visible
      width="70vw"
      title="设置属性规则"
      onCancel={() => onChange('simple')}
      onOk={() => {
        EventEmitter.set('rule-editor-value', cacheRef.current);
        onChange('simple');
      }}
      // okButtonProps={{
      //   disabled: !success,
      // }}
    >
      <div className={styles.box}>
        <div className={styles.left}>
          <Editor
            mode="advance"
            key={'advance'}
            value={virtualRule.script}
            onValueChange={(v) => {
              cacheRef.current = v;
              setEditorValue(v);
              setSuccess(false);
            }}
          />
          <Debug
            virtualRule={{
              ...virtualRule,
              script: editorValue,
            }}
            onSuccess={() => {
              setSuccess(true);
            }}
            id={props.id}
          />
        </div>
        <div className={styles.right}>
          <Operator id={props.id} />
        </div>
      </div>
    </Modal>
  );
};
export default Advance;
