import { Modal } from 'antd';
import Debug from '../Debug';
import Operator from '../Operator';
import styles from './index.less';
import Editor from '@/components/FRuleEditor/Editor';
import { useRef, useState } from 'react';
import { Store } from 'jetlinks-store';

interface Props {
  model: 'advance' | 'simple';
  onChange: (value: 'advance' | 'simple') => void;
  virtualRule?: any;
  id?: string;
}

const Advance = (props: Props) => {
  const { model, onChange, virtualRule } = props;
  const [success, setSuccess] = useState(false);
  const cacheRef = useRef();
  return (
    <Modal
      maskClosable={false}
      visible={model === 'advance'}
      width="70vw"
      title="设置属性规则"
      onCancel={() => onChange('simple')}
      onOk={() => {
        Store.set('rule-editor-value', cacheRef.current);
        onChange('simple');
      }}
      okButtonProps={{
        disabled: !success,
      }}
    >
      <div className={styles.box}>
        <div className={styles.left}>
          <Editor
            mode="advance"
            onValueChange={(v) => {
              cacheRef.current = v;
              setSuccess(false);
            }}
          />
          <Debug
            virtualRule={virtualRule}
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
