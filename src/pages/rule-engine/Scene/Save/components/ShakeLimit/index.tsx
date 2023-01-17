import { useEffect, useState } from 'react';
import { Switch, InputNumber, Radio } from 'antd';
import type { ShakeLimitType } from '@/pages/rule-engine/Scene/typings';
import Styles from './index.less';

const alarmFirstOptions = [
  { label: '第一次', value: true },
  { label: '最后一次', value: false },
];

interface ShakeLimitProps extends Partial<ShakeLimitType> {
  onChange?: (type: string, value: any) => void;
}

export default (props: ShakeLimitProps) => {
  const [enabled, setEnabled] = useState<boolean | undefined>(!!props.enabled);
  const [time, setTime] = useState<number | undefined | null>(props.time || 1);
  const [threshold, setThreshold] = useState<number | undefined | null>(props.threshold || 1);
  const [alarmFirst, setAlarmFirst] = useState<boolean | undefined>(!!props.alarmFirst);

  useEffect(() => {
    setEnabled(props.enabled);
  }, [props.enabled]);

  useEffect(() => {
    setTime(props.time);
  }, [props.time]);

  useEffect(() => {
    setThreshold(props.threshold);
  }, [props.threshold]);

  useEffect(() => {
    setAlarmFirst(props.alarmFirst);
  }, [props.alarmFirst]);

  const enabledChange = (value: boolean) => {
    setEnabled(value);
    props.onChange?.('enabled', value);
  };

  const timeChange = (value: number | null) => {
    setTime(value);
    props.onChange?.('time', value);
  };

  const thresholdChange = (value: number | null) => {
    setThreshold(value);
    props.onChange?.('threshold', value);
  };

  const alarmFirstChange = (value: boolean) => {
    setAlarmFirst(value);
    props.onChange?.('alarmFirst', value);
  };

  return (
    <div className={Styles.shakeLimit}>
      <Switch
        checkedChildren="开启防抖"
        unCheckedChildren="关闭防抖"
        checked={enabled}
        onChange={enabledChange}
        style={{ marginRight: 12 }}
      />
      {enabled ? (
        <>
          <InputNumber
            min={1}
            max={100}
            precision={0}
            value={time}
            onChange={timeChange}
            style={{ width: 32 }}
            size={'small'}
          />
          <span>秒内发送</span>
          <InputNumber
            min={1}
            max={100}
            precision={0}
            value={threshold}
            onChange={thresholdChange}
            style={{ width: 32 }}
            size={'small'}
          />
          <span>次及以上时，处理</span>
          <Radio.Group
            options={alarmFirstOptions}
            optionType="button"
            value={alarmFirst}
            size={'small'}
            onChange={(e) => alarmFirstChange(e.target.value)}
          />
        </>
      ) : null}
    </div>
  );
};
