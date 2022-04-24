import { ArrayItems } from '@formily/antd';
import { Input } from 'antd';

interface Props {
  name?: string;
  value: string;
  onChange: () => void;
}

const LevelInput = (props: Props) => {
  const alarm1 = require('/public/images/alarm/alarm1.png');
  const alarm2 = require('/public/images/alarm/alarm2.png');
  const alarm3 = require('/public/images/alarm/alarm3.png');
  const alarm4 = require('/public/images/alarm/alarm4.png');
  const alarm5 = require('/public/images/alarm/alarm5.png');

  const imgMap = {
    0: alarm1,
    1: alarm2,
    2: alarm3,
    3: alarm4,
    4: alarm5,
  };
  const index = ArrayItems.useIndex!();
  return (
    <div>
      <img src={imgMap[index]} alt="" />
      级别{index + 1}
      <Input onChange={props.onChange} value={props.value} />
    </div>
  );
};
export default LevelInput;
