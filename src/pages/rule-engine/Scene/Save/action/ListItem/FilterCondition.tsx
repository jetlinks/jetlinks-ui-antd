import type { TermsType, TermsVale } from '@/pages/rule-engine/Scene/typings';
import { DropdownButton, ParamsDropdown } from '@/pages/rule-engine/Scene/Save/components/Buttons';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState, useCallback } from 'react';
import classNames from 'classnames';
import { observer } from '@formily/react';
import { queryBuiltInParams } from '@/pages/rule-engine/Scene/Save/action/service';
import '../index.less';
import { FormModel } from '../..';
import { Space } from 'antd';

interface FilterProps {
  thenName: number;
  data?: TermsType;
  onChange: (value: TermsType) => void;
  onLableChange: (lb: string) => void;
  onAdd: () => void;
  onDelete: () => void;
}

const DoubleFilter = ['nbtw', 'btw'];
export default observer((props: FilterProps) => {
  const [value, setValue] = useState<Partial<TermsVale> | undefined>({});
  const [termType, setTermType] = useState('');
  const [column, setColumn] = useState('');

  const [BuiltInOptions, setBuiltInOptions] = useState<any[]>([]);
  const [columnOptions, setColumnOptions] = useState<any[]>([]);
  const [ttOptions, setTtOptions] = useState<any[]>([]);
  const [valueOptions] = useState<any[]>([]);
  const [valueType, setValueType] = useState('');
  const [label, setLabel] = useState<any[]>([undefined, undefined, {}]);

  const valueChange = useCallback(
    (_value: any) => {
      props.onChange?.({ ..._value });
    },
    [column, termType, value],
  );

  const valueEventChange = useCallback(
    (_v: any) => {
      valueChange({
        column,
        termType,
        value: _v,
      });
    },
    [column, termType],
  );

  const paramChange = (item: any) => {
    const node = item.node;
    const _termTypeOptions: any[] =
      node.termTypes?.map((tItem: any) => ({ title: tItem.name, key: tItem.id })) || [];
    setTtOptions(_termTypeOptions);
    setValueType(node.dataType);
  };

  const handleName = (data: any) => {
    return (
      <Space>
        {data.name}
        {data.description && (
          <div style={{ color: 'grey', marginLeft: '5px' }}>({data.description})</div>
        )}
      </Space>
    );
  };

  const handleTreeData = (data: any): any[] => {
    if (data.length > 0) {
      return data.map((item: any) => {
        const name = handleName(item);
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

  const getParmas = () => {
    queryBuiltInParams(FormModel, { action: props.thenName }).then((res: any) => {
      if (res.status === 200) {
        const params = handleTreeData(res.result);
        setColumnOptions(params);
        setBuiltInOptions(params);
      }
    });
  };

  const handleOptionsLabel = (c: string, t: string, v: any) => {
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
    };

    if (DoubleFilter.includes(t)) {
      const str = termsTypeKey[t].replace('_value', v[0]).replace('_value2', v[1]);
      return `${c} ${str}`;
    }
    const str = termsTypeKey[t].replace('_value', v);
    return `${c} ${str}`;
  };

  useEffect(() => {
    const _v = Object.values(label[2]);
    if (_v.length && label[1]) {
      const _l = handleOptionsLabel(label[0], label[1], _v.length > 1 ? _v : _v[0]);
      props.onLableChange?.(_l);
    }
  }, [label]);

  useEffect(() => {
    if (props.data) {
      setColumn(props.data.column || '');
      setTermType(props.data.termType || '');
      setValue(props.data.value);
    }
  }, [props.data]);

  useEffect(() => {
    if (props.data) {
      getParmas();
    }
  }, []);

  return (
    <div className="filter-condition-warp">
      {props.data ? (
        <div className="filter-condition-content">
          <div
            className={classNames('filter-condition-delete denger show')}
            onClick={props.onDelete}
          >
            <DeleteOutlined />
          </div>
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
                source: 'manual',
              });
              paramChange(item);
              setColumn(_value!);
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

              valueChange({
                column: props.data!.column,
                value: value as TermsVale,
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
                  setValue({
                    ...v,
                  });
                  label[2] = { ...label[2], 0: lb };
                  setLabel([...label]);
                  valueEventChange(v);
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
                  setValue({
                    ...v,
                  });
                  label[2] = { ...label[2], 1: lb };
                  setLabel([...label]);
                  valueEventChange(v);
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
                label[2] = { 0: lb };
                setLabel([...label]);
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
            getParmas();
          }}
        >
          <PlusOutlined style={{ paddingRight: 16 }} /> 添加过滤条件
        </div>
      )}
    </div>
  );
});
