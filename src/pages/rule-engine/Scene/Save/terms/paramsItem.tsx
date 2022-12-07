import { useEffect, useState, useCallback, useRef } from 'react';
import type { TermsType, TermsVale } from '@/pages/rule-engine/Scene/typings';
import {
  DropdownButton,
  ParamsDropdown,
  useOption,
} from '@/pages/rule-engine/Scene/Save/components/Buttons';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { observer } from '@formily/react';
import './index.less';
import { Space } from 'antd';

interface ParamsItemProps {
  data: TermsType;
  pName: (number | string)[];
  name: number;
  isLast: boolean;
  isDelete: boolean;
  options: any[];
  onValueChange?: (value: TermsType) => void;
  onLabelChange?: (label: string) => void;
  onAdd: () => void;
  onDelete: () => void;
}

const handleName = (_data: any) => (
  <Space>
    {_data.name}
    <div style={{ color: 'grey', marginLeft: '5px' }}>{_data.fullName}</div>
    {_data.description && (
      <div style={{ color: 'grey', marginLeft: '5px' }}>({_data.description})</div>
    )}
  </Space>
);

const handleOptions = (options: any[]): any[] => {
  if (!options) return [];

  return options.map((item) => {
    const disabled = item.children?.length > 0;
    return {
      ...item,
      column: item.column,
      key: item.column,
      value: item.column,
      title: handleName(item),
      disabled: disabled,
      children: handleOptions(item.children),
    };
  });
};

const DoubleFilter = ['nbtw', 'btw', 'in', 'nin'];
const ParamsItem = observer((props: ParamsItemProps) => {
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [ttOptions, setTtOptions] = useState<any[]>([]);
  const [valueOptions] = useState<any>(undefined);
  const [metricsOptions, setMetricsOptions] = useState<any[]>([]);
  const [valueType, setValueType] = useState('');

  const { paramOptions, valueOptions: paramsValueOptions } = useOption(props.options, 'column');

  const [value, setValue] = useState<Partial<TermsVale> | undefined>({
    value: undefined,
    source: 'fixed',
  });
  const [termType, setTermType] = useState('');
  const [column, setColumn] = useState('');
  const [label, setLabel] = useState<any[]>([undefined, undefined, {}]);

  const ValueRef = useRef<Partial<TermsType>>({
    column: '',
    termType: '',
    value: undefined,
  });

  const valueChange = useCallback(
    (_value: any) => {
      console.log({ ..._value });
      props.onValueChange?.({ ..._value });
    },
    [column, termType, value],
  );

  const valueEventChange = useCallback(
    (_v: any) => {
      console.log('valueEventChange', column, termType);

      valueChange({
        column: ValueRef.current.column,
        termType: ValueRef.current.termType,
        value: _v,
      });
    },
    [column, termType],
  );

  const convertLabelValue = useCallback(
    (columnValue?: string) => {
      if (columnValue && paramOptions.length) {
        console.log('paramsValueOptions ===>>', paramsValueOptions);
        const labelOptions = paramsValueOptions.get(columnValue);
        const _termTypeOptions: any[] =
          labelOptions?.termTypes?.map((tItem: any) => ({ title: tItem.name, key: tItem.id })) ||
          [];
        setTtOptions(_termTypeOptions);
        setValueType(labelOptions.dataType);
        if (labelOptions.metrics) {
          // 指标值
          const _metrics = labelOptions.metrics.map((mItem: any) => ({
            title: mItem.name,
            key: mItem.id,
          }));
          setMetricsOptions(_metrics);
        }
      }
    },
    [paramOptions, paramsValueOptions],
  );

  useEffect(() => {
    setTermType(props.data.termType || '');
    setValue(props.data.value);
    setColumn(props.data.column || '');
    ValueRef.current = props.data || {};
    convertLabelValue(props.data.column);
  }, [props.data]);

  useEffect(() => {
    convertLabelValue(props.data.column);
  }, [props.options]);

  const handleOptionsLabel = useCallback(
    (c: string, t: string, v: any) => {
      const termsTypeKey = {
        eq: '等于_value',
        neq: '不等于_value',
        gt: '大于_value',
        gte: '大于等于_value',
        lt: '小于_value',
        lte: '小于等于_value',
        btw: '在_value和_value2之间',
        nbtw: '不在_value和_value2之间',
        time_gt_now: '距离当前时间大于_value秒',
        time_lt_now: '距离当前时间小于_value秒',
        in: '在_value,_value2之中',
        nin: '不在_value,_value2之中',
      };
      const typeKey = {
        and: '并且',
        or: '或者',
      };
      const typeStr = props.isLast ? '' : typeKey[props.data.type!];
      if (DoubleFilter.includes(t)) {
        const str = termsTypeKey[t].replace('_value', v[0]).replace('_value2', v[1]);
        return `${c} ${str} ${typeStr}`;
      }
      const str = termsTypeKey[t].replace('_value', v);
      return `${c} ${str} ${typeStr}`;
    },
    [props.isLast, props.data.type],
  );

  useEffect(() => {
    const _v = Object.values(label[2]);
    if (_v.length && label[1]) {
      const _l = handleOptionsLabel(label[0], label[1], _v.length > 1 ? _v : _v[0]);
      props.onLabelChange?.(_l);
    }
  }, [label]);

  return (
    <div className="terms-params-item">
      <div
        className="params-item_button"
        onMouseOver={() => {
          if (props.isDelete) setDeleteVisible(true);
        }}
        onMouseOut={() => {
          if (props.isDelete) setDeleteVisible(false);
        }}
      >
        <DropdownButton
          options={handleOptions(paramOptions)}
          type="param"
          placeholder="请选择参数"
          value={column}
          fieldNames={{
            label: 'name',
            value: 'column',
          }}
          showLabelKey="fullName"
          isTree={true}
          onChange={(_value, item) => {
            setValue({
              value: undefined,
              source: 'manual',
            });
            // convertLabelValue(item);
            setColumn(_value!);
            ValueRef.current.column = _value!;
            const node = item.node;
            const _termTypeOptions: any[] =
              node.termTypes?.map((tItem: any) => ({ title: tItem.name, key: tItem.id })) || [];
            setTtOptions(_termTypeOptions);
            // 默认选中第一个
            let _termTypeValue = undefined;
            if (_termTypeOptions.length) {
              _termTypeValue = _termTypeOptions[0].key;
              label[1] = _termTypeValue;
              setTermType(_termTypeValue);
            } else {
              setTermType('');
            }
            label[0] = node.fullName;
            setLabel([...label]);
            valueChange({
              column: _value,
              value: {
                value: undefined,
                source: 'manual',
              },
              termType: _termTypeValue,
            });
          }}
        />
        <DropdownButton
          options={ttOptions}
          type="termType"
          placeholder="操作符"
          value={termType}
          onChange={(v) => {
            const _value = {
              ...value,
            };
            if (value && DoubleFilter.includes(v!)) {
              _value.value = [undefined, undefined];
            } else {
              _value.value = undefined;
            }
            setValue(_value);
            setTermType(v!);

            label[1] = v;
            setLabel([...label]);
            ValueRef.current.termType = v;
            valueChange({
              column: props.data.column,
              value: _value as TermsVale,
              termType: v,
            });
          }}
        />
        {DoubleFilter.includes(termType) ? (
          <>
            <ParamsDropdown
              options={valueOptions}
              metricsOptions={metricsOptions}
              type="value"
              placeholder="参数值"
              valueType={valueType}
              value={value}
              name={0}
              onChange={(v, lb) => {
                const _myValue = {
                  value: [v.value, ValueRef.current.value?.value?.[1]],
                  source: v.source,
                };
                ValueRef.current.value = _myValue;
                setValue(_myValue);
                label[2] = { ...label[2], 0: lb };
                setLabel([...label]);
                valueEventChange(_myValue);
              }}
            />
            <ParamsDropdown
              options={valueOptions}
              metricsOptions={metricsOptions}
              type="value"
              placeholder="参数值"
              valueType={valueType}
              value={value}
              name={1}
              onChange={(v, lb) => {
                const _myValue = {
                  value: [ValueRef.current.value?.value?.[0], v.value],
                  source: v.source,
                };
                ValueRef.current.value = _myValue;
                setValue(_myValue);
                label[2] = { ...label[2], 1: lb };
                setLabel([...label]);
                valueEventChange(_myValue);
              }}
            />
          </>
        ) : (
          <ParamsDropdown
            options={valueOptions}
            metricsOptions={metricsOptions}
            type="value"
            placeholder="参数值"
            valueType={valueType}
            value={value}
            onChange={(v, lb) => {
              setValue({
                ...v,
              });
              label[2] = { 0: lb };
              ValueRef.current.value = v;
              setLabel([...label]);
              valueEventChange(v);
            }}
          />
        )}
        <div
          className={classNames('button-delete', { show: deleteVisible })}
          onClick={props.onDelete}
        >
          <CloseOutlined />
        </div>
      </div>
      {!props.isLast ? (
        <div className="term-type-warp">
          <DropdownButton
            options={[
              { title: '并且', key: 'and' },
              { title: '或者', key: 'or' },
            ]}
            isTree={false}
            type="type"
            value={props.data.type}
            onChange={(v) => {
              props.data.type = v;
            }}
          />
        </div>
      ) : (
        <div className="term-add" onClick={props.onAdd}>
          <div className="terms-content">
            <PlusOutlined style={{ fontSize: 12, paddingRight: 4 }} />
            <span>条件</span>
          </div>
        </div>
      )}
    </div>
  );
});

export default ParamsItem;
