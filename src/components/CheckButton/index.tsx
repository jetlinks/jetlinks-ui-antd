import { AppstoreFilled, UnorderedListOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import styles from './index.less';
interface Props {
  value: boolean;
  change: (value: boolean) => void;
}

const CheckButton = (props: Props) => {
  const activeStyle = {
    border: '1px solid #1d39c4',
    color: '#1d39c4',
  };

  return (
    <div className={styles.box}>
      <div
        className={classnames(styles.item, styles.left)}
        style={props.value ? activeStyle : {}}
        onClick={() => {
          props.change(true);
        }}
      >
        <AppstoreFilled />
      </div>
      <div
        className={classnames(styles.item, styles.right)}
        style={!props.value ? activeStyle : {}}
        onClick={() => {
          props.change(false);
        }}
      >
        <UnorderedListOutlined />
      </div>
    </div>
  );
};
export default CheckButton;
