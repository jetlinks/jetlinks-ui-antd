import { ReactNode, useCallback, useEffect, useState } from 'react';
import { Input, InputNumber, Menu, Tree } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import MTimePicker from '../ParamsSelect/components/MTimePicker';
import moment from 'moment';
import ParamsSelect from '../ParamsSelect';
import './index.less';
import { isEqual } from 'lodash';

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
  icon?: ReactNode;
  open?: boolean;
  openChange?: (open: boolean) => void;
  enumList?: any[];
}

interface MenusProps {
  value: any;
  options?: any[];
  onChange: (value: any, lb: any, node: any) => void;
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
          // console.log(item.props);
          const _item = props.options?.find((a) => a.value === item.props.value);
          setValue(key);
          if (_item) {
            props.onChange(_item.value, _item.label, item.props);
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

  useEffect(() => {
    setOpen(!!props.open);
  }, [props.open]);

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
      // console.log('type---',type,props.enumList)
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
        case 'metric':
          return (
            <Menus
              value={_value}
              options={props.metricsOptions}
              onChange={(v, l, node) => {
                onValueChange(v, l, node);
                setOpen(false);
              }}
            />
          );
        case 'enum':
          const _enums = props.enumList?.map((item) => ({
            label: item.name,
            value: item.id,
            key: item.id,
          }));
          return (
            <Menus
              value={_value}
              options={_enums}
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
              type={'time'}
              onChange={(_: any, timeString: string) => {
                onValueChange(timeString, timeString);
                setOpen(false);
              }}
              onOpen={() => {
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

  const findLabel = (value: string, data: any[], titleName?: string): boolean => {
    let isLabel = false;
    return data.some((item) => {
      if (isEqual(item.key, value)) {
        let titleKey = 'title';
        if (titleName) {
          titleKey = titleName;
        }
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
        case 'metric':
          props.metricsOptions?.forEach((item) => {
            if (item.value === v) {
              setLabel(item.label);
            }
          });
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
        valueLabel(_value, props.isMetric ? 'metric' : props.valueType);
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
      findLabel(_value, props.BuiltInOptions || [], '');
    }
  }, [props.BuiltInOptions]);

  useEffect(() => {
    if (props.metricsOptions) {
      let _value = props.value?.value;
      if ('name' in props) {
        _value = props.value?.value?.[props.name!];
      }
      findLabel(_value, props.metricsOptions || [], 'name');
    }
  }, [props.metricsOptions]);

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
        content: renderNode('metric', myValue, props),
      });
    }
  }

  return (
    <ParamsSelect
      value={myValue}
      onChange={(value, source) => {
        setActiveKey(source);
        // onValueChange(undefined, '')
        setMyValue(undefined);
        setLabel('');
        const changeValue = {
          value: value,
          source: source,
        };
        props.onChange?.(changeValue, '', {});
      }}
      tabKey={activeKey}
      itemList={_itemList}
      style={{ width: 'auto' }}
      bodyStyle={{ width: 'auto' }}
      type={props.valueType}
      open={open}
      openChange={(_open) => {
        setOpen(_open);
        props.openChange?.(_open);
      }}
    >
      <div
        className={classNames(styles['dropdown-button'], styles.value)}
        onClick={() => {
          setOpen(true);
        }}
      >
        {props.icon}
        {label || props.placeholder}
      </div>
    </ParamsSelect>
  );
};
