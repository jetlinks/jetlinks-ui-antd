import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import './index.less';
interface Props {
  value: boolean;
  change: (value: boolean) => void;
}

const CheckButton = (props: Props) => {
  return (
    <div className="box">
      <div
        className={classnames('item', {
          active: props.value,
        })}
        onClick={() => {
          props.change(true);
        }}
      >
        <AppstoreOutlined />
      </div>
      <div
        className={classnames('item', {
          active: !props.value,
        })}
        onClick={() => {
          props.change(false);
        }}
      >
        <BarsOutlined />
      </div>
    </div>
  );
};
export default CheckButton;
