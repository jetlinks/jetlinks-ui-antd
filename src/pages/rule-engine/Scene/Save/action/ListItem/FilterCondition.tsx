import type { TermsType, TermsVale } from '@/pages/rule-engine/Scene/typings';
import { DropdownButton, ParamsDropdown } from '@/pages/rule-engine/Scene/Save/components/Buttons';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState, useCallback, useRef } from 'react';
import classNames from 'classnames';
import { observer } from '@formily/react';
import { message, Popconfirm, Space } from 'antd';
import './index.less';
import { AIcon } from '@/components';

interface FilterProps {
  branchesName: number;
  branchGroup?: number;
  action?: number;
  data: TermsType;
  isLast: boolean;
  isFirst: boolean;
  onChange?: (value: TermsType | any) => void;
  onValueChange: (value: TermsType) => void;
  onLabelChange: (lb: any[]) => void;
  options: any[];
  label?: any[];
  onAdd: () => void;
  onDelete: () => void;
  onColumns: (columns: string[]) => void;
  columns?: string[];
}

const handleName = (_data: any) => (
  <Space>
    {_data.name}
    {/*<div style={{ color: 'grey', marginLeft: '5px' }}>{_data.fullName}</div>*/}
    {_data.description && (
      <div style={{ color: 'grey', marginLeft: '5px' }}>({_data.description})</div>
    )}
  </Space>
);

const DoubleFilter = ['nbtw', 'btw', 'in', 'nin'];
const columnOptionsMap = new Map<string, any>();
export default observer((props: FilterProps) => {
  const [value, setValue] = useState<Partial<TermsVale> | undefined>({});
  const [termType, setTermType] = useState('');
  const [column, setColumn] = useState('');

  const [BuiltInOptions, setBuiltInOptions] = useState<any[]>([]);
  const [columnOptions, setColumnOptions] = useState<any[]>([]);
  const [ttOptions, setTtOptions] = useState<any>([]);
  const [valueOptions] = useState<any[]>([]);
  const [valueType, setValueType] = useState('');
  const labelCache = useRef<any[]>([undefined, undefined, {}, 'and']);
  const [paramsOpen, setParamsOpen] = useState(false);

  const [deleteVisible, setDeleteVisible] = useState(false);
  const columnsRef = useRef<string[]>([]);
  const oldLableRef = useRef<any>();

  const ValueRef = useRef<Partial<TermsType>>({
    column: '',
    termType: '',
    value: undefined,
  });

  const valueChange = useCallback(
    (_value: any) => {
      props.onValueChange?.({ ..._value });
    },
    [column, termType, value],
  );

  const valueEventChange = useCallback(
    (_v: any) => {
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
      if (columnValue) {
        const labelOptions = columnOptionsMap.get(columnValue);
        console.log('labelOptions------', labelOptions, props.data);
        if (labelOptions) {
          const _termTypeOptions: any[] =
            labelOptions?.termTypes?.map((tItem: any) => ({ title: tItem.name, key: tItem.id })) ||
            [];
          setTtOptions(_termTypeOptions);
          setValueType(labelOptions?.type);
          props.onChange?.(props.data);
        } else {
          props.onChange?.({});
          setTtOptions([]);
          setValueType('');
        }
      }
    },
    [props.data],
  );

  const handleTreeData = (data: any): any[] => {
    if (data.length > 0) {
      return data.map((item: any) => {
        const name = handleName(item);
        columnOptionsMap.set(item.id || item.column, item);
        if (item.children) {
          return {
            ...item,
            key: item.id,
            title: name,
            disabled: true,
            children: handleTreeData(item.children),
          };
        }
        return { ...item, key: item.id, title: name };
      });
    }
    return [];
  };

  useEffect(() => {
    if (props.data) {
      setColumn(props.data.column || '');
      setTermType(props.data.termType || '');
      setValue(props.data.value);
      ValueRef.current = props.data || {};
      handleTreeData(props.options || []);
      convertLabelValue(props.data.column);
    }
  }, [props.data]);

  useEffect(() => {
    columnOptionsMap.clear();
    const newOptions = handleTreeData(props.options || []);
    convertLabelValue(props.data?.column);
    setBuiltInOptions(newOptions);
    setColumnOptions(newOptions);
  }, [props.options]);

  useEffect(() => {
    labelCache.current = props.label || [undefined, undefined, {}, 'and'];
    console.log('labelCache.current-------', props.label);
    if (props.label) {
      oldLableRef.current = props.label;
    }
  }, [props.label]);

  useEffect(() => {
    columnsRef.current = props.columns || [];
  }, [props.columns]);

  return (
    <div className="filter-condition-warp">
      {!props.isFirst && (
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
              labelCache.current[3] = v;
              props.onLabelChange?.([...labelCache.current]);
            }}
          />
        </div>
      )}
      <div
        className="filter-condition-content"
        onMouseOver={() => {
          setDeleteVisible(true);
        }}
        onMouseOut={() => {
          setDeleteVisible(false);
        }}
      >
        <Popconfirm title={'确认删除？'} onConfirm={props.onDelete}>
          <div className={classNames('filter-condition-delete', { show: deleteVisible })}>
            <CloseOutlined />
          </div>
        </Popconfirm>
        <DropdownButton
          options={columnOptions}
          type="param"
          placeholder="请选择参数"
          value={column}
          showLabelKey="fullName"
          isTree={true}
          onChange={(_value, item) => {
            // console.log('_value-----',_value)

            setValue({
              value: undefined,
              source: 'fixed',
            });
            // paramChange(item);
            setColumn(_value!);
            const node = item.node;
            const _termTypeOptions: any[] =
              node.termTypes?.map((tItem: any) => ({ title: tItem.name, key: tItem.id })) || [];
            setTtOptions(_termTypeOptions);
            if (node.metadata) {
              columnsRef.current[0] = node.column;
            } else {
              columnsRef.current = [];
            }
            console.log('columnsRef.current', columnsRef.current);
            props.onColumns(columnsRef.current);
            // 默认选中第一个
            let _termTypeValue = undefined;
            if (_termTypeOptions.length) {
              _termTypeValue = _termTypeOptions[0].key;
              labelCache.current[1] = _termTypeValue;
              setTermType(_termTypeValue);
            } else {
              labelCache.current[1] = '';
              setTermType('');
            }
            ValueRef.current.column = _value!;
            labelCache.current[0] = node.fullName;

            valueChange({
              column: _value,
              value: {
                value: undefined,
                source: 'fixed',
              },
              termType: _termTypeValue,
            });
          }}
          icon={<AIcon type={'icon-zhihangdongzuoxie-1'} />}
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

            labelCache.current[1] = v;
            ValueRef.current.termType = v;
            columnsRef.current.length = 1;
            valueChange({
              column: props.data!.column,
              value: _value as TermsVale,
              termType: v,
            });
          }}
        />
        {DoubleFilter.includes(termType) ? (
          <>
            <ParamsDropdown
              options={valueOptions}
              type="value"
              placeholder="参数值"
              valueType={valueType}
              open={paramsOpen}
              openChange={(_open) => {
                if (ValueRef.current.column) {
                  setParamsOpen(_open);
                } else {
                  setParamsOpen(false);
                  message.warning('请先选择参数');
                }
              }}
              value={value}
              BuiltInOptions={BuiltInOptions}
              showLabelKey="fullName"
              name={0}
              onChange={(v, lb, node) => {
                const _myValue = {
                  value: [v.value, ValueRef.current.value?.value?.[1]],
                  source: v.source,
                };
                ValueRef.current.value = _myValue;
                setValue(_myValue);
                labelCache.current[2] = { ...labelCache.current[2], 0: lb };
                labelCache.current[3] = props.data.type;

                if (v.source === 'upper') {
                  if (node.metadata) {
                    columnsRef.current[1] = node.column;
                  } else {
                    columnsRef.current.splice(1, 1);
                  }
                } else {
                  columnsRef.current.length = 1;
                }
                props.onColumns(columnsRef.current);
                props.onLabelChange?.(labelCache.current);
                valueEventChange(_myValue);
              }}
              icon={<AIcon type={'icon-canshu'} style={{ fontSize: 16 }} />}
            />
            <ParamsDropdown
              options={valueOptions}
              type="value"
              placeholder="参数值"
              valueType={valueType}
              open={paramsOpen}
              openChange={(_open) => {
                if (ValueRef.current.column) {
                  setParamsOpen(_open);
                } else {
                  setParamsOpen(false);
                  message.warning('请先选择参数');
                }
              }}
              value={value}
              BuiltInOptions={BuiltInOptions}
              showLabelKey="fullName"
              name={1}
              onChange={(v, lb, node) => {
                const _myValue = {
                  value: [ValueRef.current.value?.value?.[0], v.value],
                  source: v.source,
                };
                ValueRef.current.value = _myValue;
                setValue(_myValue);
                labelCache.current[2] = { ...labelCache.current[2], 1: lb };
                labelCache.current[3] = props.data.type;

                if (v.source === 'upper') {
                  if (node.metadata) {
                    columnsRef.current[2] = node.column;
                  } else {
                    columnsRef.current.splice(2, 1);
                  }
                } else {
                  columnsRef.current.length = 1;
                }
                props.onColumns(columnsRef.current);
                props.onLabelChange?.(labelCache.current);
                valueEventChange(_myValue);
              }}
              icon={<AIcon type={'icon-canshu'} style={{ fontSize: 16 }} />}
            />
          </>
        ) : (
          <ParamsDropdown
            options={valueOptions}
            type="value"
            placeholder="参数值"
            valueType={valueType}
            open={paramsOpen}
            openChange={(_open) => {
              if (ValueRef.current.column) {
                setParamsOpen(_open);
              } else {
                setParamsOpen(false);
                message.warning('请先选择参数');
              }
            }}
            value={value}
            BuiltInOptions={BuiltInOptions}
            showLabelKey="fullName"
            onChange={(v, lb, node) => {
              setValue({
                ...v,
              });
              console.log('node.column-----', node);
              if (v.source === 'upper') {
                if (node.metadata) {
                  columnsRef.current[1] = node.column;
                } else {
                  columnsRef.current.splice(1, 1);
                }
              } else {
                columnsRef.current.length = 1;
              }

              props.onColumns(columnsRef.current);
              labelCache.current[2] = { 0: lb };
              labelCache.current[3] = props.data.type;
              props.onLabelChange?.(labelCache.current);
              valueEventChange(v);
            }}
            icon={<AIcon type={'icon-canshu'} style={{ fontSize: 16 }} />}
          />
        )}
      </div>
      {props.isLast && (
        <div className="terms-add" onClick={props.onAdd}>
          <div className="terms-content">
            <PlusOutlined style={{ fontSize: 12 }} />
          </div>
        </div>
      )}
    </div>
  );
});
