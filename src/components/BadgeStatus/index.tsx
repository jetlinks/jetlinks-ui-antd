import { Badge } from 'antd';

/**
 * 状态色
 */
export enum StatusColorEnum {
  'success' = 'success',
  'error' = 'error',
  'processing' = 'processing',
  'warning' = 'warning',
  'default' = 'default',
}

export type StatusColorType = keyof typeof StatusColorEnum;

export interface BadgeStatusProps {
  text: string;
  status: string | number;
  /**
   * 自定义status值颜色
   * @example {
   *   1: 'success',
   *   0: 'error'
   * }
   */
  statusNames?: Record<string | number, StatusColorType>;
}

export default (props: BadgeStatusProps) => {
  const handleStatusColor = (): StatusColorType | undefined => {
    if ('statusNames' in props) {
      return props.statusNames![props.status];
    }
    return StatusColorEnum['default'];
  };

  return <Badge status={handleStatusColor()} text={props.text} />;
};
