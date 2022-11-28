import { useCallback, useEffect, useState } from 'react';
import { Input, InputNumber, Menu } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import MTimePicker from '../ParamsSelect/components/MTimePicker';
import moment from 'moment';
import ParamsSelect from '../ParamsSelect';
import './index.less';

interface ParamsDropdownProps {
  value?: any;
  source?: string;
  placeholder?: string;
  onChange?: (value: any, lb?: any) => void;
  isMetric?: boolean;
  metricOptions?: any[];
  type?: string;
  options?: any[];
  metricsOptions?: any[];
  name?: number;
  valueType: string;
  showLabelKey?: string;
}

interface MenusProps {
  value: any;
  options?: any[];
  onChange: (value: any, lb: any) => void;
}

const Menus = (props: MenusProps) => {
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    console.log('menus-useEffect', props.value);

    setValue(props.value);
  }, [props.value]);

  return (
    <div className="no-menu-style">
      <Menu
        style={{
          boxShadow: 'none',
          border: 'none',
        }}
        selectedKeys={value ? [value] : undefined}
        items={props.options}
        onClick={({ key, item }: { key: any; item: any }) => {
          const _item = props.options?.find((a) => a.value === item.props.value);
          setValue(key);
          if (_item) {
            props.onChange(_item.value, _item.label);
          }
        }}
      />
    </div>
  );
};

export default (props: ParamsDropdownProps) => {
  const [label, setLabel] = useState('');
  const [myValue, setMyValue] = useState<any>(undefined);
  const [activeKey, setActiveKey] = useState('manual');
  const [open, setOpen] = useState(false);

  const onValueChange = useCallback(
    (value: any, _label: any) => {
      setMyValue(value);
      setLabel(_label);
      const changeValue = {
        value: value,
        source: activeKey,
      };
      props.onChange?.(changeValue, _label);
    },
    [activeKey],
  );

  const renderNode = useCallback(
    (type: string, _v: any, config: any) => {
      let _value = _v;
      if (config.name && Array.isArray(_v)) {
        _value = _v[config.name];
      }

      switch (type) {
        case 'int':
        case 'long':
        case 'float':
        case 'double':
          return (
            <InputNumber
              value={_value}
              onChange={(e: any) => {
                onValueChange(e, e);
              }}
              style={{ width: '100%' }}
              placeholder={'请输入'}
            />
          );
        case 'enum':
          return <Menus value={_value} options={props.options} onChange={onValueChange} />;
        case 'boolean':
          const _options = [
            { label: '是', value: 'true', key: 'true' },
            { label: '否', value: 'false', key: 'false' },
          ];
          return (
            <Menus
              value={_value !== undefined ? String(_value) : undefined}
              options={_options}
              onChange={(v, l) => {
                onValueChange(v === 'true' ? true : false, l);
              }}
            />
          );
        case 'date':
          return (
            <MTimePicker
              value={moment(_value, 'HH:mm:ss')}
              onChange={(_: any, timeString: string) => {
                onValueChange(timeString, timeString);
              }}
            />
          );
        default:
          return (
            <Input
              value={_value}
              placeholder={'请输入'}
              onChange={(e) => {
                const _iv = e.target.value;
                onValueChange(_iv, _iv);
              }}
            />
          );
      }
    },
    [props],
  );

  // const findLable = (value: string, data: any[]): boolean => {
  //   let isLabel = false;
  //   return data.some((item) => {
  //     if (item.key === value) {
  //       let titleKey = 'title'
  //       if (props.showLabelKey) {
  //         titleKey = props.showLabelKey
  //       }
  //       setLabel(item[titleKey]);
  //       isLabel = true;
  //     } else if (item.children) {
  //       isLabel = findLable(value, item.children);
  //     }
  //     return isLabel;
  //   });
  // };

  useEffect(() => {
    console.log('params-dropdown', props.value);

    if (props.value?.value === undefined || props.value?.value === '') {
      setLabel('');
    } else if (props.valueType === 'boolean') {
      if (props.name) {
        if (props.value.value[props.name] === true) {
          setLabel('是');
        } else if (props.value.value[props.name] === false) {
          setLabel('否');
        } else {
          setLabel('');
        }
      } else {
        if (props.value.value === true) {
          setLabel('是');
        } else if (props.value.value === false) {
          setLabel('否');
        } else {
          setLabel('');
        }
      }
    } else if (['enum', 'boolean'].includes(props.valueType)) {
      setLabel(props.name ? props.value.value[props.name] : props.value.value);
    }
    setMyValue(props.value?.value);
    setActiveKey(props.value?.source);
  }, [props.value]);

  useEffect(() => {
    if (props.options) {
      // findLable(props.value?.value, props.options || [])
    }
  }, [props.options]);

  const _itemList = [
    {
      key: 'manual',
      label: '手动输入',
      content: renderNode(props.valueType, myValue, props),
    },
  ];

  if (props.isMetric) {
    _itemList.push({
      key: 'metric',
      label: '指标值',
      content: renderNode('enum', myValue, props),
    });
  }

  return (
    <ParamsSelect
      value={myValue}
      onChange={(value, source) => {
        setActiveKey(source);
        // props.onChange?.({
        //   value,
        //   source
        // }, label )
      }}
      tabKey={activeKey}
      itemList={_itemList}
      style={{ width: 'auto', display: 'inline-block' }}
      type={props.valueType}
      open={open}
      openChange={setOpen}
    >
      <div
        className={classNames(styles['dropdown-button'], styles.value)}
        onClick={() => {
          setOpen(true);
        }}
      >
        {label || props.placeholder}
      </div>
    </ParamsSelect>
  );
};
