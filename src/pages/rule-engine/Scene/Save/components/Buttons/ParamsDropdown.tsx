import { useEffect, useMemo, useState } from 'react';
import { Dropdown, Tabs } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

interface ParamsDropdownProps {
  value?: any;
  source?: string;
  placeholder?: string;
  onChange?: (value?: string) => void;
  isMetric?: boolean;
  metricOptions?: any[];
  type?: string;
  options?: any[];
}

export default (props: ParamsDropdownProps) => {
  const [label] = useState('');
  //   const [myValue, setMyValue] = useState(undefined);
  const [, setSource] = useState('');
  const [activeKey, setActiveKey] = useState('value_1');

  const tabsChange = (key: string) => {
    setActiveKey(key);
    if (key.includes('value')) {
      setSource('value');
    } else {
      setSource('metric');
    }
  };

  useEffect(() => {}, [props.value]);

  const DropdownRender = useMemo(() => {
    return (
      <Tabs activeKey={activeKey} onChange={tabsChange}>
        <Tabs.TabPane key="value_1"></Tabs.TabPane>
        {props.isMetric && <Tabs.TabPane key="metric"></Tabs.TabPane>}
      </Tabs>
    );
  }, [props.isMetric]);

  return (
    <Dropdown dropdownRender={() => DropdownRender} trigger={['click']}>
      <div className={classNames(styles['dropdown-button'], styles.value)}>
        {label || props.placeholder}
      </div>
    </Dropdown>
  );
};
