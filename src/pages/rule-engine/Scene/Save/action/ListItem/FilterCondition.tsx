import type { TermsType, TermsVale } from '@/pages/rule-engine/Scene/typings';
import { DropdownButton, ParamsDropdown } from '@/pages/rule-engine/Scene/Save/components/Buttons';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState, useCallback, useRef } from 'react';
import classNames from 'classnames';
import { observer } from '@formily/react';
import { queryBuiltInParams } from '@/pages/rule-engine/Scene/Save/action/service';
import '../index.less';
import { FormModel } from '../..';
import { Popconfirm, Space } from 'antd';
import { cloneDeep } from 'lodash';

interface FilterProps {
  thenName: number;
  branchGroup?: number;
  action?: number;
  data?: TermsType;
  onChange: (value: TermsType) => void;
  onLabelChange: (lb: string[]) => void;
  label?: any[];
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
//
// const handleOptions = (options: any[]): any[] => {
//   if (!options) return []
//
//   return options.map(item => {
//     const disabled = item.children?.length > 0;
//     return {
//       ...item,
//       column: item.column,
//       key: item.column,
//       value: item.column,
//       title: handleName(item),
//       disabled: disabled,
//       children: handleOptions(item.children),
//     };
//   })
// }

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
  const labelCache = useRef<any[]>([undefined, undefined, {}]);

  const ValueRef = useRef<Partial<TermsType>>({
    column: '',
    termType: '',
    value: undefined,
  });

  const valueChange = useCallback(
    (_value: any) => {
      props.onChange?.({ ..._value });
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

  const convertLabelValue = (columnValue?: string) => {
    if (columnValue) {
      const labelOptions = columnOptionsMap.get(columnValue);
      if (!labelOptions) return;

      const _termTypeOptions: any[] =
        labelOptions?.termTypes?.map((tItem: any) => ({ title: tItem.name, key: tItem.id })) || [];
      setTtOptions(_termTypeOptions);
      setValueType(labelOptions?.type);
    }
  };

  const handleTreeData = (data: any): any[] => {
    if (data.length > 0) {
      return data.map((item: any) => {
        const name = handleName(item);
        columnOptionsMap.set(item.id || item.column, item);
        if (item.children) {
          return {
            ...item,
            key: item.id,
            fullName: item.name,
            title: name,
            disabled: true,
            children: handleTreeData(item.children),
          };
        }
        return { ...item, key: item.id, fullName: item.name, title: name };
      });
    }
    return [];
  };

  const getParams = useCallback(() => {
    const _params = {
      branch: props.thenName,
      branchGroup: props.branchGroup,
      action: props.action,
    };
    columnOptionsMap.clear();
    const newData = cloneDeep(FormModel.current);
    newData.branches = newData.branches?.filter((item) => !!item);
    queryBuiltInParams(newData, _params).then((res: any) => {
      if (res.status === 200) {
        const params = handleTreeData(
          // res.result.filter((item: any) => !item.id.includes(`action_${props.action}`)),
          res.result,
        );
        setColumnOptions(params);
        setBuiltInOptions(params);
        convertLabelValue(props.data?.column);
      }
    });
  }, [props.data?.column]);

  useEffect(() => {
    if (props.data) {
      setColumn(props.data.column || '');
      setTermType(props.data.termType || '');
      setValue(props.data.value);
      ValueRef.current = props.data || {};
      convertLabelValue(props.data.column);
    }
  }, [props.data]);

  useEffect(() => {
    if (props.data) {
      getParams();
    }
  }, []);

  useEffect(() => {
    labelCache.current = props.label || [undefined, undefined, {}];
  }, [props.label]);

  return (
    <div className="filter-condition-warp">
      {props.data ? (
        <div className="filter-condition-content">
          <Popconfirm title={'确认删除？'} onConfirm={props.onDelete}>
            <div className={classNames('filter-condition-delete danger show')}>
              <DeleteOutlined />
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
                value={value}
                BuiltInOptions={BuiltInOptions}
                showLabelKey="fullName"
                name={0}
                onChange={(v, lb) => {
                  const _myValue = {
                    value: [v.value, ValueRef.current.value?.value?.[1]],
                    source: v.source,
                  };
                  ValueRef.current.value = _myValue;
                  setValue(_myValue);
                  labelCache.current[2] = { ...labelCache.current[2], 0: lb };
                  props.onLabelChange?.(labelCache.current);
                  valueEventChange(_myValue);
                }}
              />
              <ParamsDropdown
                options={valueOptions}
                type="value"
                placeholder="参数值"
                valueType={valueType}
                value={value}
                BuiltInOptions={BuiltInOptions}
                showLabelKey="fullName"
                name={1}
                onChange={(v, lb) => {
                  const _myValue = {
                    value: [ValueRef.current.value?.value?.[0], v.value],
                    source: v.source,
                  };
                  ValueRef.current.value = _myValue;
                  setValue(_myValue);
                  labelCache.current[2] = { ...labelCache.current[2], 1: lb };
                  props.onLabelChange?.(labelCache.current);
                  valueEventChange(_myValue);
                }}
              />
            </>
          ) : (
            <ParamsDropdown
              options={valueOptions}
              type="value"
              placeholder="参数值"
              valueType={valueType}
              value={value}
              BuiltInOptions={BuiltInOptions}
              showLabelKey="fullName"
              onChange={(v, lb) => {
                setValue({
                  ...v,
                });
                labelCache.current[2] = { 0: lb };
                props.onLabelChange?.(labelCache.current);
                valueEventChange(v);
              }}
            />
          )}
        </div>
      ) : (
        <div
          className="filter-add-button"
          onClick={() => {
            props.onAdd();
            getParams();
          }}
        >
          <PlusOutlined style={{ paddingRight: 16 }} /> 添加过滤条件
        </div>
      )}
    </div>
  );
});
