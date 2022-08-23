import { Modal } from 'antd';
import Debug from '../Debug';
import Operator from '../Operator';
import styles from './index.less';
import Editor from '@/components/FRuleEditor/Editor';

interface Props {
  model: 'advance' | 'simple';
  onChange: (value: 'advance' | 'simple') => void;
  virtualRule?: any;
}

const Advance = (props: Props) => {
  const { model, onChange, virtualRule } = props;
  return (
    <Modal
      maskClosable={false}
      visible={model === 'advance'}
      width="70vw"
      title="设置属性规则"
      onCancel={() => onChange('simple')}
      onOk={() => onChange('simple')}
    >
      <div className={styles.box}>
        <div className={styles.left}>
          <Editor mode="advance" />
          <Debug virtualRule={virtualRule} />
        </div>
        <div className={styles.right}>
          <Operator />
        </div>
      </div>
    </Modal>
  );
};
export default Advance;
