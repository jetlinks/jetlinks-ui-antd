import { Col, DatePicker, Input, InputNumber, Row, Select, TreeSelect } from 'antd';
import type { FormInstance } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { queryBuiltInParams } from '@/pages/rule-engine/Scene/Save/action/service';
import moment from 'moment';
import { ItemGroup } from '@/pages/rule-engine/Scene/Save/components';
import { Space } from '@formily/antd';
import { cloneDeep } from 'lodash';

interface WritePropertyProps {
  properties: any[];
  type: string;
  form: FormInstance;
  value?: any;
  onChange?: (value?: any) => void;
  propertiesChange?: (value?: string) => void;
  parallel?: boolean;
  name: number;
  trigger?: any;
  productId: string;
  isEdit?: boolean;
  id?: string;
}

export default (props: WritePropertyProps) => {
  const [source, setSource] = useState('fixed');
  const [builtInList, setBuiltInList] = useState<any[]>([]);
  const [propertiesKey, setPropertiesKey] = useState<string | undefined>(undefined);
  const [propertiesValue, setPropertiesValue] = useState(undefined);
  const [propertiesType, setPropertiesType] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const paramsListRef = useRef<any[]>();

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
          return { ...item, name, disabled: true, children: handleTreeData(item.children) };
        }
        return { ...item, name };
      });
    }
    return [];
  };

  const onChange = (key?: string, value?: any, _source: string = 'fixed') => {
    if (props.onChange) {
      props.propertiesChange?.(key);
      props.onChange({
        [key || 0]: {
          value: value,
          source: _source,
        },
      });
    }
  };

  const filterParamsData = (type?: string, data?: any[]): any[] => {
    if (type && data) {
      return data.filter((item) => {
        if (item.children) {
          const _children = filterParamsData(type, item.children);
          item.children = _children;
          return _children.length ? true : false;
        } else if (item.type === type) {
          return true;
        }
        return false;
      });
    }
    return data || [];
  };

  const sourceChangeEvent = useCallback(() => {
    onChange(propertiesKey, undefined, source);
    const params = props.name - 1 >= 0 ? { action: props.name - 1 } : undefined;
    const data = props.form.getFieldsValue();
    queryBuiltInParams(data, params).then((res: any) => {
      if (res.status === 200) {
        // const actionParams = res.result.filter((item: any) => item.id === `action_${props.name}`);
        // 获取当前属性类型，过滤不同类型的数据
        const propertiesItem = props.properties
          .filter((item) => {
            if (item.expands && item.expands.type) {
              return item.expands.type.includes('write');
            }
            return false;
          })
          .find((item) => item.id === propertiesKey);
        const type = propertiesItem?.valueType?.type;
        // const _params = props.name === 0 ? res.result : actionParams;
        const _params = res.result;
        paramsListRef.current = cloneDeep(_params);
        const _filterData = filterParamsData(type, _params);
        const _data = handleTreeData(_filterData);
        setBuiltInList(_data);
      }
    });
  }, [props.properties, propertiesKey, source]);

  useEffect(() => {
    if (source === 'upper' && isEdit) {
      sourceChangeEvent();
    }
  }, [source, props.type, props.parallel]);

  useEffect(() => {
    if (props.isEdit) {
      setIsEdit(false);
      const params = props.name - 1 >= 0 ? { action: props.name - 1 } : undefined;
      const data = props.form.getFieldsValue();
      queryBuiltInParams(data, params).then((res: any) => {
        if (res.status === 200) {
          // const actionParams = res.result.filter((item: any) => item.id === `action_${props.name}`);
          // 获取当前属性类型，过滤不同类型的数据
          const propertiesItem = props.properties
            .filter((item) => {
              if (item.expands && item.expands.type) {
                return item.expands.type.includes('write');
              }
              return false;
            })
            .find((item) => item.id === propertiesKey);
          const type = propertiesItem?.valueType?.type;
          const _params = res.result;
          paramsListRef.current = cloneDeep(_params);
          const _filterData = filterParamsData(type, _params);
          const _data = handleTreeData(_filterData);
          setBuiltInList(_data);
        }
      });
    }
    setTimeout(() => {
      setIsEdit(true);
    }, 300);
  }, [props.isEdit]);

  useEffect(() => {
    if (props.trigger?.trigger?.device?.productId && source === 'upper' && isEdit) {
      sourceChangeEvent();
    }
  }, [props.trigger?.trigger?.device?.productId, source]);

  // useEffect(() => {
  //   if (props.productId) {
  //     setPropertiesKey(undefined);
  //     onChange('undefined', undefined, source);
  //   }
  // }, [props.productId]);

  useEffect(() => {
    console.log(props.value);
    if (props.value) {
      if (props.properties && props.properties.length) {
        if (0 in props.value) {
          setPropertiesValue(props.value[0]);
        } else if ('undefined' in props.value) {
          setPropertiesKey(undefined);
          setPropertiesValue(undefined);
        } else {
          Object.keys(props.value).forEach((key: string) => {
            setPropertiesKey(key);
            setPropertiesValue(props.value[key].value);
            setSource(props.value[key].source);
            const propertiesItem = props.properties.find((item: any) => item.id === key);
            if (propertiesItem) {
              setPropertiesType(propertiesItem.valueType.type);
            }
          });
        }
      }
    } else {
      setPropertiesKey(undefined);
      setPropertiesValue(undefined);
    }
  }, [props.value, props.properties]);

  const inputNodeByType = useCallback(
    (type: string) => {
      switch (type) {
        case 'boolean':
          return (
            <Select
              style={{ width: '100%', textAlign: 'left' }}
              value={propertiesValue}
              options={[
                { label: 'true', value: true },
                { label: 'false', value: false },
              ]}
              placeholder={'请选择'}
              onChange={(value) => {
                onChange(propertiesKey, value, source);
              }}
            />
          );
        case 'int':
        case 'long':
        case 'float':
        case 'double':
          return (
            <InputNumber
              style={{ width: '100%' }}
              value={propertiesValue}
              placeholder={'请输入'}
              onChange={(value) => {
                onChange(propertiesKey, value, source);
              }}
            />
          );
        case 'date':
          return (
            // @ts-ignore
            <DatePicker
              style={{ width: '100%' }}
              value={propertiesValue ? moment(propertiesValue, 'YYYY-MM-DD HH:mm:ss') : undefined}
              onChange={(date) => {
                onChange(
                  propertiesKey,
                  date ? date.format('YYYY-MM-DD HH:mm:ss') : undefined,
                  source,
                );
              }}
            />
          );
        default:
          return (
            <Input
              style={{ width: '100%' }}
              value={propertiesValue}
              placeholder={'请输入'}
              onChange={(e) => onChange(propertiesKey, e.target.value, source)}
            />
          );
      }
    },
    [propertiesKey, propertiesValue, source],
  );

  return (
    <Row gutter={24}>
      <Col span={6}>
        <Select
          value={propertiesKey}
          id={props.id}
          options={props.properties.filter((item) => {
            if (item.expands && item.expands.type) {
              return item.expands.type.includes('write');
            }
            return false;
          })}
          fieldNames={{ label: 'name', value: 'id' }}
          style={{ width: '100%' }}
          onSelect={(key: any, node: any) => {
            onChange(key, undefined, source);
            if (source === 'upper') {
              const newArr = cloneDeep(paramsListRef.current);
              const _filterData = filterParamsData(node?.valueType?.type, newArr);
              const _data = handleTreeData(_filterData);
              setBuiltInList(_data);
            }
          }}
          placeholder={'请选择属性'}
        ></Select>
      </Col>
      <Col span={18}>
        <ItemGroup compact>
          <Select
            value={source}
            options={[
              { label: '手动输入', value: 'fixed' },
              { label: '内置参数', value: 'upper' },
            ]}
            style={{ width: 120 }}
            onChange={(key) => {
              setSource(key);
              onChange(propertiesKey, undefined, key);
            }}
          />
          {source === 'upper' ? (
            <TreeSelect
              placeholder={'请选择参数'}
              fieldNames={{
                value: 'id',
                label: 'name',
              }}
              value={propertiesValue}
              treeData={builtInList}
              onSelect={(value: any) => {
                onChange(propertiesKey, value, source);
              }}
            />
          ) : (
            // <Select
            //   options={builtInList}
            //   fieldNames={{ label: 'name', value: 'id' }}
            //   placeholder={'请选择参数'}
            //   onSelect={(value: any) => {
            //     onChange(propertiesKey, value);
            //   }}
            // />
            <div>{inputNodeByType(propertiesType)}</div>
          )}
        </ItemGroup>
      </Col>
    </Row>
  );
};
