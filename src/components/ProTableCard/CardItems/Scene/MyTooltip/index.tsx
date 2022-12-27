import { TooltipProps } from 'antd/lib/tooltip';
import { Tooltip } from 'antd';

export default (props: TooltipProps) => {
  return <Tooltip {...props} overlayInnerStyle={{ color: 'black' }} color={'white'} />;
};
