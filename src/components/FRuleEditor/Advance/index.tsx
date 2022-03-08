import { Modal } from 'antd';
import Debug from '../Debug';
import Operator from '../Operator';
import styles from './index.less';
import Editor from '@/components/FRuleEditor/Editor';

interface Props {
  model: 'advance' | 'simple';
  onChange: (value: 'advance' | 'simple') => void;
}

const Advance = (props: Props) => {
  const { model, onChange } = props;
  return (
    <Modal
      visible={model === 'advance'}
      width="70vw"
      title="设置属性规则"
      onCancel={() => onChange('simple')}
    >
      <div className={styles.box}>
        <div className={styles.left}>
          <Editor mode="advance" />
          <Debug />
        </div>
        <div className={styles.right}>
          <Operator data={{}} />
        </div>
      </div>
    </Modal>
  );
};
export default Advance;
