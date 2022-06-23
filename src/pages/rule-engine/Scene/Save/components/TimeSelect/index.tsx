import { Dropdown, Menu } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { DownOutlined } from '@ant-design/icons';
import './index.less';

type OptionItemType = {
  label: string;
  value: number;
};

interface TimeSelect {
  value?: number[];
  onChange?: (value: number[]) => void;
  options?: OptionItemType[];
  className?: string;
  style?: React.CSSProperties;
}

export default (props: TimeSelect) => {
  const [checkedKeys, setCheckedKeys] = useState<any[]>(props.value || []);
  const [checkedNames, setCheckedNames] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);

  const onchange = (keys: (number | string)[]) => {
    if (props.onChange) {
      props.onChange(keys.filter((key) => key !== 'null').map(Number));
    }
  };

  const onclick = useCallback(
    ({ key, domEvent }: any) => {
      domEvent.stopPropagation();
      const isSelected = checkedKeys.includes(key);
      if (key === 'null') {
        onchange(isSelected ? [] : props.options!.map((item) => item.value));
      } else {
        const Keys = isSelected
          ? checkedKeys.filter((_key) => _key !== key)
          : [...checkedKeys, key];
        const noAllKeys = Keys.filter((item) => item !== 'null');
        onchange(noAllKeys);
      }
    },
    [checkedKeys, props.options],
  );

  useEffect(() => {
    if (props.value && props.options) {
      if (props.value.length >= props.options.length) {
        setCheckedKeys([...props.value, 'null'].map(String));
        setCheckedNames([...props.options.map((item) => item.label), '每天']);
      } else {
        setCheckedKeys(props.value.map(String));
        const selectedItems = props.options.filter((item) => {
          return props.value!.some((b) => item.value === b);
        });
        setCheckedNames(selectedItems.map((item) => item.label));
      }
    } else {
      setCheckedKeys([]);
      setCheckedNames([]);
    }
  }, [props.value, props.options]);

  const menu = (
    <Menu multiple={true} selectedKeys={checkedKeys} onClick={onclick}>
      <Menu.Item key={'null'}>每天</Menu.Item>
      {props.options &&
        props.options.map((item) => <Menu.Item key={item.value}>{item.label}</Menu.Item>)}
    </Menu>
  );

  useEffect(() => {
    document.body.onclick = (e) => {
      const elem: any = e.target;
      const isSelectDom = elem && elem.className?.includes?.('time-select');

      if (!isSelectDom) {
        setVisible(false);
      }
    };
    return () => {
      document.body.onclick = null;
    };
  }, []);

  return (
    <Dropdown
      overlay={menu}
      overlayStyle={{
        maxHeight: 300,
        overflowY: 'auto',
      }}
      visible={visible}
      getPopupContainer={() => document.querySelector('#timeSelect')!}
    >
      <div
        className={classNames('time-select', props.className)}
        style={props.style}
        onClick={(e) => {
          e.stopPropagation();
          setVisible(!visible);
        }}
        id={'timeSelect'}
      >
        <div className={'time-select-content ellipsis'}>
          {checkedNames.length ? (
            checkedKeys.includes('null') ? (
              '每天'
            ) : (
              checkedNames.toString()
            )
          ) : (
            <span style={{ color: 'rgba(0,0,0,.3)' }}>请选择时间</span>
          )}
        </div>
        <DownOutlined />
      </div>
    </Dropdown>
  );
};
