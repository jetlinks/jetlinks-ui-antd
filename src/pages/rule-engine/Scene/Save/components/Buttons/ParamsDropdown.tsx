import { useCallback, useEffect, useState } from 'react';
import { Input, InputNumber, Menu, Tree } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import MTimePicker from '../ParamsSelect/components/MTimePicker';
import moment from 'moment';
import ParamsSelect from '../ParamsSelect';
import './index.less';

export interface ParamsDropdownProps {
  value?: any;
  source?: string;
  placeholder?: string;
  onChange?: (value: any, lb?: any, node?: any) => void;
  isMetric?: boolean;
  metricOptions?: any[];
  type?: string;
  options?: any[];
  BuiltInOptions?: any[];
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
  const [activeKey, setActiveKey] = useState(props.BuiltInOptions ? 'fixed' : 'manual');
  const [open, setOpen] = useState(false);

  const onValueChange = useCallback(
    (value: any, _label: any, item?: any) => {
      setMyValue(value);
      setLabel(_label);
      const changeValue = {
        value: value,
        source: activeKey,
      };
      props.onChange?.(changeValue, _label, item);
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
          return (
            <Menus
              value={_value}
              options={props.options}
              onChange={(v, l) => {
                onValueChange(v, l);
                setOpen(false);
              }}
            />
          );
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
                setOpen(false);
              }}
            />
          );
        case 'date':
          return (
            <MTimePicker
              value={_value ? moment(_value, 'HH:mm:ss') : undefined}
              onChange={(_: any, timeString: string) => {
                onValueChange(timeString, timeString);
                setOpen(false);
              }}
            />
          );
        case 'tree':
          return (
            <div style={{ overflowY: 'auto', maxHeight: 400 }}>
              <Tree
                selectedKeys={_value ? [_value] : []}
                onSelect={(selectedKeys, e) => {
                  let titleKey = 'title';
                  if (props.showLabelKey) {
                    titleKey = props.showLabelKey;
                  }
                  onValueChange(selectedKeys[0], e.node[titleKey], e.node);
                  setOpen(false);
                }}
                style={{ width: 300 }}
                treeData={props.BuiltInOptions}
              />
            </div>
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
    [props, activeKey],
  );

  const findLabel = (value: string, data: any[]): boolean => {
    let isLabel = false;
    return data.some((item) => {
      if (item.key === value) {
        let titleKey = 'title';
        if (props.showLabelKey) {
          titleKey = props.showLabelKey;
        }
        setLabel(item[titleKey]);
        isLabel = true;
      } else if (item.children) {
        isLabel = findLabel(value, item.children);
      }
      return isLabel;
    });
  };

  const valueLabel = useCallback(
    (v: any, type: string) => {
      switch (type) {
        case 'boolean':
          setLabel(v ? '是' : '否');
          break;
        case 'enum':
        case 'object':
          findLabel(v, props.options || []);
          break;
        case 'built':
          findLabel(v, props.BuiltInOptions || []);
          break;
        default:
          setLabel(v + '');
      }
    },
    [props.options, props.BuiltInOptions],
  );

  const initData = useCallback(() => {
    let _value = props.value?.value;
    if ('name' in props && _value) {
      _value = props.value?.value?.[props.name!];
    }
    setMyValue(_value);
    if (_value === undefined || _value === '') {
      setLabel('');
    } else {
      if (props.BuiltInOptions && props.value.source === 'upper') {
        valueLabel(_value, 'built');
      } else {
        valueLabel(_value, props.valueType);
      }
    }
  }, [props.value, props.options, props.valueType, props.BuiltInOptions]);

  useEffect(() => {
    initData();
    if (props.value?.source) {
      setActiveKey(props.value?.source);
    } else {
      setActiveKey(props.BuiltInOptions ? 'fixed' : 'manual');
    }
  }, [props.value, props.valueType]);

  useEffect(() => {
    if (props.BuiltInOptions) {
      let _value = props.value?.value;
      if ('name' in props) {
        _value = props.value?.value[props.name!];
      }
      findLabel(_value, props.BuiltInOptions || []);
    }
  }, [props.BuiltInOptions]);

  let _itemList = [];

  if ('BuiltInOptions' in props) {
    _itemList = [
      {
        key: 'fixed',
        label: '手动输入',
        content: renderNode(props.valueType, myValue, props),
      },
      {
        key: 'upper',
        label: '内置参数',
        content: renderNode('tree', myValue, props),
      },
    ];
  } else {
    _itemList = [
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
  }

  return (
    <ParamsSelect
      value={myValue}
      onChange={(value, source) => {
        console.log(value, source);
        setActiveKey(source);
        // props.onChange?.({
        //   value,
        //   source
        // }, label )
      }}
      tabKey={activeKey}
      itemList={_itemList}
      style={{ width: 'auto' }}
      bodyStyle={{ width: 'auto' }}
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
